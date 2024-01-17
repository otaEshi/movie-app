import { IMovie } from "./movies";

export interface ISearchPayload {
    page? : number;
    page_size? : number;
    title?: string;
    des?: string;
    source? : string;
    search_string: string;
    is_deleted: boolean;
}
export interface ISearchStringPayload{
    search_string: string;
    page? : number;
    page_size? : number;
    is_deleted?: boolean;
}
export interface IAdvancedSearchPayload {
    page? : number;
    page_size? : number;
    title?: string;
    genre?: string;
    subgenre?: string;
    source? : string;
    is_deleted?: boolean;
    max_rating?: number;
    min_rating?: number;
}
export interface ISearchResponse {
    list: IMovie[];
    max_page: number;
}