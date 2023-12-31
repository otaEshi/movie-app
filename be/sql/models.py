from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    """
        User model
        @Properties
        - username: str
        - password_hash: str
        - email: str
        - name: str
        - avatar_id: str
        - date_of_birth: datetime
        - is_active: bool
        - is_admin: bool
        - movielists: list
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True, index=True, nullable=False)
    password_hash = Column(String(72), nullable=False)
    email = Column(String(32), unique=False, index=True)
    name = Column(String(128), index=True)
    avatar_url = Column(String(512), default="")
    date_of_birth = Column(Date, index=True)
    is_active = Column(Boolean, index=True, default=True)
    is_admin = Column(Boolean, default=False)
    is_content_admin = Column(Boolean, default=False)

    movielists = relationship("MovieList")

class MovieList(Base):
    """
        MovieList model

        Attributes:
            id (int): The ID of the movie list.
            name (str): The name of the movie list.
            description (str): The description of the movie list.
            created_at (datetime): The date of creation of the movie list.
            owner_id (int): The ID of the owner of the movie list.
    """
    __tablename__ = "movielists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), index=True)
    description = Column(String(1024))
    created_at = Column(DateTime, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_deleted = Column(Boolean, default=False)

    movies = relationship("MovieListMovie", back_populates="movie_list")

class MovieListMovie(Base):
    """
        MovieListMovie model
    """
    __tablename__ = "movielistmovies"

    id = Column(Integer, primary_key=True, index=True)
    movie_list_id = Column(Integer, ForeignKey("movielists.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))

    movie_list = relationship("MovieList", back_populates="movies")
    movie = relationship("Movie")

class Movie(Base):
    """
        Movie model

        Attributes:
            id (int): The ID of the movie.
            title (str): The title of the movie.
            description (str): The description of the movie.
            date_of_release (datetime): The date of release of the movie.
            url (str): The URL of the movie.
            thumbnail_id (str): The thumbnail ID of the movie.
            views (int): The number of views of the movie.
            genre (str): The genre of the movie.
            subgenre (str): The list of subgenres of the movie.
    """
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(256), index=True)
    description = Column(String(1024))
    date_of_release = Column(Date, index=True)
    url = Column(String(256))
    thumbnail_url = Column(String(512))
    views = Column(Integer, index=True)
    genre = Column(String(256), index=True)
    subgenre = Column(String(256), index=True)
    source = Column(String(256), index=True)
    is_deleted = Column(Boolean, default=False)

class MovieComments(Base):
    """
        MovieComments model
    """
    __tablename__ = "moviecomments"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(String(1024))
    created_at = Column(DateTime, index=True)
    is_deleted = Column(Boolean, default=False)

class MovieRatings(Base):
    """
        MovieRatings model
    """
    __tablename__ = "movieratings"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer, index=True)
    created_at = Column(DateTime, index=True)
    is_deleted = Column(Boolean, default=False)