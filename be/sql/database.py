from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

if os.getenv("ENV") == "dev":
    SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user_0:d01b172a7d06dd91805e0c9d72cbc21102d3233ac32bece40036ec0368df2f8a@localhost:3306/movie_app"
else:
    SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user_0:d01b172a7d06dd91805e0c9d72cbc21102d3233ac32bece40036ec0368df2f8a@movie-app-db:3306/movie_app"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, pool_size=100
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
