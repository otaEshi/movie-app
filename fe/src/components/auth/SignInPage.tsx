import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload } from "../../types/auth";
import { signInRequest } from "./authApi";
import './auth.scss';

function SignInPage({setOpenSignUpModal, setOpenSignInModal}:any) {
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
        }
        if (id === 'password') {
            setPassword(value);
            setPasswordError('');
        }
    };

    const handleSignIn = () => {
        if (username === '') {
            setEmailError('This field must not be blank.');
            return;
        }
        // if (!emailRegex.test(email)) {
        //     setEmailError('Please enter a valid email address.');
        //     return;
        // }
        // if (password === '') {
        //     setPasswordError('This field must not be blank.');
        //     return;
        // }
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

        dispatch<any>(signInRequest(payload)).then((result: any) => {
            console.log(result);
            if (result.meta.requestStatus === "fulfilled") {
                // navigate('/');
                setOpenSignInModal(false)
            } else {
                setEmailError('Invalid email or password.');
            }
        })

    };

    return (
        <div>
            <div className="custom-container">
                <div className="custom-panel">
                    <div className='position-relative'>
                        <h1 className="custom-signin-title mb-4">Sign In</h1>
                        <div>
                        <input
                                type="text"
                                id="username"
                                className="custom-input"
                                value={username || ''}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="username"
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
                                placeholder="Password"
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
                                Sign In
                            </button>
                        </div>
                        <div>
                            <p>
                                {/* Don't have an account? <Link className='custom-nav-text' to='/sign_up' tabIndex={-1}>Sign up</Link> */}
                                Don't have an account? <span className='custom-nav-text' onClick={() => {
                                    setOpenSignInModal(false);
                                    setOpenSignUpModal(true);
                                }} tabIndex={-1}>Sign up</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;