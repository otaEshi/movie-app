import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload, IUserInfoResponse } from "../../types/auth";
import Profile from "./Profile";
import { userInfoRequest } from "../auth/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axios from "axios";
import { logout, setAvatarURL } from "../auth/authSlice";
import { IChangePassword, IUpdatePayload } from "../../types/profile";
import { changePasswordRequest, updateUserInfoRequest } from "./profileApi";

// function SignInPage({ setOpenSignUpModal, setOpenSignInModal, setIsLogin }: ISignInFormatProps) {
function ProfileContainer() {
    const dispatch = useAppDispatch();
    const [isChange, setIsChange] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUserInfoResponse>(useAppSelector(store => store.auth.currentUser))
    const [updateAvatar, setUpdateAvatar] = useState<File>();

    const handleLogout = () => {
        dispatch(logout());
    }


    // useEffect(() => {
    //     axios.defaults.headers.common['Authorization'] = localStorage.getItem('token_type') + ' ' + localStorage.getItem('id_token');
    //     // console.log('check abcd')
    //     console.log('dispatch at profile')
    //     dispatch(userInfoRequest());
    //     // console.log('check avatar url: ', profile_avatar_url)
    //     if (!localStorage.getItem('avatar_url')) {
    //         // console.log('ehe: ', profile_avatar_url)
    //         setProfileAvatar_url('https://res.cloudinary.com/dnjw76gxi/image/upload/v1704099732/w6u7d2sonsdwoupk5k1c.png');
    //         // console.log('ehe +1: ', profile_avatar_url)
    //     }
    // }, [])

    const _handleUpdateAvatar = (newAvatar : File) => {
        setUpdateAvatar(newAvatar);
    }

    const _handleChangePassword = async (old_passowrd: string, new_password : string) => {
        const payload : IChangePassword = {
            old_password : old_passowrd,
            new_password : new_password
        }

        const res = await dispatch<any>(changePasswordRequest(payload))
        console.log('check response')
        console.log(res)
    }

    const handleUpdateUser = async () => {
        let payload: IUpdatePayload
        if (updateAvatar) {
            payload = {
                name: currentUser.name,
                date_of_birth: currentUser.date_of_birth,
                avatar: updateAvatar
            }
        } else {
            payload = {
                name: currentUser.name,
                date_of_birth: currentUser.date_of_birth,
            }
        }
        const res = await dispatch<any>(updateUserInfoRequest(payload))
        console.log('check responsssse')
        console.log(res)

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