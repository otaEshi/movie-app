from datetime import datetime, timedelta, date
from typing import Annotated, Optional
from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File, Header, Form
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
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

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
ACCESS_TOKEN_EXPIRE_MINUTES = 60
SECRET_KEY_REFRESH = ""
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
ALGORITHM = "HS256"

load_dotenv()
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

class Token(BaseModel):
    """
        Token model

        Attributes:
            access_token (str): The access token.
            token_type (str): The token type.
    """
    access_token: str
    refresh_token: str
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

async def upload_image_cloudinary(image:UploadFile) -> str:
    """
        Upload an image to cloudinary.
    """
    return cloudinary.uploader.upload(image.file)

async def upload_image_cloudinary_base64(image_base64:str) -> str:
    """
        Upload an image to cloudinary.
    """
    return cloudinary.uploader.upload(image_base64)

async def delete_image_cloudinary(image_url:str ):
    """
        Delete an image from cloudinary.
    """
    image_id = image_url.split("/")[-1].split(".")[0]
    return cloudinary.uploader.destroy(image_id)

### USERS ###

def create_jwt(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials", headers={"WWW-Authenticate": "Bearer"})
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials, user_id is None", headers={"WWW-Authenticate": "Bearer"})
    user = await crud.get_user(get_db(), user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_current_user_suppress_error(token: Annotated[str, Depends(oauth2_scheme)] = None):
    """
        Get the current user

        Args:
            token (str): The token of the user.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = await crud.get_user(get_db(), user_id=payload.get("sub"))
    except: 
        return None
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
    access_token = create_jwt(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_jwt(data={"sub": str(user.id)}, expires_delta=refresh_token_expires)
    return {"access_token": access_token, "refresh_token":refresh_token, "token_type": "bearer"}

@app.post("/refresh_token", response_model=Token, tags=["Users"])
async def refresh_token(
    refresh_token: Annotated[str, Header(...)],
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials, user_id is None", headers={"WWW-Authenticate": "Bearer"})
        user = await crud.get_user(db, user_id=user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        access_token_expires = timedelta(seconds=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_jwt(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        new_refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        new_refresh_token = create_jwt(data={"sub": str(user.id)}, expires_delta=new_refresh_token_expires)
        return {"access_token": access_token, "token_type": "bearer", "refresh_token": new_refresh_token}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials, JWTError", headers={"WWW-Authenticate": "Bearer"})

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

class Base64Image(BaseModel):
    image_base64: str

@app.patch("/users/me", tags=["Users"])
async def update_user(
    name: str = None,
    date_of_birth: date = None,
    # avatar: UploadFile = File(None),
    avatar: Base64Image = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
        Update the current user.
    """
    args = UserEdit(name=name, date_of_birth=date_of_birth)

    # if date_of_birth is later than today, raise an error
    if date_of_birth is not None and date_of_birth > date.today():
        raise HTTPException(status_code=400, detail="Invalid date of birth")
    if avatar is not None:
        # If current user has an avatar, delete it
        if current_user.avatar_url is not None and current_user.avatar_url != "":
            await delete_image_cloudinary(current_user.avatar_url)
        try:
            cloudinary_response = await upload_image_cloudinary_base64(avatar.image_base64)
        except:
            raise HTTPException(status_code=400, detail="Invalid image")
        args.avatar_url = cloudinary_response["secure_url"]
    await crud.update_user(db, args, current_user.id)
    return {"detail": "USER_UPDATE_OK"}

@app.patch("/users/permissions", tags=["Users"])
async def update_user_permissions(
    user_id: int,
    is_content_admin: bool = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
        Update the permissions of a user.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    args = UserEditPermissions(is_content_admin=is_content_admin)
    return await crud.update_user_permissions(db, user=args, user_id=user_id )
    

@app.get("/users", tags=["Users"])
async def read_users(user_name: str = None, 
                     is_content_admin: bool = None, 
                     page: int = 0, 
                     page_size: int = 10, 
                     db: Session = Depends(get_db), 
                     current_user: User = Depends(get_current_user)):
    """
        Retrieve a list of users from the database.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    users = await crud.get_users(db, user_name, is_content_admin, page, page_size)
    return users

@app.get("/user/{user_id}", tags=["Users"])
async def read_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Retrieve a user from the database by its ID.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await crud.get_user(db, user_id=user_id)
    return user

### MOVIE LISTS ###
@app.get("/movie_lists", tags=["Movie Lists"])
async def read_movie_lists(page: int = 0, page_size: int = 10, is_deleted: bool = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Retrieve a list of movie lists from the database.
    """
    movie_lists = await crud.get_movie_lists(db, page, page_size, current_user, False, is_deleted)
    return movie_lists

@app.get("/movie_lists/public", tags=["Movie Lists"])
async def read_movie_lists_public(page: int = 0, page_size: int = 10, is_deleted: bool = None, db: Session = Depends(get_db)):
    """
        Retrieve a list of movie lists from the database.
    """
    movie_lists = await crud.get_movie_lists(db, page, page_size, None, True, is_deleted)
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
                      genre: str = None,
                      subgenre: str = None,
                      des: str = None,
                      source: str = None,
                      d: int = None,
                      m: int = None,
                      y: int = None,
                      is_deleted: bool = None,
                      db: Session = Depends(get_db)):
    """
        Retrieve a list of movies from the database.
    """
    search_params = {
        "title": title,
        "genre": genre,
        "subgenre": subgenre,
        "des": des,
        "source": source,
        "d": d,
        "m": m,
        "y": y,
        "is_deleted": is_deleted
    }

    search_params = {k: v for k, v in search_params.items() if v is not None and v != ""}
    return await crud.get_movies(db, page, page_size, search_params, user_id = None)

@app.get("/movies/top_trending", tags=["Movies"])
async def read_top_trending_movies(db: Session = Depends(get_db), top_k: int = 10, genre: str = None, is_deleted: bool = None):
    """
        Retrieve a list of top trending movies from the database.
    """
    search_params = {}
    if genre is not None:
        search_params["genre"] = genre
    if is_deleted is not None:
        search_params["is_deleted"] = is_deleted
    movies = await crud.get_top_trending_movies(db, top_k, search_params, user_id=None)
    return movies

@app.get("/movies/{movie_id}", tags=["Movies"])
async def read_movie(movie_id: int, db: Session = Depends(get_db)):
    """
        Retrieve a movie from the database by its ID.
    """
    movie = await crud.get_movie(db, movie_id=movie_id, user_id=None)
    return movie

@app.get("/movies_view_by_genre", tags=["Movies"])
async def read_movie_view_by_genre(db: Session = Depends(get_db)):
    """
        Retrieve a movie from the database by its ID.
    """
    result = await crud.get_viewcount_by_genre(db)
    return result

@app.get("/movies_avg_rating_by_genre", tags=["Movies"])
async def read_movie_avg_rating_by_genre(db: Session = Depends(get_db)):
    """
        Retrieve a movie from the database by its ID.
    """
    result = await crud.get_avg_rating_by_genre(db)
    return result

@app.get("/movies_view_by_subgenres", tags=["Movies"])
async def read_movie_view_by_subgenres(db: Session = Depends(get_db)):
    """
        Retrieve a movie from the database by its ID.
    """
    result = await crud.get_viewcount_by_subgenres(db)
    return result

@app.post("/register_view/{movie_id}", tags=["Movies"])
async def register_view(movie_id: int, db: Session = Depends(get_db)):
    """
        Register a view of a movie.
    """
    return await crud.register_view(db, movie_id=movie_id)

@app.post("/movies", tags=["Movies"])
async def create_movie( title:str,
                        description: str,
                        date_of_release: date,
                        url: str,
                        genre: str,
                        source: str,
                        subgenre: list[str] = Form(...),
                        image: UploadFile = File(...), 
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """
        Create a new movie in the database.
    """
    if not current_user.is_content_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    movie = MovieCreate(title=title, description=description, date_of_release=date_of_release, url=url, genre=genre, subgenre=subgenre, source=source)
    cloudinary_response = await upload_image_cloudinary(image)
    movie.thumbnail_url = cloudinary_response['secure_url']
    return await crud.create_movie(db, movie=movie)

class MovieCreateThumbnailUrl(BaseModel):
    """
        Movie model

        Attributes:
            title (str): The title of the movie.
            description (str): The description of the movie.
            date_of_release (date): The date of release of the movie.
            url (str): The url of the movie.
            genre (str): The genre of the movie.
            subgenre (list[str]): The subgenre of the movie.
            source (str): The source of the movie.
            thumbnail_url (str): The thumbnail url of the movie.
    """
    title: str
    description: str
    date_of_release: date
    url: str
    genre: str
    subgenre: list[str]
    source: str
    thumbnail_url: str

@app.post("/movies/thumbnail_url", tags=["Movies"])
async def create_movie_thumbnail_url( 
                        payload :MovieCreateThumbnailUrl,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """
        Create a new movie in the database using thumbnail url instead of files
    """
    if not current_user.is_content_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    movie = MovieCreate(title=payload.title, 
                        description=payload.description, 
                        date_of_release=payload.date_of_release, 
                        url=payload.url, 
                        thumbnail_url=payload.thumbnail_url,
                        genre=payload.genre, 
                        subgenre=payload.subgenre, 
                        source=payload.source)
    return await crud.create_movie(db, movie=movie)

@app.patch("/movies/{movie_id}", tags=["Movies"])
async def update_movie(movie_id: int,
                        title: str = None,
                        description: str = None,
                        date_of_release: date = None,
                        url: str = None,
                        genre: str = None,
                        subgenre: list[str] = None,
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
    subgenre = ",".join(subgenre) if subgenre is not None else ""
    movie = MovieEdit(title=title, 
                      description=description, 
                      date_of_release=date_of_release, 
                      url=url, 
                      genre=genre, 
                      subgenre=subgenre, 
                      source=source, 
                      is_deleted=is_deleted)

    if image is not None:
        # If current movie already has an image, delete it
        current_movie = await crud.get_movie(db, movie_id=movie_id)
        if current_movie.thumbnail_url is not None and current_movie.thumbnail_url != "":
            await delete_image_cloudinary(current_movie.thumbnail_url)
        
        cloudinary_response = await upload_image_cloudinary(image)
        movie.thumbnail_url = cloudinary_response['secure_url']
    return await crud.update_movie(db, movie_id=movie_id, movie=movie)

class MovieEditThumbnailUrl(BaseModel):
    """
        Movie model

        Attributes:
            title (str): The title of the movie.
            description (str): The description of the movie.
            date_of_release (date): The date of release of the movie.
            url (str): The url of the movie.
            genre (str): The genre of the movie.
            subgenre (list[str]): The subgenre of the movie.
            source (str): The source of the movie.
            thumbnail_url (str): The thumbnail url of the movie.
    """
    title: str|None = None
    description: str|None = None
    date_of_release: date|None = None
    url: str|None = None
    genre: str|None = None
    subgenre: str|None = None
    source: str|None = None
    thumbnail_url: str|None = None
    is_deleted: bool|None = None

@app.patch("/movies/thumbnail_url/{movie_id}", response_model=None, tags=["Movies"])
async def update_movie_thumbnail_url(movie_id: int,
                        payload: MovieEditThumbnailUrl = None,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """
        Update a movie in the database using thumbnail url instead of files
    """
    if not current_user.is_content_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")
    movie = MovieEdit(title=payload.title, 
                      description=payload.description, 
                      date_of_release=payload.date_of_release, 
                      url=payload.url, 
                      genre=payload.genre, 
                      subgenre=payload.subgenre, 
                      source=payload.source, 
                      is_deleted=payload.is_deleted)
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
async def update_movie_rating(movie_id: int, rating: int, is_deleted: bool = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Update a rating of a movie in the database.
    """
    movie_rating_edit = MovieRatingEdit(rating=rating, is_deleted=is_deleted)
    return await crud.update_movie_rating(db, movie_id, movie_rating_edit, current_user.id)

@app.delete("/movies/{movie_rating_id}/ratings", tags=["Movies Rating"])
async def delete_movie_rating(movie_rating_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Delete a rating of a movie from the database.
    """
    return await crud.delete_movie_rating(db, movie_rating_id, current_user.id)

### MOVIE COMMENTS ###
@app.get("/movies/{movie_id}/comments", tags=["Movies Comments"])
async def read_movie_comments(movie_id: int, is_deleted:bool = None, page:int = 0, page_size:int = 10, db: Session = Depends(get_db)):
    """
        Retrieve a list of comments of a movie from the database.
    """
    return await crud.get_movie_comments(db, movie_id=movie_id, is_deleted=is_deleted, page=page, page_size=page_size)

@app.post("/movies/{movie_id}/comments", tags=["Movies Comments"])
async def create_movie_comment(movie_id: int, comment: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Create a new comment of a movie in the database.
    """
    movie_comment_create = MovieCommentCreate(movie_id=movie_id, comment=comment, user_id=current_user.id, created_at=datetime.now())
    return await crud.create_movie_comment(db, movie_comment_create)

@app.patch("/movies/{movie_comment_id}/comments", tags=["Movies Comments"])
async def update_movie_comment(movie_comment_id: int, comment: str, is_deleted: bool, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Update a comment of a movie in the database.
    """
    movie_comment_edit = MovieCommentEdit(comment=comment, is_deleted=is_deleted)
    return await crud.update_movie_comment(db, movie_comment_id, movie_comment_edit, current_user.id)

@app.delete("/movies/{movie_comment_id}/comments", tags=["Movies Comments"])
async def delete_movie_comment(movie_comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
        Delete a comment of a movie from the database.
    """
    return await crud.delete_movie_comment(db, movie_comment_id, current_user)