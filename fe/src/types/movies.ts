export interface ITrendingMoviesPayload {
    top_k: number;
    genre?: string;
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
    userRating?: number;
    globalRating: number;
}
export interface ITrendingMoviesResponse {
    movies: IMovie[]
}
   