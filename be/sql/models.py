from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
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
        - avatar_url: str
        - year_of_birth: int
        - month_of_birth: int
        - day_of_birth: int
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
    avatar_url = Column(String(256), default="")
    time_of_birth = Column(Integer, index=True)
    is_active = Column(Boolean, index=True, default=True)
    is_admin = Column(Boolean, default=False)
    is_content_admin = Column(Boolean, default=False)

    movielists = relationship("MovieList")


class MovieList(Base):
    """
        MovieList model
    """
    __tablename__ = "movielists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), index=True)
    description = Column(String(1024))
    created_time = Column(Integer, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

class MovieViews(Base):
    """
        MovieViews model
    """
    __tablename__ = "movieviews"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    timestamp = Column(Integer, index=True)
    view_count = Column(Integer, index=True)

    movie = relationship("Movie")

class MovieListMovie(Base):
    """
        MovieListMovie model
    """
    __tablename__ = "movielistmovies"

    id = Column(Integer, primary_key=True, index=True)
    movie_list_id = Column(Integer, ForeignKey("movielists.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))

    movie_list = relationship("MovieList")
    movie = relationship("Movie")

class Movie(Base):
    """
        Movie model
    """
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(256), index=True)
    description = Column(String(1024))
    year_of_release = Column(Integer, index=True)
    url = Column(String(256))
    thumbnail_url = Column(String(256))
    views = Column(Integer, index=True)

class MovieComments(Base):
    """
        MovieComments model
    """
    __tablename__ = "moviecomments"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(String(1024))
    timestamp = Column(Integer, index=True)

class MovieRatings(Base):
    """
        MovieRatings model
    """
    __tablename__ = "movieratings"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer, index=True)
    timestamp = Column(Integer, index=True)