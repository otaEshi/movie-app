export interface IComment {
    id : number;
    comment : string;
    is_delete : boolean;
    user_id : number;
    user_name: string;
    user_avatar_url: string;
    movie_id : number;
    create_at : Date;
}
export interface IGetCommentPayload {
    movie_id : number;
    page : number;
    page_size : number;
}
export interface ICreateCommentPayload {
    movie_id : number;
    comment : string;
}
export interface IUpdateCommentPayload {
    movie_id : number
    movie_comment_id : number;
    comment : string;
    is_deleted : boolean;
}
export interface IDeleteCommentPayload {
    movie_id : number
    movie_comment_id : number;
}
export interface ICommentList {
    list : IComment[];
    max_page : number
}