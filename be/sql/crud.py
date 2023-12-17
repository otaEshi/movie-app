from sqlalchemy.orm import Session
import bcrypt
from . import models, schemas
from datetime import datetime

### User CRUD ###
async def get_user(db: Session, user_id: str):
    """
    Retrieve a user from the database based on the user_id.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to retrieve.

    Returns:
        User: The user object if found, None otherwise.
    """
    return db.query(models.User).filter(models.User.id == user_id).first()

async def get_users(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieve a list of users from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of users to skip. Defaults to 0.
        limit (int, optional): Maximum number of users to retrieve. Defaults to 100.

    Returns:
        List[User]: A list of User objects.
    """
    return db.query(models.User).offset(skip).limit(limit).all()

async def create_user(db: Session, user: schemas.UserCreate):
    """
    Create a new user in the database.

    Parameters:
    - db (Session): The database session.
    - user (UserCreate): The user data to be created.

    Returns:
    - User: The created user object.
    """
    password_hash = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = models.User(
        email=user.email, 
        username=user.username,
        password_hash=password_hash,
        name=user.name,
        year_of_birth=user.year_of_birth,
        month_of_birth=user.month_of_birth,
        day_of_birth=user.day_of_birth
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def edit_user(db: Session, user: schemas.UserEdit, user_id: int):
    """
    Edit a user in the database.

    Args:
        db (Session): The database session.
        user (schemas.UserEdit): The updated user data.
        user_id (int): The ID of the user to edit.

    Returns:
        models.User: The edited user object.
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
    if user.avatar_url:
        db_user.avatar_url = user.avatar_url
    if user.is_active:
        db_user.is_active = user.is_active
    if user.is_content_admin:
        db_user.is_content_admin = user.is_content_admin
    db.commit()
    db.refresh(db_user)
    return db_user

async def delete_user(db: Session, user_id: int):
    """
    Delete a user from the database.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to be deleted.

    Returns:
        User: The deleted user object.
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db.delete(db_user)
    db.commit()
    return db_user

async def verify_password(plain_password, password_hash):
    """
    Verify if the plain password matches the hashed password.

    Args:
        plain_password (str): The plain password to be verified.
        password_hash (str): The hashed password to compare against.

    Returns:
        bool: True if the plain password matches the hashed password, False otherwise.
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), password_hash.encode('utf-8'))

async def authenticate_user(db: Session, username: str, password: str):
    """
    Authenticates a user by checking if the provided username and password match the stored credentials.

    Args:
        db (Session): The database session.
        username (str): The username of the user.
        password (str): The password of the user.

    Returns:
        Union[models.User, bool]: The authenticated user if the credentials are valid, False otherwise.
    """
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        print("user not found")
        return False
    if not await verify_password(password, user.password_hash):
        print("password not verified")
        return False
    return user

async def change_password(db: Session, user: schemas.UserEditPassword, user_id: int):
    """
    Change the password of a user.

    Args:
        db (Session): The database session.
        user (schemas.UserEditPassword): The updated password data.
        user_id (int): The ID of the user to edit.

    Returns:
        models.User: The edited user object.
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not await verify_password(user.old_password, db_user.password_hash):
        return False
    db_user.password_hash = bcrypt.hashpw(user.new_password.encode('utf-8'), bcrypt.gensalt())
    db.commit()
    db.refresh(db_user)
    return db_user

### Movie List CRUD ###

async def get_movie_list(db: Session, movie_list_id: int):
    """
    Retrieve a movie list from the database by its ID.

    Args:
        db (Session): The database session.
        movie_list_id (int): The ID of the movie list to retrieve.

    Returns:
        MovieList: The movie list object if found, None otherwise.
    """
    return db.query(models.MovieList).filter(models.MovieList.id == movie_list_id).first()

async def get_movie_lists(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieve a list of movie lists from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to retrieve. Defaults to 100.

    Returns:
        List[models.MovieList]: A list of movie lists.
    """
    return db.query(models.MovieList).offset(skip).limit(limit).all()

async def create_movie_list(db: Session, movie_list: schemas.MovieListCreate, user_id: int):
    """
    Create a new movie list in the database.

    Args:
        db (Session): The database session.
        movie_list (schemas.MovieListCreate): The movie list data to be created.
        user_id (int): The ID of the owner of the movie list.

    Returns:
        models.MovieList: The created movie list object.
    """
    db_movie_list = models.MovieList(**movie_list.model_dump(), owner_id=user_id)
    db.add(db_movie_list)
    db.commit()
    db.refresh(db_movie_list)
    return db_movie_list

### Movie CRUD ###

async def get_movie(db: Session, movie_id: int):
    """
    Retrieve a movie from the database by its ID.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to retrieve.

    Returns:
        Movie: The movie object if found, None otherwise.
    """
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()

async def get_movies(db: Session, skip: int = 0, limit: int = 100, search_params: dict = None):
    """
    Retrieve a list of movies from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of movies to skip. Defaults to 0.
        limit (int, optional): Maximum number of movies to retrieve. Defaults to 100.

    Returns:
        List[models.Movie]: A list of movie objects.
    """
    if search_params:
        return db.query(models.Movie).filter_by(**search_params).offset(skip).limit(limit).all()
    return db.query(models.Movie).offset(skip).limit(limit).all()

async def create_movie(db: Session, movie: schemas.MovieCreate):
    """
    Create a new movie in the database.

    Args:
        db (Session): The database session.
        movie (schemas.MovieCreate): The movie data to be created.
        movie_list_id (int): The ID of the movie list to which the movie belongs.

    Returns:
        models.Movie: The created movie object.
    """
    db_movie = models.Movie(**movie.model_dump())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

async def register_view(db: Session, movie_id: int):
    """
    Register a view for a movie.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to register the view for.
        day (int): The day of the view.
        month (int): The month of the view.
        year (int): The year of the view.

    Returns:
        models.MovieViews: The created movie view object.
    """
    # if view count exists, increment it
    # else create a new view count
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if movie is not None:
        movie.views += 1
        db.commit()
        return {"success": "view registered successfully"}
    else:
        return {"error": "movie not found"}

async def edit_movie(db: Session, movie: schemas.MovieEdit, movie_id: int):
    """
    Edit a movie in the database.

    Args:
        db (Session): The database session.
        movie (schemas.MovieEdit): The updated movie data.
        movie_id (int): The ID of the movie to edit.

    Returns:
        models.Movie: The edited movie object.
    """
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if movie.title:
        db_movie.title = movie.title
    if movie.description:
        db_movie.description = movie.description
    if movie.day_of_release:
        db_movie.day_of_release = movie.day_of_release
    if movie.month_of_release:
        db_movie.month_of_release = movie.month_of_release
    if movie.year_of_release:
        db_movie.year_of_release = movie.year_of_release
    if movie.url:
        db_movie.url = movie.url
    if movie.thumbnail_url:
        db_movie.thumbnail_url = movie.thumbnail_url
    if movie.views:
        db_movie.views = movie.views
    if movie.genre:
        db_movie.genre = movie.genre
    db.commit()
    db.refresh(db_movie)
    return db_movie

async def delete_movie(db: Session, movie_id: int):
    """
    Delete a movie from the database.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to be deleted.

    Returns:
        Movie: The deleted movie object.
    """
    db_movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    db.delete(db_movie)
    db.commit()
    return db_movie

async def create_movie_ratings(db: Session, movie_rating: schemas.MovieRatingsCreate):
    """
    Create a new movie rating in the database.

    Args:
        db (Session): The database session.
        movie_rating (schemas.MovieRatingCreate): The movie rating data to be created.

    Returns:
        models.MovieRating: The created movie rating object.
    """
    db_movie_rating = models.MovieRatings(**movie_rating.model_dump())
    db.add(db_movie_rating)
    db.commit()
    db.refresh(db_movie_rating)
    return db_movie_rating

### Movie List Movie CRUD ###
async def get_movies_from_movie_list(db: Session, movie_list_id: int, movie_id: int):
    """
    Retrieve a movie from a movie list by its ID.

    Args:
        db (Session): The database session.
        movie_list_id (int): The ID of the movie list.
        movie_id (int): The ID of the movie.

    Returns:
        MovieListMovie: The movie list movie object if found, None otherwise.
    """
    return db.query(models.MovieListMovie).filter(models.MovieListMovie.movie_list_id == movie_list_id, 
                                                  models.MovieListMovie.movie_id == movie_id)
