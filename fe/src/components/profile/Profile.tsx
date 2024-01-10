import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IUserInfoResponse } from "../../types/auth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import './profile.scss'
import { _refresh_token } from "../../axiosConfig";

interface IProfileProps {
    // setOpenSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
    // setOpenSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
    // handleLoginSuccess: () => void;
    currentUser: IUserInfoResponse
    setCurrentUser: React.Dispatch<React.SetStateAction<IUserInfoResponse>>
    handleLogout: () => void
    // setUpdateAvatar: React.Dispatch<React.SetStateAction<File>>
    handleUpdateAvatar: (newAvatar : File) => void
    handleUpdateUser: () => void
    handleChangePassword: (old_password: string, new_password: string) => void
}

// function SignInPage({ setOpenSignUpModal, setOpenSignInModal, setIsLogin }: ISignInFormatProps) {
function Profile(props: IProfileProps) {
    const [isInformation, setIsInformation] = useState<boolean>(true);
    const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [avatar_url, setAvatar_url] = useState<string>(props.currentUser.avatar_url);

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'oldPassword') {
            setOldPassword(value);
        }
        if (id === 'newPassword') {
            setNewPassword(value);
        }
    }

    const dispatch = useAppDispatch();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setCurrentUser({
            ...props.currentUser,
            date_of_birth : e.target.value
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedAvatar = e.target.files[0];
            setAvatar(selectedAvatar);
        }
        console.log('avatar: ',avatar)
        avatar && props.handleUpdateAvatar(avatar)
    };

    useLayoutEffect(() => {
        setAvatar_url(props.currentUser.avatar_url);
    },[props.currentUser])

    const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setCurrentUser({
            ...props.currentUser,
            name : e.target.value
        });
    };

    const handleUpdate = () => {
    }

    return (
        <div className="container">
            <div className="row w-100 ">
                <div className="col-3 bg-primary-subtle border-right d-flex flex-column align-items-center">
                    {/* <img src={`${avatar_url}`} alt='' style={{ width: '120px', height: '120px', objectFit: 'cover' }} className="mt-2"></img> */}
                    
                    {avatar_url ?
                    <img src={`${avatar_url}`} alt='' style={{ width: '120px', height: '120px', objectFit: 'cover' }}></img>
                    :
                    <i className="fa fa-user mt-4"  aria-hidden="true"></i>
                  }
                    <div>{props.currentUser.username}</div>
                    <div
                        className="custom-profile-nav"
                        onClick={() => {
                            setIsInformation(true)
                            setIsChangePassword(false)
                        }}
                    > Thông tin chung </div>
                    <div
                        className="custom-profile-nav"
                        onClick={() => {
                            setIsInformation(false)
                            setIsChangePassword(true)
                        }}> Đổi mật khẩu </div>
                    <div
                        className="custom-profile-nav"
                        onClick={() => {
                            props.handleLogout()
                        }}
                    > Đăng xuất </div>
                </div>
                <div className="col-9 bg-secondary">
                    {isInformation && (
                        <div>
                            <h1> Thông tin tài khoản </h1>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Tên tài khoản</label>
                                <input type="text" className="form-control" id="username" value={props.currentUser.username} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" value={props.currentUser.email} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fullname" className="form-label">Họ tên</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="fullname"
                                    value={props.currentUser.name}
                                    onChange={handleFullnameChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="date" className="col-form-label">Ngày sinh</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={props.currentUser.date_of_birth}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="avatar" className="form-label">Ảnh đại diện</label>
                                <input type="file" className="form-control" id="avatar" accept="image/*" onChange={handleAvatarChange} />
                                {avatar && (
                                    <div className="mt-3">
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            alt="Avatar Preview"
                                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <button className="btn btn-primary mb-3" 
                            onClick={props.handleUpdateUser}
                            // onClick={handleUpdate}
                            >Cập nhật</button>

                        </div>
                    )}
                    {isChangePassword && (
                        <div>
                            <h1> Đổi mật khẩu </h1>
                            <div className="mb-3">
                                <label htmlFor="oldPassword" className="form-label">Mật khẩu cũ</label>
                                <input type="text" className="form-control" id="oldPassword" value={oldPassword} onChange={handleChangePassword}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                <input type="text" className="form-control" id="newPassword" value={newPassword} onChange={handleChangePassword}/>
                            </div>
                            <button className="btn btn-primary mb-3" onClick={() => props.handleChangePassword(oldPassword, newPassword)}>Đổi mật khẩu</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;