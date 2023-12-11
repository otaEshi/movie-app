from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from pydantic import BaseModel
from sql.database import SessionLocal, Base, engine
from sql.schemas import User, UserCreate, MovieListCreate, MovieCreate
from sql import crud
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

Base.metadata.create_all(bind=engine)
app = FastAPI()
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=['*'],
    allow_methods=['*'],
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "03428be03e2e0504ab5591f83273f8ef7d559acc8bb672db51df35b4c7db259c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class CurrentUser(BaseModel):
    username: str
    email: str
    name: str
    year_of_birth: int
    month_of_birth: int
    day_of_birth: int

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

IMAGES_PATH = "images"
if not os.path.exists(IMAGES_PATH):
    os.makedirs(IMAGES_PATH)

### IMAGES ###
@app.get("/images/{image_id}", tags=["Images"])
async def read_image(image_id: str):
    """
        Retrieve an image from the server.
    """
    if not os.path.exists(f"{IMAGES_PATH}/{image_id}"):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(f"{IMAGES_PATH}/{image_id}")

async def save_image(image):
    """
        Save an image to the server.
    """
    image_id = str(uuid.uuid4())
    if os.path.exists(f"{IMAGES_PATH}/{image_id}"):
        raise HTTPException(status_code=500, detail="Image ID already exists")
    with open(f"{IMAGES_PATH}/{image_id}", "wb") as buffer:
        buffer.write(image)

### USERS ###

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    """
        Create an access token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """
        Get the current user

        Args:
            token (str): The token of the user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        print(e)
        raise credentials_exception
    user = await crud.get_user(get_db(), user_id=user_id)
    if user is None:
        raise credentials_exception
    return user

async def is_admin(user: User = Depends(get_current_user)):
    if not user.is_admin:
        return False

@app.post("/signup", response_model=User, tags=["Users"])
async def create_user(user: UserCreate, db:Session = Depends(get_db)):
    """
        Create a user
    """
    db_user = await crud.create_user(db, user)
    return db_user

@app.post("/login", response_model=Token, tags=["Users"])
@app.post("/token", response_model=Token, tags=["Users"])
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user = await crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=CurrentUser, tags=["Users"])
async def read_users_me(
    current_user: User = Depends(get_current_user)
):
    return current_user

@app.post("/users/me/change_password", tags=["Users"])
async def change_password(
    old_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
        Change the password of the current user.
    """
    args = {
        "old_password": old_password,
        "new_password": new_password
    }
    await crud.change_password(db, args, current_user.id)
    return {"message": "Password changed successfully"}

@app.get("/users", tags=["Users"])
async def read_users(skip: int = 0, 
                    limit: int = 100, 
                    db: Session = Depends(get_db)):
    """
        Retrieve a list of users from the database.
    """
    if not is_admin():
        raise HTTPException(status_code=401, detail="Unauthorized")
    users = await crud.get_users(db, skip=skip, limit=limit)
    return users

### MOVIE LISTS ###
@app.get("/movie_lists", tags=["Movie Lists"])
async def read_movie_lists(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
        Retrieve a list of movie lists from the database.
    """
    movie_lists = await crud.get_movie_lists(db, skip=skip, limit=limit)
    return movie_lists

@app.get("/movie_lists/{movie_list_id}", tags=["Movie Lists"])
async def read_movie_list(movie_list_id: int, db: Session = Depends(get_db)):
    """
        Retrieve a movie list from the database by its ID.
    """
    movie_list = await crud.get_movie_list(db, movie_list_id=movie_list_id)
    return movie_list

@app.post("/movie_lists", tags=["Movie Lists"])
async def create_movie_list(movie_list: MovieListCreate, 
                            db: Session = Depends(get_db), 
                            current_user: User = Depends(get_current_user)):
    """
        Create a new movie list in the database.
    """
    if not is_admin():
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await crud.create_movie_list(db, movie_list=movie_list, user_id=current_user.id)

### MOVIES ###
@app.get("/movies", tags=["Movies"])
async def read_movies(skip: int = 0, 
                      limit: int = 100, 
                      title: str = None,
                      des: str = None,
                      d: int = None,
                      m: int = None,
                      y: int = None,
                      db: Session = Depends(get_db)):
    """
        Retrieve a list of movies from the database.
    """
    search_params = {
        "title": title,
        "des": des,
        "d": d,
        "m": m,
        "y": y
    }
    search_params = {k: v for k, v in search_params.items() if v is not None}
    movies = await crud.get_movies(db, skip=skip, limit=limit, search_params=search_params)
    return movies

@app.post("/register_view/{movie_id}", tags=["Movies"])
async def register_view(movie_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Register a view of a movie.
    """
    if current_user is None:
        raise HTTPException(status_code=403, detail="Unauthenticated")
    
    await crud.register_view(db, movie_id=movie_id)
    return {"message": "View registered successfully"}

@app.post("/movies", tags=["Movies"])
async def create_movie(movie: MovieCreate, 
                       movie_list_id: int,
                       db: Session = Depends(get_db)):
    """
        Create a new movie in the database.
    """
    if not is_admin():
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await crud.create_movie(db, movie=movie, movie_list_id=movie_list_id)