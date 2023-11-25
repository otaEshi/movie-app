from pydantic import BaseModel

class User(BaseModel):
    id: int
    email: str
    name: str
    year_of_birth: int
    month_of_birth: int
    day_of_birth: int
    is_active: bool = True
    is_admin: bool = False
    movie_lists: list = []
    hashed_password: str = None
    
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: str
    name: str
    year_of_birth: int
    month_of_birth: int
    day_of_birth: int
    password: str

class UserEdit(BaseModel):
    email: str = None
    name: str = None
    year_of_birth: int = None
    month_of_birth: int = None
    day_of_birth: int = None
    password: str = None

class MovieBase(BaseModel):
    title: str
    description: str = None
    year_of_release: int = None
    url: str = None
    thumbnail_url: str = None
    views: int = None
    movies: list = []

    class Config:
        orm_mode = True

class MovieCreate(BaseModel):
    title: str
    description: str = None
    year_of_release: int = None
    url: str = None
    thumbnail_url: str = None
    views: int = None
    movies: list = []

class MovieListBase(BaseModel):
    id: int
    name: str
    description: str = None
    year_of_creation: int = None
    month_of_creation: int = None
    day_of_creation: int = None
    owner_id: int

    class Config:
        orm_mode = True

class MovieListCreate(BaseModel):
    name: str
    description: str = None
    year_of_creation: int = None
    month_of_creation: int = None
    day_of_creation: int = None
    owner_id: int