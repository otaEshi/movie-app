from sqlalchemy.orm import Session
import bcrypt
from . import models, schemas
from .schemas import UserEditPassword
from fastapi import HTTPException

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
        date_of_birth=user.date_of_birth,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def update_user(db: Session, user: schemas.UserEdit, user_id: int):
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
    attributes = ['name', 'date_of_birth', 'avatar_id']
    for attr in attributes:
        if getattr(user, attr):
            setattr(db_user, attr, getattr(user, attr))
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

async def change_password(db: Session, user: UserEditPassword, user_id: int):
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
        raise HTTPException(status_code=401, detail="ERR_INCORRECT_OLD_PASSWORD")
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

async def get_movie_lists(db: Session, skip: int = 0, limit: int = 100, current_user: models.User = None, get_public: bool = False):
    """
    Retrieve a list of movie lists from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to retrieve. Defaults to 100.

    Returns:
        List[models.MovieList]: A list of movie lists.
    """
    # Filter by owner if current_user is provided
    if get_public:
        return db.query(models.MovieList).join(models.User).filter(models.User.is_content_admin).offset(skip).limit(limit).all()

    if current_user:
        return db.query(models.MovieList).filter(models.MovieList.owner_id == current_user.id).offset(skip).limit(limit).all()
    

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

async def update_movie_list(db: Session, owner_id: int, movie_list: schemas.MovieListEdit, movie_ids: list[int]):
    """
    Update a movie list in the database.

    Args:
        db (Session): The database session.
        movie_list (schemas.MovieListEdit): The updated movie list data.
        movie_ids (list[int]): The IDs of the movies to be added to the movie list.

    Returns:
        models.MovieList: The edited movie list object.
    """
    db_movie_list = db.query(models.MovieList).filter(models.MovieList.id == movie_list.id).first()
    if owner_id != db_movie_list.owner_id:
        return {"error": "unauthorized"}
    if movie_list.name:
        db_movie_list.name = movie_list.name
    if movie_list.description:
        db_movie_list.description = movie_list.description
    if len(movie_ids)>0:
        for movie_id in movie_ids:
            # check if movie already exists in movie list
            if db.query(models.MovieListMovie).filter(models.MovieListMovie.movie_list_id == db_movie_list.id, models.MovieListMovie.movie_id == movie_id).first():
                continue

            # Check if movie exists in database
            if not db.query(models.Movie).filter(models.Movie.id == movie_id).first():
                continue

            db_movie_list_movie = models.MovieListMovie(movie_list_id=db_movie_list.id, movie_id=movie_id)
            db.add(db_movie_list_movie)
    db.commit()
    db.refresh(db_movie_list)
    return db_movie_list

async def delete_movie_list(db: Session, movie_list_id: int):
    """
    Delete a movie list from the database.

    Args:
        db (Session): The database session.
        movie_list_id (int): The ID of the movie list to be deleted.

    Returns:
        MovieList: The deleted movie list object.
    """
    db_movie_list = db.query(models.MovieList).filter(models.MovieList.id == movie_list_id).first()
    db.delete(db_movie_list)
    db.commit()
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
        return {"detail": "VIEW_REG_OK"}
    else:
        return {"detail": "ERR_MOVIE_NOT_FOUND"}

async def update_movie(db: Session, movie: schemas.MovieEdit, movie_id: int):
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
    attributes = ['title', 'description', 'date_of_release', 'url', 'thumbnail_id', 'views', 'genre']
    for attr in attributes:
        if getattr(movie, attr):
            setattr(db_movie, attr, getattr(movie, attr))

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

