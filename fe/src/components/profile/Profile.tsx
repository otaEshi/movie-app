import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload } from "../../types/auth";
import { useAppSelector } from "../../app/hooks";
import './profile.scss'

interface IProfileProps {
    // setOpenSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
    // setOpenSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
    // handleLoginSuccess: () => void;
    avatar_url: string
    handleLogout: () => void
}

// function SignInPage({ setOpenSignUpModal, setOpenSignInModal, setIsLogin }: ISignInFormatProps) {
function Profile(props: IProfileProps) {
    const username = useAppSelector(store => store.auth.currentUser.username)
    const email = useAppSelector(store => store.auth.currentUser.email)
    const [fullname, setFullname] = useState<string>(useAppSelector(store => store.auth.currentUser.name))
    const [isInformation, setIsInformation] = useState<boolean>(true);
    const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<File | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedAvatar = e.target.files[0];
            setAvatar(selectedAvatar);
        }
    };

    const handleUpdate = () => {
        console.log('test', props.avatar_url)
    }

    return (
        <div className="container">
            <div className="row w-100 ">
                <div className="col-3 bg-primary-subtle border-right d-flex flex-column align-items-center">
                    <img src={`${props.avatar_url}`} alt='' style={{ width: '120px', height: '120px', objectFit: 'cover' }} className="mt-2"></img>
                    <div>{username}</div>
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
                                <input type="text" className="form-control" id="username" value={username} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" value={email} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fullname" className="form-label">Họ tên</label>
                                <input type="email" className="form-control" id="fullname" value={fullname} />
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
                            <button className="btn btn-primary mb-3" onClick={() => handleUpdate()}>Cập nhật</button>

                        </div>
                    )}
                    {isChangePassword && (
                        <div>
                            <h1> Đổi mật khẩu </h1>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                <input type="email" className="form-control" id="newPassword" value={fullname} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmNewPassword" className="form-label">Xác nhận mật khẩu mới</label>
                                <input type="email" className="form-control" id="confirmNewPassword" value={fullname} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;