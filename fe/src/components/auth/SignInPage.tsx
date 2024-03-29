import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload } from "../../types/auth";
import { signInRequest, userInfoRequest } from "./authApi";
import './auth.scss';

interface ISignInFormatProps {
    setOpenSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleLoginSuccess: () => void;
}

// function SignInPage({ setOpenSignUpModal, setOpenSignInModal, setIsLogin }: ISignInFormatProps) {
function SignInPage(props: ISignInFormatProps) {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    // Checking
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSignIn();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        // if (id === 'email') {
        //     setEmail(value);
        //     setEmailError('');
        // }
        if (id === 'username') {
            setUsername(value);
            setEmailError('');
        }
        if (id === 'password') {
            setPassword(value);
            setPasswordError('');
        }
    };

    const handleSignIn = async () => {
        if (username === '') {
            setEmailError('Không được để trống');
            return;
        }
        // if (!emailRegex.test(email)) {
        //     setEmailError('Please enter a valid email address.');
        //     return;
        // }
        if (password === '') {
            setPasswordError('Không được để trống');
            return;
        }
        // if (/\s/.test(password)) {
        //     setPasswordError('Password cannot contain spaces in between.');
        //     return;
        // }
        // if (!passwordRegex.test(password)) {
        //     setPasswordError('Password must contain: 8-64 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.')
        //     return;
        // }

        const payload: ISignInPayload = {
            username: username,
            password: password
        };

        const result = await dispatch<any>(signInRequest(payload));

        // dispatch<any>(signInRequest(payload))
        // .then((result: any) => {
        // console.log(result);
        if (result.meta.requestStatus === "fulfilled") {
            // navigate('/');
            props.setOpenSignInModal(false);
            // await dispatch(userInfoRequest());
            
            props.handleLoginSuccess();
        } else {
            alert('Tài khoản hoặc mật khẩu không chính xác')
        }
        // }
        // )
    };

    return (
        <div>
            <div className="custom-container">
                <div className="custom-panel">
                    <div className='position-relative'>
                        <h1 className="custom-signin-title mb-4">Đăng Nhập</h1>
                        <div>
                            <input
                                type="text"
                                id="username"
                                className="custom-input"
                                value={username || ''}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Tên tài khoản"
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="custom-error-text-wrapper">{emailError && <div className="text-danger small position-absolute custom-error-text">{emailError}</div>}</div>
                        <div>
                            <input
                                className="custom-input"
                                type="password"
                                id="password"
                                value={password || ''}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Mật khẩu"
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div style={{
                            minHeight: '30px'
                        }}>
                            <div className="custom-error-text-wrapper">  {passwordError && <div className="text-danger small custom-error-text">{passwordError}</div>}</div>
                        </div>
                        <div className="mb-2 mt-3">
                            <button className="custom-btn" onClick={handleSignIn} tabIndex={-1}>
                                ĐĂNG NHẬP
                            </button>
                        </div>
                        <div>
                            <p>
                                {/* Don't have an account? <Link className='custom-nav-text' to='/sign_up' tabIndex={-1}>Sign up</Link> */}
                                Chưa có tài khoản? <span className='custom-nav-text' onClick={() => {
                                    props.setOpenSignInModal(false);
                                    props.setOpenSignUpModal(true);
                                }} tabIndex={-1}>Đăng ký</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;