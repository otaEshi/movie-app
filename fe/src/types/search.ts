import { IMovie } from "./movies";

export interface ISearchPayload {
    page? : number;
    page_size? : number;
    title?: string;
    des?: string;
    source? : string;
    search_string: string;
}
export interface ISearchResponse {
    list: IMovie[];
    max_page: number;
}