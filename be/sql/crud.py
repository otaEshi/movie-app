from sqlalchemy.orm import Session, joinedload
import bcrypt
from .schemas import *
from .models import *
from fastapi import HTTPException
import datetime

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
    return db.query(User).filter(User.id == user_id).first()

async def get_users(db: Session, page:int = 0, page_size: int = 100):
    """
    Retrieve a list of users from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of users to skip. Defaults to 0.
        limit (int, optional): Maximum number of users to retrieve. Defaults to 100.

    Returns:
        List[User]: A list of User objects.
    """
    skip = page * page_size
    limit = page_size

    max_page = db.query(User).count() // page_size + 1
    result = db.query(User).offset(skip).limit(limit).all()
    return result, {"max_page": max_page}

async def create_user(db: Session, user: UserCreate):
    """
    Create a new user in the database.

    Parameters:
    - db (Session): The database session.
    - user (UserCreate): The user data to be created.

    Returns:
    - User: The created user object.
    """
    password_hash = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    # Check for duplicate username
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="ERR_USERNAME_ALREADY_EXISTS")
    db_user = User(
        username=user.username,
        password_hash=password_hash,
        name=user.name,
        date_of_birth=user.date_of_birth,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def update_user(db: Session, user: UserEdit, user_id: int):
    """
    Edit a user in the database.

    Args:
        db (Session): The database session.
        user (UserEdit): The updated user data.
        user_id (int): The ID of the user to edit.

    Returns:
        models.User: The edited user object.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    attributes = ['name', 'date_of_birth', 'avatar_url']
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
    db_user = db.query(User).filter(User.id == user_id).first()
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
    user = db.query(User).filter(User.username == username).first()
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
        user (UserEditPassword): The updated password data.
        user_id (int): The ID of the user to edit.

    Returns:
        models.User: The edited user object.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
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
    return db.query(MovieList).filter(MovieList.id == movie_list_id).first()

async def get_movie_lists(db: Session, page: int = 0, page_size: int = 100, current_user: User = None, get_public: bool = False, include_deleted: bool = False)->MovieListGet:
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
    skip = page * page_size
    limit = page_size
    max_page = db.query(MovieList).count() // page_size + 1
    filters = {}
    if not include_deleted:
        filters = {
            "is_deleted": False 
        }
    
    if get_public:
        result =  (
            db.query(MovieList)
            .filter_by(**filters)
            .join(User)
            .options(joinedload(MovieList.movies))
            .filter(User.is_content_admin)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return result, {"max_page": max_page}

    if current_user:
        result = (
            db.query(MovieList)
            .filter_by(**filters)
            .join(User)
            .options(joinedload(MovieList.movies))
            .filter(User.id == current_user.id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return result, {"max_page": max_page}
    

async def create_movie_list(db: Session, movie_list: MovieListCreate, user_id: int):
    """
    Create a new movie list in the database.

    Args:
        db (Session): The database session.
        movie_list (MovieListCreate): The movie list data to be created.
        user_id (int): The ID of the owner of the movie list.

    Returns:
        models.MovieList: The created movie list object.
    """
    db_movie_list = MovieList(name=movie_list.name,
                                    description=movie_list.description, 
                                    created_at=datetime.datetime.now(),
                                    owner_id=user_id)
    
    db.add(db_movie_list)

    for movie_id in movie_list.movie_ids:
        db_movie_list_movie = MovieListMovie(movie_list_id=db_movie_list.id, movie_id=movie_id)
        db.add(db_movie_list_movie)

    db.commit()
    db.refresh(db_movie_list)
    return db_movie_list

async def update_movie_list(db: Session, movie_list_id, owner_id: int, movie_list: MovieListEdit, movie_ids: list[int]):
    """
    Update a movie list in the database.

    Args:
        db (Session): The database session.
        movie_list (MovieListEdit): The updated movie list data.
        movie_ids (list[int]): The IDs of the movies to be added to the movie list.

    Returns:
        models.MovieList: The edited movie list object.
    """
    db_movie_list = db.query(MovieList).filter(MovieList.id == movie_list_id).first()
    if not db_movie_list:
        return {"detail": "MOVIE_LIST_NOT_FOUND"}
    if owner_id != db_movie_list.owner_id:
        return {"detail": "unauthorized"}
    if movie_list.name is not None:
        db_movie_list.name = movie_list.name
    if movie_list.description is not None:
        db_movie_list.description = movie_list.description
    if movie_list.is_deleted is not None:
        db_movie_list.is_deleted = movie_list.is_deleted

    if movie_ids is not None: 
        db_movie_list_movies = db.query(MovieListMovie).filter(MovieListMovie.movie_list_id == db_movie_list.id).all()
        db_movie_list_movie_ids = [movie.movie_id for movie in db_movie_list_movies]
        movie_ids_to_delete = list(set(db_movie_list_movie_ids) - set(movie_ids))
        movie_ids_to_add = list(set(movie_ids) - set(db_movie_list_movie_ids))

        # Check if the movie_ids are valid
        db_movies = db.query(Movie).filter(Movie.id.in_(movie_ids)).all()
        db_movie_ids = [movie.id for movie in db_movies]
        if len(db_movie_ids) != len(movie_ids):
            return {"detail": "INVALID_MOVIE_IDS"}

        for movie_id in movie_ids_to_delete:
            db_movie_list_movie = db.query(MovieListMovie).filter(MovieListMovie.movie_list_id == db_movie_list.id, MovieListMovie.movie_id == movie_id).first()
            db.delete(db_movie_list_movie)

        for movie_id in movie_ids_to_add:
            db_movie_list_movie = MovieListMovie(movie_list_id=db_movie_list.id, movie_id=movie_id)
            db.add(db_movie_list_movie)

    db.commit()
    db.refresh(db_movie_list)
    return db_movie_list

async def delete_movie_list(db: Session, movie_list_id: int, owner_id: int):
    """
    Delete a movie list from the database.

    Args:
        db (Session): The database session.
        movie_list_id (int): The ID of the movie list to be deleted.

    Returns:
        MovieList: The deleted movie list object.
    """
    db_movie_list = db.query(MovieList).filter(MovieList.id == movie_list_id).first()
    if db_movie_list is None:
        return {"detail": "ERR_MOVIE_LIST_NOT_FOUND"}
    if owner_id != db_movie_list.owner_id:
        return {"detail": "unauthorized"}
    db_movie_list.is_deleted = True
    db.commit()
    return {"detail": "MOVIE_LIST_DELETE_OK"}

### Movie CRUD ###

async def get_movie(db: Session, movie_id: int, user_id: int = None):
    """
    Retrieve a movie from the database by its ID.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to retrieve.

    Returns:
        Movie: The movie object if found, None otherwise.
    """
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    result = movie.__dict__
    average_rating = await get_movie_ratings_average(db, movie_id)
    result["average_rating"] = average_rating["average"]
    
    if user_id is not None:
        result["current_user_rating"] = db.query(MovieRatings).filter(MovieRatings.movie_id == movie_id, MovieRatings.user_id == user_id).first()
    
    return result
async def get_movies(db: Session, page: int = 0, page_size: int = 10, search_params: dict = None):
    """
    Retrieve a list of movies from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): Number of movies to skip. Defaults to 0.
        limit (int, optional): Maximum number of movies to retrieve. Defaults to 100.

    Returns:
        List[models.Movie]: A list of movie objects.
    """
    skip = page * page_size
    limit = page_size

    max_page = db.query(Movie).count() // page_size + 1

    if search_params:
        result = db.query(Movie).filter_by(**search_params).offset(skip).limit(limit).all()
        return result, {"max_page" : max_page}
    
    result = db.query(Movie).offset(skip).limit(limit).all()
    result = [movie.__dict__ for movie in result]
    return result, {"max_page": max_page}

async def get_top_trending_movies(db: Session, top_k: int, search_params: dict ):
    """
    Retrieve a list of top trending movies from the database.

    Args:
        db (Session): The database session.

    Returns:
        List[models.Movie]: A list of movie objects.
    """
    return db.query(Movie).filter_by(**search_params).order_by(Movie.views.desc()).limit(top_k).all()
    

async def create_movie(db: Session, movie: MovieCreate):
    """
    Create a new movie in the database.

    Args:
        db (Session): The database session.
        movie (schemas.MovieCreate): The movie data to be created.
        movie_list_id (int): The ID of the movie list to which the movie belongs.

    Returns:
        models.Movie: The created movie object.
    """
    db_movie = Movie(**movie.model_dump())
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
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is not None:
        if movie.views is None:
            movie.views = 1
        else:
            movie.views += 1
        db.commit()
        return {"detail": "VIEW_REG_OK"}
    else:
        return {"detail": "ERR_MOVIE_NOT_FOUND"}

async def update_movie(db: Session, movie: MovieEdit, movie_id: int):
    """
    Edit a movie in the database.

    Args:
        db (Session): The database session.
        movie (MovieEdit): The updated movie data.
        movie_id (int): The ID of the movie to edit.

    Returns:
        models.Movie: The edited movie object.
    """
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    attributes = ['title', 'description', 'date_of_release', 'url', 'thumbnail_url', 'views', 'genre','source', 'is_deleted']
    for attr in attributes:
        if getattr(movie, attr) is not None:
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
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if db_movie is None:
        return {"detail": "ERR_MOVIE_NOT_FOUND"}
    db_movie.is_deleted = True
    db.commit()
    return {"detail": "MOVIE_DELETE_OK"}

# Movie Ratings CRUD
async def get_movie_ratings_average(db: Session, movie_id: int):
    """
    Retrieve a list of movie ratings from the database.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to retrieve the ratings for.

    Returns:
        List[models.MovieRating]: A list of movie rating objects.
    """
    result = db.query(MovieRatings).filter(MovieRatings.movie_id == movie_id).all()
    average = 0
    for rating in result:
        average += rating.rating
    if len(result) > 0:
        average /= len(result)
    return {"average": average}

async def create_movie_rating(db: Session, movie_rating: MovieRatingCreate):
    """
    Create a new movie rating in the database.

    Args:
        db (Session): The database session.
        movie_rating (schemas.MovieRatingCreate): The movie rating data to be created.

    Returns:
        models.MovieRating: The created movie rating object.
    """
    # Check if the movie_id already exist
    db_movie_rating = db.query(MovieRatings).filter(MovieRatings.movie_id == movie_rating.movie_id, MovieRatings.user_id == movie_rating.user_id).first()
    if db_movie_rating is not None:
        raise HTTPException(status_code=400, detail="ERR_MOVIE_RATING_ALREADY_EXISTS")
    db_movie_rating = MovieRatings(**movie_rating.model_dump())
    db.add(db_movie_rating)
    db.commit()
    db.refresh(db_movie_rating)
    return db_movie_rating

async def get_movie_ratings(db: Session, movie_id: int, user_id: int = None, page: int = 0, page_size: int = 100):
    """
    Retrieve a list of movie ratings from the database.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to retrieve the ratings for.

    Returns:
        List[models.MovieRating]: A list of movie rating objects.
    """
    skip = page * page_size
    limit = page_size
    max_page = db.query(MovieRatings).count() // page_size + 1
    search_params = {}
    if movie_id is not None:
        search_params["movie_id"] = movie_id
    if user_id is not None:
        search_params["user_id"] = user_id
    result = db.query(MovieRatings).filter_by(**search_params).offset(skip).limit(limit).all()
    return result, {"max_page": max_page}

async def update_movie_rating(db: Session, movie_rating_id: int, movie_rating_edit: MovieRatingEdit, user_id: int):
    """
    Edit a movie rating in the database.

    Args:
        db (Session): The database session.
        movie_rating (MovieRatingsCreate): The updated movie rating data.
        movie_rating_id (int): The ID of the movie rating to edit.

    Returns:
        models.MovieRating: The edited movie rating object.
    """
    db_movie_rating = db.query(MovieRatings).filter(MovieRatings.id == movie_rating_id).first()
    if db_movie_rating is None:
        raise HTTPException(status_code=404, detail="ERR_MOVIE_RATING_NOT_FOUND")
    if user_id != db_movie_rating.user_id:
        raise HTTPException(status_code=401, detail="ERR_UNAUTHORIZED")
    
    attributes = ['rating']
    for attr in attributes:
        if getattr(movie_rating_edit, attr) is not None:
            setattr(db_movie_rating, attr, getattr(movie_rating_edit, attr))
    
    db.commit()
    db.refresh(db_movie_rating)
    return db_movie_rating

async def delete_movie_rating(db: Session, movie_rating_id: int, user_id: int):
    """
    Delete a movie rating from the database.

    Args:
        db (Session): The database session.
        movie_rating_id (int): The ID of the movie rating to be deleted.

    Returns:
        MovieRating: The deleted movie rating object.
    """
    db_movie_rating = db.query(MovieRatings).filter(MovieRatings.id == movie_rating_id).first()
    if db_movie_rating is None:
        raise HTTPException(status_code=404, detail="ERR_MOVIE_RATING_NOT_FOUND")
    if user_id != db_movie_rating.user_id:
        raise HTTPException(status_code=401, detail="ERR_UNAUTHORIZED")
    db_movie_rating.is_deleted = True
    db.commit()
    return db_movie_rating

# Movie Comments CRUD
async def create_movie_comment(db: Session, movie_comment: MovieCommentCreate):
    """
    Create a new movie comment in the database.

    Args:
        db (Session): The database session.
        movie_comment (schemas.MovieCommentCreate): The movie comment data to be created.

    Returns:
        models.MovieComment: The created movie comment object.
    """
    db_movie_comment = MovieComments(**movie_comment.model_dump())
    db.add(db_movie_comment)
    db.commit()
    db.refresh(db_movie_comment)
    return db_movie_comment

async def get_movie_comments(db: Session, movie_id: int, user_id: int = None, page: int = 0, page_size: int = 100):
    """
    Retrieve a list of movie comments from the database.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to retrieve the comments for.

    Returns:
        List[models.MovieComment]: A list of movie comment objects.
    """
    skip = page * page_size
    limit = page_size
    max_page = db.query(MovieComments).count() // page_size + 1
    search_params = {}
    if movie_id:
        search_params["movie_id"] = movie_id
    if user_id:
        search_params["user_id"] = user_id
    result = db.query(MovieComments).filter_by(**search_params).offset(skip).limit(limit).all()
    return result, {"max_page": max_page}

async def update_movie_comment(db: Session, movie_comment_id: int, movie_comment_edit: MovieCommentEdit, user_id: int):
    """
    Edit a movie comment in the database.

    Args:
        db (Session): The database session.
        movie_comment (MovieCommentsCreate): The updated movie comment data.
        movie_comment_id (int): The ID of the movie comment to edit.

    Returns:
        models.MovieComment: The edited movie comment object.
    """
    db_movie_comment = db.query(MovieComments).filter(MovieComments.id == movie_comment_id).first()
    if db_movie_comment is None:
        raise HTTPException(status_code=404, detail="ERR_MOVIE_COMMENT_NOT_FOUND")
    if user_id != db_movie_comment.user_id:
        raise HTTPException(status_code=401, detail="ERR_UNAUTHORIZED")
    
    attributes = ['comment']
    for attr in attributes:
        if getattr(movie_comment_edit, attr) is not None:
            setattr(db_movie_comment, attr, getattr(movie_comment_edit, attr))
    
    db.commit()
    db.refresh(db_movie_comment)
    return db_movie_comment

async def delete_movie_comment(db: Session, movie_comment_id: int, user_id: int):
    """
    Delete a movie comment from the database.

    Args:
        db (Session): The database session.
        movie_comment_id (int): The ID of the movie comment to be deleted.

    Returns:
        MovieComment: The deleted movie comment object.
    """
    db_movie_comment = db.query(MovieComments).filter(MovieComments.id == movie_comment_id).first()
    if db_movie_comment is None:
        raise HTTPException(status_code=404, detail="ERR_MOVIE_COMMENT_NOT_FOUND")
    if user_id != db_movie_comment.user_id:
        raise HTTPException(status_code=401, detail="ERR_UNAUTHORIZED")
    db_movie_comment.is_deleted = True
    db.commit()
    return db_movie_comment

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
    return db.query(MovieListMovie).filter(MovieListMovie.movie_list_id == movie_list_id, 
                                                  MovieListMovie.movie_id == movie_id)

