import { IMovie } from "./movies";


export interface IMovieList{
    name: string;
    description: string;
    create_at: string;
    id: number;
    movies: IMovie[]
}

export interface IListMovieList{
    list: IMovieList[];
    max_page: number;
}


export interface IMovieListPublic{
    page: number;
    page_size: number;
    is_deleted: boolean;
}