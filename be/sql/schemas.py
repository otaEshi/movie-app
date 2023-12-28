from pydantic import BaseModel
from datetime import datetime, date

### User ###
class User(BaseModel):
    """
        User model
        
        Attributes:
            id (int): The ID of the user.
            email (str): The email address of the user.
            name (str): The name of the user.
            date_of_birth (datetime): The date of birth of the user.
            is_active (bool): Whether the user is active or not.
            is_admin (bool): Whether the user is an admin or not.
            movie_lists (list): The movie lists owned by the user.
            username (str): The username of the user.
            password_hash (str): The password hash of the user.
            avatar_id (str): The avatar ID of the user.
    """
    id: int
    email: str|None = None
    name: str
    date_of_birth: date|None = None
    is_active: bool = True
    is_admin: bool = False
    is_content_admin: bool = False
    movie_lists: list = []
    username: str = None
    password_hash: str = None
    avatar_id: str|None = None
    
    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    """
        UserCreate model

        Attributes:
            email (str): The email address of the user.
            name (str): The name of the user.
            date_of_birth (datetime): The date of birth of the user.
            username (str): The username of the user.
            password (str): The password of the user.
    """
    name: str
    date_of_birth: date
    username: str
    password: str

class UserEdit(BaseModel):
    """
        UserEdit model

        Attributes:
            email (str): The email address of the user.
            name (str): The name of the user.
            date_of_birth (datetime): The date of birth of the user.
            avatar_url (str): The avatar URL of the user.
            is_active (bool): Whether the user is active or not.
            is_content_admin (bool): Whether the user is a content admin or not.
    """
    name: str|None = None
    date_of_birth: date|None = None
    avatar_id: str|None = None

class UserEditPassword(BaseModel):
    """
        UserEditPassword model

        Attributes:
            old_password (str): The old password of the user.
            new_password (str): The new password of the user.
    """
    old_password: str
    new_password: str

### Movie ###

class MovieBase(BaseModel):
    """
        MovieBase model

        Attributes:
            id (int): The ID of the movie.
            title (str): The title of the movie.
            description (str): The description of the movie.
            date_of_release (datetime): The day of release of the movie.
            url (str): The URL of the movie.
            thumbnail_id (str): The thumbnail URL of the movie.
            views (int): The number of views of the movie.
            genre (str): The genre of the movie.
            movies (list): The movies in the movie list.
    """
    id: int
    title: str
    description: str = None
    date_of_release: date = None
    url: str = None
    thumbnail_id: str = None
    views: int = 0
    genre: str|None = None
    source: str = None

    class Config:
        from_attributes = True

class MovieViews(BaseModel):
    """
        MovieViews model

        Attributes:
            movie_id (int): The ID of the movie.
            day_of_view (int): The day of view of the movie.
            month_of_view (int): The month of view of the movie.
            year_of_view (int): The year of view of the movie.
            viewcount (int): The number of views of the movie.
    """
    movie_id: int
    created_at: datetime
    viewcount: int


class MovieCreate(BaseModel):
    """
        MovieCreate model

        Attributes:
            title (str): The title of the movie.
            description (str): The description of the movie.
            date_of_release (int): The date of release of the movie.
            url (str): The URL of the movie.
            thumbnail_id (str): The thumbnail id of the movie.
            genre (str): The genre of the movie.
    """
    title: str
    description: str = None
    date_of_release: date = None
    url: str = None
    thumbnail_id: str = None
    genre: str = None
    source: str = None

class MovieEdit(BaseModel):
    """
        MovieEdit model

        Attributes:
            title (str): The title of the movie.
            description (str): The description of the movie.
            date_of_release (int): The date of release of the movie.
            url (str): The URL of the movie.
            thumbnail_id (str): The thumbnail URL of the movie.
            genre (str): The genre of the movie.
    """
    title: str|None = None
    description: str|None = None
    date_of_release: date|None = None
    url: str|None = None
    thumbnail_id: str|None = None
    views: int|None = None
    genre: str|None = None
    source: str|None = None
    is_deleted: bool|None = None

class MovieRatingCreate(BaseModel):
    """
        MovieRatingsCreate model

        Attributes:
            movie_id (int): The ID of the movie.
            rating (int): The rating of the movie.
    """
    movie_id: int
    user_id: int
    rating: int
    created_at: datetime

class MovieRatingEdit(BaseModel):
    """
        MovieRatingsEdit model

        Attributes:
            rating (int): The rating of the movie.
    """
    rating: int|None = None
    is_deleted: bool|None = None

class MovieCommentCreate(BaseModel):
    """
        MovieCommentsCreate model

        Attributes:
            movie_id (int): The ID of the movie.
            comment (str): The comment of the movie.
    """
    movie_id: int
    user_id: int
    comment: str
    created_at: datetime

class MovieCommentEdit(BaseModel):
    """
        MovieCommentsEdit model

        Attributes:
            comment (str): The comment of the movie.
    """
    comment: str|None = None
    is_deleted: bool|None = None

### Movie List ###
class MovieListBase(BaseModel):
    """
        MovieListBase model

        Attributes:
            id (int): The ID of the movie list.
            name (str): The name of the movie list.
            description (str): The description of the movie list.
            created_at (datetime): The date of creation of the movie list.
            owner_id (int): The ID of the owner of the movie list.
    """
    id: int
    name: str
    description: str = None 
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class MovieListCreate(BaseModel):
    """
        MovieListCreate model

        Attributes:
            name (str): The name of the movie list.
            description (str): The description of the movie list.
            owner_id (int): The ID of the owner of the movie list.
    """
    name: str
    description: str = None
    movie_ids: list = []

class MovieListEdit(BaseModel):
    """
        MovieListCreate model

        Attributes:
            name (str): The name of the movie list.
            description (str): The description of the movie list.
            created_at (datetime): The date of creation of the movie list.
            owner_id (int): The ID of the owner of the movie list.
    """
    name: str|None
    description: str|None = None
    is_deleted: bool|None = False

class MovieListGet(BaseModel):
    """
        MovieListGet model

        Attributes:
            id (int): The ID of the movie list.
            name (str): The name of the movie list.
            description (str): The description of the movie list.
            created_at (datetime): The date of creation of the movie list.
            owner_id (int): The ID of the owner of the movie list.
            movies (list): The movies in the movie list.
    """
    id: int
    name: str
    description: str = None
    created_at: datetime
    owner_id: int
    movies: list = []