import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload, IUserInfoResponse } from "../../types/auth";
import Profile from "./Profile";
import { userInfoRequest } from "../auth/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axios from "axios";
import { logout, setAvatarURL } from "../auth/authSlice";
import { IBase64Image, IChangePassword, IUpdatePayload } from "../../types/profile";
import { changePasswordRequest, updateUserInfoRequest } from "./profileApi";
import { showAlert } from "../../utils/showAlert";

// function SignInPage({ setOpenSignUpModal, setOpenSignInModal, setIsLogin }: ISignInFormatProps) {
function ProfileContainer() {
    const dispatch = useAppDispatch();
    const [isChange, setIsChange] = useState<boolean>(false);
    const [updateAvatar, setUpdateAvatar] = useState<string>();
    const tempUser = useAppSelector(store => store.auth.currentUser);
    const [currentUser, setCurrentUser] = useState<IUserInfoResponse>(tempUser);


    const handleLogout = () => {
        dispatch(logout());
    }

    useEffect(() => {
        setCurrentUser(tempUser)
        localStorage.setItem('is_refresh_page', 'false');
    }, [localStorage.getItem('is_refresh_page')]);



    // const NewCurrentUser = () => {
    //     const newCurrentUser = useAppSelector(store => store.auth.currentUser);
    //     setCurrentUser(newCurrentUser)
    // }


    // useEffect(() => {
    //     NewCurrentUser()
    // }, [useAppSelector(store => store.auth.currentUser)])
    // useEffect(() => {
    //     const newCurrentUser = useAppSelector((store) => store.auth.currentUser);
    //     setCurrentUser(newCurrentUser);
    //   }, [useAppSelector((store) => store.auth.currentUser)]);

    const _handleUpdateAvatar = (newAvatar: string) => {
        setUpdateAvatar(newAvatar);
    }

    const _handleChangePassword = async (old_passowrd: string, new_password: string) => {
        const payload: IChangePassword = {
            old_password: old_passowrd,
            new_password: new_password,
        }
        const res = await dispatch<any>(changePasswordRequest(payload))

        console.log('test ', res)
        if (res.type === "api/change_password/rejected") {
            // console.log('test reject')
            // showAlert('Mật khẩu cũ không đúng', 'danger')
            alert('Sai mật khẩu')
        } else {
            alert('Đổi mật khẩu thành công')
        }
    }
    console.log('avatar: ', updateAvatar)
    const handleUpdateUser = async () => {
        console.log('updated avatar: ', updateAvatar)
        let payload: IUpdatePayload
        console.log("update avatar: ", updateAvatar)
        if (updateAvatar) {
            payload = {
                name: currentUser.name,
                date_of_birth: currentUser.date_of_birth,
                avatar: {
                    image_base64: updateAvatar
                }
            }
        } else {
            payload = {
                name: currentUser.name,
                date_of_birth: currentUser.date_of_birth,
            }
        }
        const res = await dispatch<any>(updateUserInfoRequest(payload))


    }

    return (
        <Profile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            handleLogout={handleLogout}
            // setUpdateAvatar={setUpdateAvatar}
            handleUpdateAvatar={_handleUpdateAvatar}
            handleUpdateUser={handleUpdateUser}
            handleChangePassword={_handleChangePassword}
        />

    );
}

export default ProfileContainer;