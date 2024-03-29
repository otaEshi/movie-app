from sqlalchemy.orm import Session
from sqlalchemy import or_ , and_, func, text
import bcrypt
from .schemas import *
from .models import *
from fastapi import HTTPException
import datetime
import math

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

async def get_users(db: Session, 
                    is_content_admin: bool,
                    user_name: str, 
                    page:int = 0, 
                    page_size: int = 100):
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

    search_params = {}
    if is_content_admin is not None:
        search_params["is_content_admin"] = is_content_admin
    if user_name is None:
        user_name = ""
    print(user_name)
    query = db.query(User).filter_by(**search_params).filter(User.username.contains(user_name))
    
    max_page = math.ceil(query.count() / page_size)
    result = query.offset(skip).limit(limit).all()
    return {"list": result, "max_page": max_page}

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
    if db.query(User).filter(User.username == user.username, User.is_active == True).first():
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

async def update_user_permissions(db: Session, user_id: int, user: UserEditPermissions):
    """
    Edit a user's permission in the database.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to edit.
        user (UserEditPermission): The updated user permission data.

    Returns:
        models.User: The edited user object.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        return {"detail": "USER_NOT_FOUND"}
    if user.is_content_admin is not None:
        db_user.is_content_admin = user.is_content_admin
        db.commit()
        db.refresh(db_user)
    return db_user

async def update_user_active(db: Session, user_id: int, user: UserEditActive):
    """
    Edit a user's active status in the database.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to edit.
        user (UserEditActive): The updated user active status data.

    Returns:
        models.User: The edited user object.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        return {"detail": "USER_NOT_FOUND"}
    if user.is_active is not None:
        db_user.is_active = user.is_active
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
    result = (
            db.query(MovieList, Movie)
            .select_from(MovieList)
            .filter(MovieList.id == movie_list_id)
            .outerjoin(MovieListMovie)
            .outerjoin(Movie)
            .all()
        )

    collated_result = []
    for tup in result:
        if len(collated_result) == 0 or collated_result[-1]["id"] != tup[0].__dict__["id"]:
            collated_result.append(tup[0].__dict__)
        
        movie_list = collated_result[-1]
        
        if tup[1] is None:
            continue

        if tup[1].is_deleted:
            continue

        movie = tup[1].__dict__
        average_rating = await get_movie_ratings_average(db, movie["id"])
        movie["average_rating"] = average_rating["average"]
        movie["num_ratings"] = await get_num_rating_by_movie_id(db, movie["id"])
        if "movies" not in movie_list.keys():
            movie_list["movies"] = []
        movie_list['movies'].append(movie)
    
    return collated_result[0]


async def get_movie_lists(db: Session, page: int = 0, page_size: int = 100, current_user: User = None, get_public: bool = False, is_deleted: bool = None)->MovieListGet:
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
    filters = {}
    if is_deleted is not None:
        filters["is_deleted"] = is_deleted
    
    if get_public:
        query =  (
            db.query(MovieList, Movie)
            .filter_by(**filters)
            .join(User)
            .filter(User.is_content_admin)
            .outerjoin(MovieListMovie)
            .outerjoin(Movie)
        )
    elif current_user:
        query =  (
            db.query(MovieList, Movie)
            .filter_by(**filters)
            .join(User)
            .filter(User.id == current_user.id)
            .outerjoin(MovieListMovie)
            .outerjoin(Movie)
        )
    else:
        query =  (
            db.query(MovieList, Movie)
            .filter_by(**filters)
            .outerjoin(MovieListMovie)
            .outerjoin(Movie)
        )
    
    max_page = math.ceil(query.count() / page_size)
    result = query.offset(skip).limit(limit).all()

    collated_result = []
    for tup in result:
        if len(collated_result) == 0 or collated_result[-1]["id"] != tup[0].__dict__["id"]:
            collated_result.append(tup[0].__dict__)
        
        movie_list = collated_result[-1]
        
        if tup[1] is None:
            continue

        if tup[1].is_deleted:
            continue

        movie = tup[1].__dict__
        average_rating = await get_movie_ratings_average(db, movie["id"])
        movie["average_rating"] = average_rating["average"]
        movie["num_ratings"] = await get_num_rating_by_movie_id(db, movie["id"])
        if "movies" not in movie_list.keys():
            movie_list["movies"] = []
        movie_list['movies'].append(movie)
    return {"list": collated_result, "max_page": max_page}
    

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
    # If there exists a movie list with the same name from the same user, return an error
    if db.query(MovieList).filter(MovieList.name == movie_list.name, MovieList.owner_id == user_id, MovieList.is_deleted == False).first():
        raise HTTPException(status_code=400, detail="ERR_MOVIE_LIST_NAME_ALREADY_EXISTS")

    db.add(db_movie_list)
    db.commit()

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
        _movie_lists = db.query(MovieList).filter(MovieList.name == movie_list.name, MovieList.owner_id == owner_id, MovieList.is_deleted == False).first()
        if _movie_lists is not None and _movie_lists.id != movie_list_id:
            return {"detail": "ERR_MOVIE_LIST_NAME_ALREADY_EXISTS"}
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
    result["num_ratings"] = await get_num_rating_by_movie_id(db, movie_id)

    if user_id is not None:
        result["current_user_rating"] = db.query(MovieRatings).filter(MovieRatings.movie_id == movie_id, MovieRatings.user_id == user_id).first()
    
    return result

async def get_movies(db: Session, page: int = 0, page_size: int = 10, search_params: dict = None, user_id: int = None):
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

    title = search_params.pop("title", "")
    genre = search_params.pop("genre", "")
    subgenre = search_params.pop("subgenre", "")
    subgenre = subgenre.split(",")
    max_rating = search_params.pop("max_rating", 999999)
    min_rating = search_params.pop("min_rating", -999999)
    print(min_rating, max_rating)
    query = (db.query(Movie)
                .filter_by(**search_params)
                .filter(and_(
                    Movie.title.contains(title), 
                    Movie.genre.contains(genre),
                )) 
                .filter(or_(*[Movie.subgenre.contains(sub) for sub in subgenre])) 
                )
    
    result = query.offset(skip).limit(limit).all()
    max_page = math.ceil(query.count() / page_size)

    _result = []
    for movie in result:
        average_rating = await get_movie_ratings_average(db, movie.id)
        if average_rating["average"] < min_rating or average_rating["average"] > max_rating:
            continue
        movie.average_rating = average_rating["average"]
        movie.num_ratings = await get_num_rating_by_movie_id(db, movie.id)
        _result.append(movie)
    
    result = _result

    if user_id is not None:
        for movie in result:
            movie.current_user_rating = db.query(MovieRatings).filter(MovieRatings.movie_id == movie.id, MovieRatings.user_id == user_id).first()

    return {"list": result, "max_page": max_page}

async def get_movies_string_search(db: Session, page: int = 0, page_size: int = 10, search_string: str = None, user_id: int = None, is_deleted: bool = None):
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
    search_params = {}
    if search_string is None:
        search_string = ""
    if is_deleted is not None:
        search_params["is_deleted"] = is_deleted

    query = db.query(Movie).filter(or_(
                    Movie.title.contains(search_string), 
                    Movie.genre.contains(search_string),
                    Movie.subgenre.contains(search_string),
                )).filter_by(**search_params)
    
    result = query.offset(skip).limit(limit).all()
    max_page = math.ceil(query.count() / page_size)

    for movie in result:
        average_rating = await get_movie_ratings_average(db, movie.id)
        movie.average_rating = average_rating["average"]
        movie.num_ratings = await get_num_rating_by_movie_id(db, movie.id)
    
    if user_id is not None:
        for movie in result:
            movie.current_user_rating = db.query(MovieRatings).filter(MovieRatings.movie_id == movie.id, MovieRatings.user_id == user_id).first()

    return {"list": result, "max_page": max_page}

async def get_top_trending_movies(db: Session, top_k: int, search_params: dict, user_id: int = None):
    """
    Retrieve a list of top trending movies from the database.

    Args:
        db (Session): The database session.

    Returns:
        List[models.Movie]: A list of movie objects.
    """
    movies = db.query(Movie).filter_by(**search_params).order_by(Movie.views.desc()).limit(top_k).all()
    # Get average rating for each movie
    for movie in movies:
        average_rating = await get_movie_ratings_average(db, movie.id)
        movie.average_rating = average_rating["average"]
        movie.num_ratings = await get_num_rating_by_movie_id(db, movie.id)
    
    return movies

async def get_top_listed_movies(db: Session, top_k: int):
    """
    Retrieve a list of top favourite movies from the database (movies that are in the most movie lists).
    Each user count 1 time
    Args:
        db (Session): The database session.
        top_k (int): The number of movies to retrieve.
    Return: 
        List[models.Movie]: A list of movie objects.
    """
    
    subqry = db.query(MovieListMovie.movie_id,
                      Movie, 
                      MovieListMovie.movie_list_id, 
                      MovieList.owner_id) \
    .join(MovieList, MovieListMovie.movie_list_id == MovieList.id) \
    .join(Movie, MovieListMovie.movie_id == Movie.id) \
    .filter(MovieList.is_deleted == False) \
    .filter(Movie.is_deleted == False) \
    .distinct().subquery()

    query = db.query(subqry.c.movie_id, 
                   subqry.c.title,
                   subqry.c.description, 
                   subqry.c.date_of_release, 
                   subqry.c.url, 
                   subqry.c.thumbnail_url, 
                   subqry.c.views, 
                   subqry.c.genre, 
                   subqry.c.subgenre, 
                   subqry.c.source, 
                   subqry.c.is_deleted,
                   func.count(subqry.c.movie_list_id).label("ml_count"),
                   )\
    .group_by(subqry.c.movie_id)\
    .order_by(text("ml_count DESC"))\
    .limit(top_k) \
    .all()
    
    results = []
    for item in query:
        res = {}
        res["id"] = item[0]
        res["title"] = item[1]
        res["description"] = item[2]
        res["date_of_release"] = item[3]
        res["url"] = item[4]
        res["thumbnail_url"] = item[5]
        res["views"] = item[6]
        res["genre"] = item[7]
        res["subgenre"] = item[8]
        res["source"] = item[9]
        res["is_deleted"] = item[10]
        res["ml_count"] = item[11]
        results.append(res)

    return results


async def create_movie(db: Session, movie: MovieCreate):
    """
    Create a new movie in the database.

    Args:
        db (Session): The database session.
        movie (schemas.MovieCreate): The movie data to be created.
    Returns:
        models.Movie: The created movie object.
    """
    db_movie = db.query(Movie).filter(Movie.title == movie.title, Movie.is_deleted == False).first()
    if db_movie is not None:
        raise HTTPException(status_code=400, detail="ERR_MOVIE_NAME_ALREADY_EXISTS")
    db_movie = Movie(**movie.model_dump())
    db_movie.subgenre = ",".join(movie.subgenre)
    db_movie.views = 0
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
    attributes = ['title', 'description', 'date_of_release', 'url', 'thumbnail_url', 'views', 'genre', 'subgenre', 'source', 'is_deleted']

    if getattr(movie, "title") is not None:
        same_name_movie = db.query(Movie).filter(Movie.title == movie.title, Movie.id != movie_id, Movie.is_deleted == False).first()
        if same_name_movie is not None:
            raise HTTPException(status_code=400, detail="ERR_MOVIE_NAME_ALREADY_EXISTS")

    for attr in attributes:
        if not hasattr(movie, attr):
            continue
        if getattr(movie, attr) is None:
            continue
        if getattr(movie, attr) == "":
            continue
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

async def get_unique_genres(db: Session):
    """
    Retrieve a list of unique genres from the database.

    Args:
        db (Session): The database session.

    Returns:
        List[str]: A list of unique genres.
    """
    return db.query(Movie.genre).distinct().all()

async def get_unique_subgenres(db: Session):
    """
    Retrieve a list of unique subgenres from the database.

    Args:
        db (Session): The database session.

    Returns:
        List[str]: A list of unique subgenres.
    """
    subgenres = db.query(Movie.subgenre).distinct().all()

    # Split the subgenres into a list
    subgenres = [subgenre[0].split(",") for subgenre in subgenres if subgenre[0] is not None]

    # Deduplicate the subgenres
    subgenres = list(set([sub for subgenre in subgenres for sub in subgenre]))

    return subgenres

# Get viewcount by unique genre
async def get_viewcount_by_genre(db: Session):
    """
    Retrieve a list of unique genres from the database.

    Args:
        db (Session): The database session.

    Returns:
        List[str]: A list of unique genres.
    """
    result_raw = db.query(Movie.genre, func.sum(Movie.views)).group_by(Movie.genre).all()
    results = []
    for result_raw_item in result_raw:
        results.append({"genre": result_raw_item[0], "viewcount": result_raw_item[1]})
    return results

# Get average rating by unique genre
async def get_avg_rating_by_genre(db: Session):
    """
    Retrieve a list of unique genres from the database.

    Args:
        db (Session): The database session.

    Returns:
        List[str]: A list of unique genres.
    """
    result_raw = db.query(Movie.genre, func.avg(MovieRatings.rating)).join(MovieRatings).group_by(Movie.genre).all()
    results = []
    for result_raw_item in result_raw:
        results.append({"genre": result_raw_item[0], "rating": result_raw_item[1]})
    return results

async def get_avg_rating_by_subgenre(db: Session, subgenre:str):
    """
    Retrieve average rating by one subgenre from the database.

    Args:
        db (Session): The database session.
    
    Return:
        float: The average rating.
    """
    result = db.query(MovieRatings.rating).join(Movie).filter(Movie.subgenre.contains(subgenre)).all()
    average = 0
    for rating in result:
        average += rating[0]
    if len(result) > 0:
        average /= len(result)
    return average

async def get_viewcount_by_subgenre(db: Session, subgenre:str):
    """
    Retrieve total viewcount for one subgenre from the database.
    
    Args:
        db (Session): The database session.

    Return:
        int: The total viewcount.
    """
    result = db.query(Movie.views).filter(Movie.subgenre.contains(subgenre)).all()
    total = 0
    for view in result:
        if view[0] is None:
            continue
        total += view[0]
    return total

# Get average rating by subgenres
async def get_avg_rating_by_subgenres(db: Session):
    """
    Retrieve a list of unique genres from the database and their average rating.

    Args:
        db (Session): The database session.

    Returns:
        List[str]: A list of unique genres.
    """
    unique_subgenres = await get_unique_subgenres(db)
    result = []
    for subgenre in unique_subgenres:
        result.append({"subgenre": subgenre, "rating": await get_viewcount_by_subgenre(db, subgenre)})    
    return {}

async def get_viewcount_by_subgenres(db: Session):
    """
    Retrieve a list of unique genres from the database and their viewcount.

    Args:
        db (Session): The database session.

    Returns:
        List[str]: A list of unique genres.
    """
    unique_subgenres = await get_unique_subgenres(db)
    result = []
    for subgenre in unique_subgenres:
        result.append({"subgenre": subgenre, "viewcount": await get_viewcount_by_subgenre(db, subgenre)})   
    return result

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
    result = db.query(MovieRatings).filter(MovieRatings.movie_id == movie_id, MovieRatings.is_deleted == False).all()
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
    search_params = {}
    if movie_id is not None:
        search_params["movie_id"] = movie_id
    if user_id is not None:
        search_params["user_id"] = user_id
    
    max_page = math.ceil(db.query(MovieRatings).filter_by(**search_params).count() / page_size)
    result = db.query(MovieRatings).filter_by(**search_params).offset(skip).limit(limit).all()
    return {"list": result, "max_page": max_page}

async def get_num_rating_by_movie_id(db: Session, movie_id: int):
    """
    Retrieve a list of movie ratings from the database.

    Args:
        db (Session): The database session.
        movie_id (int): The ID of the movie to retrieve the ratings for.

    Returns:
        List[models.MovieRating]: A list of movie rating objects.
    """
    return db.query(MovieRatings).filter(MovieRatings.movie_id == movie_id).count()

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
    filters = {}
    if movie_rating_id is not None:
        filters["movie_rating_id"] = movie_rating_id
    if user_id is not None:
        filters["user_id"] = user_id

    db_movie_rating = db.query(MovieRatings).filter_by(**filters).first()
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
    result = db.query(MovieComments).filter(MovieComments.id == db_movie_comment.id).first()
    user = db.query(User).filter(User.id == result.user_id).first()
    result.user_id = user.id
    result.user_name = user.name
    result.user_avatar = user.avatar_url
    return result

async def get_movie_comments(db: Session, movie_id: int, user_id: int = None, is_deleted:bool = None, page: int = 0, page_size: int = 100):
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
    search_params = {}
    if movie_id:
        search_params["movie_id"] = movie_id
    if user_id:
        search_params["user_id"] = user_id
    if is_deleted is not None:
        search_params["is_deleted"] = is_deleted

    max_page = math.ceil(db.query(MovieComments).filter_by(**search_params).count() / page_size)
    result = db.query(MovieComments).filter_by(**search_params).offset(skip).limit(limit).all()
    for comment in result:
        user = db.query(User).filter(User.id == comment.user_id).first()
        comment.user_id = user.id
        comment.user_name = user.name
        comment.user_avatar = user.avatar_url

    return {"list": result, "max_page": max_page}

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

    result = db.query(MovieComments).filter(MovieComments.id == db_movie_comment.id).first()
    user = db.query(User).filter(User.id == result.user_id).first()
    result.user_id = user.id
    result.user_name = user.name
    result.user_avatar = user.avatar_url
    return result

async def delete_movie_comment(db: Session, movie_comment_id: int, user: User):
    """
    Delete a movie comment from the database.

    Args:F
        db (Session): The database session.
        movie_comment_id (int): The ID of the movie comment to be deleted.

    Returns:
        MovieComment: The deleted movie comment object.
    """
    db_movie_comment = db.query(MovieComments).filter(MovieComments.id == movie_comment_id).first()
    if db_movie_comment is None:
        raise HTTPException(status_code=404, detail="ERR_MOVIE_COMMENT_NOT_FOUND")
    if user.id != db_movie_comment.user_id and not user.is_content_admin:
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

