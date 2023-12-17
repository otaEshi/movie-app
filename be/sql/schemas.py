from pydantic import BaseModel
from datetime import datetime

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
    """
    id: int
    email: str
    name: str
    date_of_birth: datetime
    is_active: bool = True
    is_admin: bool = False
    movie_lists: list = []
    username: str = None
    password_hash: str = None
    
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
    email: str
    name: str
    date_of_birth: datetime
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
    email: str = None
    name: str = None
    date_of_birth: datetime = None
    avatar_url: str = None
    is_active: bool = None
    is_content_admin: bool = None

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
            thumbnail_url (str): The thumbnail URL of the movie.
            views (int): The number of views of the movie.
            genre (str): The genre of the movie.
            movies (list): The movies in the movie list.
    """
    id: int
    title: str
    description: str = None
    date_of_release: datetime = None
    url: str = None
    thumbnail_url: str = None
    views: int = None
    genre: str = None
    movies: list = []

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
            day_of_release (int): The day of release of the movie.
            month_of_release (int): The month of release of the movie.
            year_of_release (int): The year of release of the movie.
            url (str): The URL of the movie.
            thumbnail_url (str): The thumbnail URL of the movie.
            genre (str): The genre of the movie.
    """
    title: str
    description: str = None
    date_of_release: datetime = None
    url: str = None
    thumbnail_url: str = None
    views: int = None
    genre: str = None

class MovieEdit(BaseModel):
    """
        MovieEdit model

        Attributes:
            title (str): The title of the movie.
            description (str): The description of the movie.
            day_of_release (int): The day of release of the movie.
            month_of_release (int): The month of release of the movie.
            year_of_release (int): The year of release of the movie.
            url (str): The URL of the movie.
            thumbnail_url (str): The thumbnail URL of the movie.
            genre (str): The genre of the movie.
    """
    title: str = None
    description: str = None
    date_of_release: datetime = None
    url: str = None
    thumbnail_url: str = None
    views: int = None
    genre: str = None

class MovieRatingsCreate(BaseModel):
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

class MovieCommentsCreate(BaseModel):
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
            created_at (datetime): The date of creation of the movie list.
            owner_id (int): The ID of the owner of the movie list.
    """
    name: str
    description: str = None
    created_at: datetime