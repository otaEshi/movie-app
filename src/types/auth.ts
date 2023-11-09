export interface ISignInPayload {
    email: string,
    password: string,
}
export interface ISignUpPayload {
    fullname: string;
    email: string;
    password: string;
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