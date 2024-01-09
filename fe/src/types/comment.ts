export interface IComment {
    comment_id : number;
    comment : string;
    is_delete : boolean;
    user_id : number;
    user_name: string;
    user_url: string;
    movie_id : number;
    create_at : Date;
}
export interface IGetCommentPayload {
    movie_id : number;
    page : number;
    page_size : number;
}
export interface IUpdateCommentPayload {
    movie_comment_id : number;
    comment : string;
    is_deleted : boolean;
}
export interface IDeleteCommentPayload {
    movie_comment_id : number;
}