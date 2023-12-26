export interface ISignInPayload {
    username: string,
    password: string,
}
export interface ISignUpPayload {
    name: string;
    email: string;
    username: string;
    password: string;
    date_of_birth: string;
}
export interface IActivateInfo {
    uid: number;
    action: string;
}

export interface ISignInResponse {
    access_token:string,
    refresh_token:string
    // temp
  }

export interface ISignUpResponse {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    date_of_birth: string;
    movie_lists: string[];
    is_active: boolean;
    is_admin: boolean;
    is_content_admin: boolean;
}