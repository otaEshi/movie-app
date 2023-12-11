from pydantic import BaseModel

### User ###
class User(BaseModel):
    """
        User model
        
        Attributes:
            id (int): The ID of the user.
            email (str): The email address of the user.
            name (str): The name of the user.
            year_of_birth (int): The year of birth of the user.
            month_of_birth (int): The month of birth of the user.
            day_of_birth (int): The day of birth of the user.
            is_active (bool): Whether the user is active or not.
            is_admin (bool): Whether the user is an admin or not.
            movie_lists (list): The movie lists owned by the user.
            username (str): The username of the user.
            password_hash (str): The password hash of the user.
    """
    id: int
    email: str
    name: str
    year_of_birth: int
    month_of_birth: int
    day_of_birth: int
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
            year_of_birth (int): The year of birth of the user.
            month_of_birth (int): The month of birth of the user.
            day_of_birth (int): The day of birth of the user.
            username (str): The username of the user.
            password (str): The password of the user.
    """
    email: str
    name: str
    year_of_birth: int
    month_of_birth: int
    day_of_birth: int
    username: str
    password: str

class UserEdit(BaseModel):
    """
        UserEdit model

        Attributes:
            email (str): The email address of the user.
            name (str): The name of the user.
            year_of_birth (int): The year of birth of the user.
            month_of_birth (int): The month of birth of the user.
            day_of_birth (int): The day of birth of the user.
    """
    email: str = None
    name: str = None
    year_of_birth: int = None
    month_of_birth: int = None
    day_of_birth: int = None
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
            day_of_release (int): The day of release of the movie.
            month_of_release (int): The month of release of the movie.
            year_of_release (int): The year of release of the movie.
            url (str): The URL of the movie.
            thumbnail_url (str): The thumbnail URL of the movie.
            views (int): The number of views of the movie.
            genre (str): The genre of the movie.
            movies (list): The movies in the movie list.
    """
    id: int
    title: str
    description: str = None
    day_of_release: int = None
    month_of_release: int = None
    year_of_release: int = None
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
    day_of_view: int
    month_of_view: int
    year_of_view: int
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
    year_of_release: int = None
    url: str = None
    thumbnail_url: str = None
    views: int = None
    movies: list = []
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
    year_of_release: int = None
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
    timestamp: int

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
    timestamp: int

### Movie List ###

class MovieListBase(BaseModel):
    """
        MovieListBase model

        Attributes:
            id (int): The ID of the movie list.
            name (str): The name of the movie list.
            description (str): The description of the movie list.
            day_of_creation (int): The day of creation of the movie list.
            month_of_creation (int): The month of creation of the movie list.
            year_of_creation (int): The year of creation of the movie list.
            owner_id (int): The ID of the owner of the movie list.
    """
    id: int
    name: str
    description: str = None
    year_of_creation: int = None
    month_of_creation: int = None
    day_of_creation: int = None
    owner_id: int

    class Config:
        from_attributes = True

class MovieListCreate(BaseModel):
    """
        MovieListCreate model

        Attributes:
            name (str): The name of the movie list.
            description (str): The description of the movie list.
            day_of_creation (int): The day of creation of the movie list.
            month_of_creation (int): The month of creation of the movie list.
            year_of_creation (int): The year of creation of the movie list.
            owner_id (int): The ID of the owner of the movie list.
    """
    name: str
    description: str = None
    year_of_creation: int = None
    month_of_creation: int = None
    day_of_creation: int = None