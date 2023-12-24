import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload } from "../../types/auth";
import { signInRequest } from "./authApi";
import './auth.scss';
import { showAlert } from "../../utils/showAlert";

function SignInPage({setOpenSignUpModal, setOpenSignInModal, isLoginOk, setUsernameHeader}:any) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    // Checking
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        if (id === 'username') {
            setUsername(value);
            setUsernameError('');
        }
        if (id === 'password') {
            setPassword(value);
            setPasswordError('');
        }
    };

    const handleSignIn = () => {
        if (username === ''){
            setUsernameError('This field must not be blank.')
        }
        if (password === '') {
            setPasswordError('This field must not be blank.');
            return;
        }

        const payload: ISignInPayload = {
            username: username,
            password: password
        };

        dispatch<any>(signInRequest(payload)).then((result: any) => {
            console.log(result);
            if (result.payload?.access_token) {
                setOpenSignInModal(false);
                isLoginOk(true);
                setUsernameHeader(username);
                // set log in state in store for all page to use, not just header (pending job)
            } else if (result.payload?.code){
                setUsernameError('Invalid username or password')
                setUsername('');
                setPassword('');
            }
        })

    };

    return (
        <div>
            <div className="custom-container">
                <div className="custom-panel">
                    <div className='position-relative'>
                        <h1 className="custom-signin-title mb-4">Đăng nhập</h1>
                        <div>
                            <input
                                type="text"
                                id="username"
                                className="custom-input"
                                value={username || ''}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Tài khoản"
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                            />
                        </div>
                        <div className="custom-error-text-wrapper">{usernameError && <div className="text-danger small position-absolute custom-error-text">{usernameError}</div>}</div>
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
                                Đăng nhập
                            </button>
                        </div>
                        <div>
                            <p>
                                {/* Don't have an account? <Link className='custom-nav-text' to='/sign_up' tabIndex={-1}>Sign up</Link> */}
                                Chưa có tài khoản? <span className='custom-nav-text' onClick={() => {
                                    setOpenSignInModal(false);
                                    setOpenSignUpModal(true);
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