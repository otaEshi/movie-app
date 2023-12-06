export interface ISignInPayload {
    username: string,
    password: string,
}
export interface ISignUpPayload {
    name: string;
    email: string;
    username: string;
    password: string;
    day_of_birth: number;
    month_of_birth: number;
    year_of_birth: number;
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