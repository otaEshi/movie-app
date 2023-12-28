from datetime import datetime, timedelta, date
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from pydantic import BaseModel
from sql.database import SessionLocal, Base, engine
from sql.schemas import *
from sql import crud
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
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
    """
        Token model

        Attributes:
            access_token (str): The access token.
            token_type (str): The token type.
    """
    access_token: str
    token_type: str

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

async def save_image(image:UploadFile):
    """
        Save an image to the server.
    """
    image.filename = image.filename.replace(" ", "")
    image_id = str(uuid.uuid4()) + image.filename
    if os.path.exists(f"{IMAGES_PATH}/{image_id}"):
        raise HTTPException(status_code=500, detail="Image ID already exists")
    with open(f"{IMAGES_PATH}/{image_id}", "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    return image_id

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
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        raise credentials_exception from e
    user = await crud.get_user(get_db(), user_id=user_id)
    if user is None:
        raise credentials_exception
    return user

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

@app.get("/users/me", tags=["Users"])
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
    args = UserEditPassword(old_password=old_password, new_password=new_password)
    await crud.change_password(db, args, current_user.id)
    return {"detail": "PASSWORD_CHANGE_OK"}

@app.patch("/users/me", tags=["Users"])
async def update_user(
    name: str = None,
    date_of_birth: date = None,
    avatar: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
        Update the current user.
    """
    args = UserEdit(name=name, date_of_birth=date_of_birth)
    if avatar is not None:
        args.avatar_id = await save_image(avatar)
    await crud.update_user(db, args, current_user.id)
    return {"detail": "USER_UPDATE_OK"}

@app.get("/users", tags=["Users"])
async def read_users(page: int = 0, page_size: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Retrieve a list of users from the database.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    users = await crud.get_users(db, page, page_size)
    return users

### MOVIE LISTS ###
@app.get("/movie_lists", tags=["Movie Lists"])
async def read_movie_lists(page: int = 0, page_size: int = 10, include_deleted: bool = False, db: Session = Depends(get_db), current_user: User = Depends(get_current_user), get_public: bool = False):
    """
        Retrieve a list of movie lists from the database.
    """
    movie_lists = await crud.get_movie_lists(db, page, page_size, current_user, get_public, include_deleted)
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
    return await crud.create_movie_list(db, movie_list=movie_list, user_id=current_user.id)

@app.patch("/movie_lists/{movie_list_id}", tags=["Movie Lists"])
async def update_movie_list(movie_list_id: int,
                            movie_list: MovieListEdit, 
                            movie_ids: list[int] = None,
                            db: Session = Depends(get_db), 
                            current_user: User = Depends(get_current_user)):
    """
        Update a movie list in the database.
    """
    return await crud.update_movie_list(db,movie_list_id, current_user.id, movie_list, movie_ids)

@app.delete("/movie_lists/{movie_list_id}", tags=["Movie Lists"])
async def delete_movie_list(movie_list_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Delete a movie from a movie list.
    """
    return await crud.delete_movie_list(db, movie_list_id,current_user.id)

### MOVIES ###
@app.get("/movies", tags=["Movies"])
async def read_movies(page: int = 0, 
                      page_size: int = 100, 
                      title: str = None,
                      des: str = None,
                      source: str = None,
                      d: int = None,
                      m: int = None,
                      y: int = None,
                      include_deleted: bool = False,
                      db: Session = Depends(get_db)):
    """
        Retrieve a list of movies from the database.
    """
    search_params = {
        "title": title,
        "des": des,
        "source": source,
        "d": d,
        "m": m,
        "y": y,
    }

    if not include_deleted:
        search_params["is_deleted"] = False

    search_params = {k: v for k, v in search_params.items() if v is not None}
    movies = await crud.get_movies(db, page, page_size, search_params)
    return movies

@app.get("/movies/top_trending", tags=["Movies"])
async def read_top_trending_movies(db: Session = Depends(get_db), top_k: int = 10, genre: str = None):
    """
        Retrieve a list of top trending movies from the database.
    """
    search_params = {}
    if genre is not None:
        search_params["genre"] = genre
    movies = await crud.get_top_trending_movies(db, top_k, search_params)
    return movies

@app.get("/movies/{movie_id}", tags=["Movies"])
async def read_movie(movie_id: int, db: Session = Depends(get_db)):
    """
        Retrieve a movie from the database by its ID.
    """
    movie = await crud.get_movie(db, movie_id=movie_id)
    return movie

@app.post("/register_view/{movie_id}", tags=["Movies"])
async def register_view(movie_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Register a view of a movie.
    """
    if current_user is None:
        raise HTTPException(status_code=403, detail="Unauthenticated")
    
    return await crud.register_view(db, movie_id=movie_id)

@app.post("/movies", tags=["Movies"])
async def create_movie( title:str,
                        description: str,
                        date_of_release: datetime,
                        url: str,
                        genre: str,
                        image: UploadFile = File(...), 
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """
        Create a new movie in the database.
    """
    if not current_user.is_content_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    movie = MovieCreate(title=title, description=description, date_of_release=date_of_release, url=url, genre=genre)
    movie.thumbnail_id = await save_image(image)
    return await crud.create_movie(db, movie=movie)

@app.patch("/movies/{movie_id}", tags=["Movies"])
async def update_movie(movie_id: int,
                        title: str = None,
                        description: str = None,
                        date_of_release: date = None,
                        url: str = None,
                        genre: str = None,
                        source: str = None,
                        image: UploadFile = File(None),
                        is_deleted: bool = None, 
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """
        Update a movie in the database.
    """
    if not current_user.is_content_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    movie = MovieEdit(title=title, description=description, date_of_release=date_of_release, url=url, genre=genre, source=source, is_deleted=is_deleted)
    if image is not None:
        movie.thumbnail_id = await save_image(image)
    return await crud.update_movie(db, movie_id=movie_id, movie=movie)

@app.delete("/movies/{movie_id}", tags=["Movies"])
async def delete_movie(movie_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Delete a movie from the database.
    """
    if not current_user.is_content_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await crud.delete_movie(db, movie_id=movie_id)

### MOVIE RATINGS ###
@app.get("/movies/{movie_id}/ratings/average", tags=["Movies Rating"])
async def read_movie_ratings_average(movie_id: int, db: Session = Depends(get_db)):
    """
        Retrieve the average rating of a movie from the database.
    """
    return await crud.get_movie_ratings_average(db, movie_id=movie_id)

@app.get("/movies/{movie_id}/ratings", tags=["Movies Rating"])
async def read_movie_ratings(movie_id: int, page:int, page_size:int, db: Session = Depends(get_db)):
    """
        Retrieve a list of ratings of a movie from the database.
    """
    return await crud.get_movie_ratings(db, movie_id=movie_id, page=page, page_size=page_size)

@app.post("/movies/{movie_id}/ratings", tags=["Movies Rating"])
async def create_movie_rating(movie_id: int, rating: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Create a new rating of a movie in the database.
    """
    movie_rating_create = MovieRatingCreate(movie_id=movie_id, rating=rating, user_id=current_user.id, created_at=datetime.now())
    return await crud.create_movie_rating(db, movie_rating_create)

@app.patch("/movies/{movie_id}/ratings", tags=["Movies Rating"])
async def update_movie_rating(movie_rating_id: int, rating: int, is_deleted: bool, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Update a rating of a movie in the database.
    """
    movie_rating_edit = MovieRatingEdit(rating=rating, is_deleted=is_deleted)
    return await crud.update_movie_rating(db, movie_rating_id, movie_rating_edit, current_user.id)

@app.delete("/movies/{movie_id}/ratings", tags=["Movies Rating"])
async def delete_movie_rating(movie_rating_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Delete a rating of a movie from the database.
    """
    return await crud.delete_movie_rating(db, movie_rating_id, current_user.id)

### MOVIE COMMENTS ###
@app.get("/movies/{movie_id}/comments", tags=["Movies Comments"])
async def read_movie_comments(movie_id: int, page:int, page_size:int, db: Session = Depends(get_db)):
    """
        Retrieve a list of comments of a movie from the database.
    """
    return await crud.get_movie_comments(db, movie_id=movie_id, page=page, page_size=page_size)

@app.post("/movies/{movie_id}/comments", tags=["Movies Comments"])
async def create_movie_comment(movie_id: int, comment: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Create a new comment of a movie in the database.
    """
    movie_comment_create = MovieCommentCreate(movie_id=movie_id, comment=comment, user_id=current_user.id, created_at=datetime.now())
    return await crud.create_movie_comment(db, movie_comment_create)

@app.patch("/movies/{movie_id}/comments", tags=["Movies Comments"])
async def update_movie_comment(movie_comment_id: int, comment: str, is_deleted: bool, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Update a comment of a movie in the database.
    """
    movie_comment_edit = MovieCommentEdit(comment=comment, is_deleted=is_deleted)
    return await crud.update_movie_comment(db, movie_comment_id, movie_comment_edit, current_user.id)

@app.delete("/movies/{movie_id}/comments", tags=["Movies Comments"])
async def delete_movie_comment(movie_comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Delete a comment of a movie from the database.
    """
    return await crud.delete_movie_comment(db, movie_comment_id, current_user.id)