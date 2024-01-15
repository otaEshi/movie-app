import { IMovie } from "./movies";


export interface IMovieList{
    name: string;
    description: string;
    create_at: string;
    id: number;
    owner_id: number;
    movies: IMovie[]
}

export interface IUpdateMovieList{
    name: string;
    description: string;
    is_deleted : boolean;
    id : number;
    movies: number[];
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

export interface IUpdateMovieListResponse{
    id: number;
    create_at: string;
    is_deleted: boolean;
    name: string;
    description: string;
    owner_id: number;
}