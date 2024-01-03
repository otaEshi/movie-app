export interface IUpdatePayload {
    name?: string;
    date_of_birth?: string;
    avatar?: File
}
export interface IChangePassword {
    old_password: string;
    new_password: string;
}