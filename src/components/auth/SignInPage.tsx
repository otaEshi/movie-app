import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ISignInPayload } from "../../types/auth";
import { signInRequest } from "./authApi";
import './auth.scss';

function SignInPage() {
    const [email, setEmail] = useState<string>('');
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
        if (id === 'email') {
            setEmail(value);
            setEmailError('');
        }
        if (id === 'password') {
            setPassword(value);
            setPasswordError('');
        }
    };

    const handleSignIn = () => {
        if (email === '') {
            setEmailError('This field must not be blank.');
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        if (password === '') {
            setPasswordError('This field must not be blank.');
            return;
        }
        if (/\s/.test(password)) {
            setPasswordError('Password cannot contain spaces in between.');
            return;
        }
        if (!passwordRegex.test(password)) {
            setPasswordError('Password must contain: 8-64 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.')
            return;
        }

        const payload: ISignInPayload = {
            email: email,
            password: password
        };

        dispatch<any>(signInRequest(payload)).then((result: any) => {
            console.log(result);
            if (result.meta.requestStatus === "fulfilled") {
                navigate('/');
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
                                type="email"
                                id="email"
                                className="custom-input"
                                value={email || ''}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Email"
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
                        <p>
                            Don't have an account? <Link className='custom-nav-text' to='/sign_up' tabIndex={-1}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
//     const [username, setUsername] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [isRemember, setIsRemember] = useState(false);

//     const navigate = useNavigate();

//     const handleRemember = () => {
//         setIsRemember(!isRemember);
//         console.log(isRemember)
//     }

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { id, value } = e.target;
//         if (id === 'username') {
//             setUsername(value);

//         }
//         if (id === 'password') {
//             setPassword(value);

//         }

//     }

//     return (
//         <div className='img'>
//             <div className="container">
//                 <div className="row justify-content-center ">
//                     <div className="col-md-6 col-lg-4 login-container">
//                         <div className='custom-login-panel'>
//                             <h3 className="mb-4 text-center custom-login-header">Have an account?</h3>
//                             <div className="">

//                                 <input
//                                     className="custom-login-input mb-2"
//                                     type="text"
//                                     id="username"
//                                     value={username || ''}
//                                     onChange={(e) => handleInputChange(e)}
//                                     placeholder="Username"
//                                     autoFocus
//                                 />
//                                 <input
//                                     className="custom-login-input"
//                                     type="password"
//                                     id="password"
//                                     value={password || ''}
//                                     onChange={(e) => handleInputChange(e)}
//                                     placeholder="Password"
//                                 />
//                                 <button tabIndex={-1} type="button" className="custom-sign-in-button">Sign In</button>
//                             </div>
//                         </div>
//                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                             <div style={{ width: '50%' }}>
//                                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <input
//                                         tabIndex={-1}
//                                         className="remember-me-checkbox"
//                                         type="checkbox"
//                                         id="rememberMeCheckbox"
//                                         checked={isRemember}
//                                         onChange={handleRemember}
//                                     />
//                                     <label htmlFor="rememberMeCheckbox" className="form-check-label primary-color">
//                                         Remember me
//                                     </label>
//                                 </div>
//                             </div>
//                             <div
//                                 tabIndex={-1}
//                                 style={{ width: '50%', textAlign: 'right', color: '#fff', textDecoration: 'none', cursor: 'pointer' }}
//                                 onClick={() => navigate('/sign_up')}
//                             >
//                                 Forgot Password
//                             </div>
//                         </div>
//                         {/* <div className="d-flex justify-content-around">
//                             <div className="w-50">
//                                 <div className="form-check form-check-inline">
//                                     <input
//                                         className="form-check-input"
//                                         type="checkbox"
//                                         id="rememberMeCheckbox"
//                                         checked={isRemember}
//                                         onChange={handleRemember}
//                                     />
//                                     <label className="form-check-label primary-color" htmlFor="rememberMeCheckbox">
//                                         Remember me
//                                     </label>
//                                 </div>
//                             </div>
//                             <div className="w-50 custom-text-align-right">
//                                 <a href="#" style={{ color: '#fff' }}>Forgot Password</a>
//                             </div>
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

export default SignInPage;