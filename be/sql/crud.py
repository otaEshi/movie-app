from sqlalchemy.orm import Session
from . import models, schemas
import bcrypt

def get_user(db: Session, user_id: int):
    """
        Get a user by id
    """
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """
        Get all users
    """
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    """
        Create a user
    """
    password_hash = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = models.User(
        email=user.email, 
        hashed_password=password_hash,
        name=user.name,
        year_of_birth=user.year_of_birth,
        month_of_birth=user.month_of_birth,
        day_of_birth=user.day_of_birth
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def edit_user(db: Session, user: schemas.UserEdit, user_id: int):
    """
        Edit a user
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if user.email:
        db_user.email = user.email
    if user.name:
        db_user.name = user.name
    if user.year_of_birth:
        db_user.year_of_birth = user.year_of_birth
    if user.month_of_birth:
        db_user.month_of_birth = user.month_of_birth
    if user.day_of_birth:
        db_user.day_of_birth = user.day_of_birth
    if user.password:
        db_user.hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """
        Delete a user
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db.delete(db_user)
    db.commit()
    return db_user

def verify_password(plain_password, hashed_password):
    """
        Verify a password
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)

def authenticate_user(db: Session, email: str, password: str):
    """
        Authenticate a user
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_movie_list(db: Session, movie_list_id: int):
    """
        Get a movie list by id
    """
    return db.query(models.MovieList).filter(models.MovieList.id == movie_list_id).first()

def get_movie_lists(db: Session, skip: int = 0, limit: int = 100):
    """
        Get all movie lists
    """
    return db.query(models.MovieList).offset(skip).limit(limit).all()

def create_movie_list(db: Session, movie_list: schemas.MovieListCreate, user_id: int):
    """
        Create a movie list
    """
    db_movie_list = models.MovieList(**movie_list.dict(), owner_id=user_id)
    db.add(db_movie_list)
    db.commit()
    db.refresh(db_movie_list)
    return db_movie_list

def get_movie(db: Session, movie_id: int):
    """
        Get a movie by id
    """
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()

def get_movies(db: Session, skip: int = 0, limit: int = 100):
    """
        Get all movies
    """
    return db.query(models.Movie).offset(skip).limit(limit).all()

def create_movie(db: Session, movie: schemas.MovieCreate, movie_list_id: int):
    """
        Create a movie
    """
    db_movie = models.Movie(**movie.dict(), list_id=movie_list_id)
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

