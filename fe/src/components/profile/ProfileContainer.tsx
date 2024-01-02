import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload } from "../../types/auth";
import Profile from "./Profile";
import { userInfoRequest } from "../auth/authApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axios from "axios";
import { logout, setAvatarURL } from "../auth/authSlice";

// function SignInPage({ setOpenSignUpModal, setOpenSignInModal, setIsLogin }: ISignInFormatProps) {
function ProfileContainer() {
    const dispatch = useAppDispatch();
    console.log('checkkkkkkkkkkkkkkkkkkkkkkkkkkk')
    const [profile_avatar_url, setProfileAvatar_url] = useState<string>(useAppSelector(store => store.auth.currentUser.avatar_url));

    const handleLogout = () => {
        dispatch(logout());
    }


    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token_type') + ' ' + localStorage.getItem('id_token');
        // console.log('check abcd')
        console.log('dispatch at profile')
        dispatch(userInfoRequest());
        // console.log('check avatar url: ', profile_avatar_url)
        if (!localStorage.getItem('avatar_url')) {
            // console.log('ehe: ', profile_avatar_url)
            setProfileAvatar_url('https://res.cloudinary.com/dnjw76gxi/image/upload/v1704099732/w6u7d2sonsdwoupk5k1c.png');
            // console.log('ehe +1: ', profile_avatar_url)
        }
    }, [])

    return (
        <Profile
            avatar_url={localStorage.getItem('avatar_url')!}
            handleLogout={handleLogout}
        >

        </Profile>
    );
}

export default ProfileContainer;