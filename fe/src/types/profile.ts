export interface IBase64Image{
    image_base64: string;
}

export interface IUpdatePayload {
    name?: string;
    date_of_birth?: string;
    avatar?: IBase64Image
}
export interface IChangePassword {
    old_password: string;
    new_password: string;
}