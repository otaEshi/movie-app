export interface ITrendingMoviesPayload {
    top_k: number;
    genre?: string;
    is_deleted: boolean;
}
export interface IMovie {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    url: string;
    genre: string;
    subgenre: string;
    source: string;
    views: number;
    date_of_release: string;
    is_deleted: boolean;
    average_rating: number;
    num_ratings: number
}
export interface ICreateMoviePayload {
    title: string;
    description: string;
    date_of_release: string;
    url: string;
    genre: string;
    source: string;
    subgenre: string[];
    thumbnail_url: string;
}
export interface ITrendingMoviesResponse {
    movies: IMovie[]
}
export interface IMovieRequest {
    movie_id : number;
}
export interface IFirstRatePayload {
    movie_id : number;
    rating: number;
}   
export interface IUpdateRatingPayload {
    movie_id : number;
    rating: number;
    is_deleted?: boolean;
}
export interface ICreateMovieListPayload{
    name: string;
    description: string;
    movie_ids: number[];
}
export interface ICreateMovieListResponse{
    name: string;
    description: string;
    id: number;
}
