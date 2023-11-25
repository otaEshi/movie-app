from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    """
        User model
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    year_of_birth = Column(Integer, index=True)
    month_of_birth = Column(Integer, index=True)
    day_of_birth = Column(Integer, index=True)
    avatar_url = Column(String, default="")
    password_hash = Column(String)
    is_active = Column(Boolean, index=True, default=True)
    is_admin = Column(Boolean, default=False)

    items = relationship("Item", back_populates="owner")


class MovieList(Base):
    """
        MovieList model
    """
    __tablename__ = "movielists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    year_of_creation = Column(Integer, index=True)
    month_of_creation = Column(Integer, index=True)
    day_of_creation = Column(Integer, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")
    movies = relationship("Movie", back_populates="list")

class Movie(Base):
    """
        Movie model
    """
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    year_of_release = Column(Integer, index=True)
    url = Column(String)
    thumbnail_url = Column(String)
    views = Column(Integer, index=True)