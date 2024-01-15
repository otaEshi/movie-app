import { IUserInfoResponse } from "./auth";

export interface IUserList {
    list : IUserInfoResponse[];
    max_page : number;
}

export interface IGetAllUserPayload {
    page : number;
    page_size : number;
    user_name? : string;
    is_content_admin?: boolean;
}

export interface IAdjustUserPermissionPayload { 
    user_id : number;
    is_content_admin : boolean;
}

export interface IUpdateUserActivePayload {
    user_id : number;
    is_active : boolean;
}

export interface IMovieViewPerGenre {
    genre: string;
    viewcount: number;
}

export interface IListMovieViewPerGenre {
    list: IMovieViewPerGenre[];
}

export interface IMovieRatingPerGenre {
    genre: string;
    rating: number;
}

export interface IListMovieRatingPerGenre {
    list: IMovieRatingPerGenre[];
}

export interface ITopListPayload {
    top_k : number;
}

export interface IMovieInTopList {
    id: number;
    title: string;
    description: string;
    date_of_release: string;
    url: string;
    thumbnail_url: string;
    views: number;
    genre: string;
    subgenre: string;
    source: string;
    is_deleted: boolean;
    ml_count: number;
}

export interface ITopListed{
    list: IMovieInTopList[];
}