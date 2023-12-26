import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import { ISignUpPayload } from '../../types/auth';
import { signUpRequest } from './authApi';

function SignUpPage({setOpenSignInModal, setOpenSignUpModal}:any) {
  const [fullname, setfullname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullnameError, setfullnameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Checking
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'fullname') {
      setfullname(value);
      setfullnameError('');
    }
    if (id === 'username') {
      setUsername(value);
    }
    if (id === 'password') {
      setPassword(value);
      setPasswordError('');
    }
    if (id === 'confirmPassword') {
      setConfirmPassword(value);
      setConfirmPasswordError('');
    }
  };

  const handleSignUp = () => {
    if (fullname === '') {
      setfullnameError('This field must not be blank.');
      return;
    }
    // if (email === '') {
    //   setEmailError('This field must not be blank.');
    //   return;
    // }
    // if (!emailRegex.test(email)) {
    //   setEmailError('Please enter a valid email address.');
    //   return;
    // }
    if (password === '') {
      setPasswordError('This field must not be blank.');
      return;
    }
    // if (!passwordRegex.test(password)) {
    //   setPasswordError('Password must contain: 8-64 characters, 1 uppercase letter, 1 lowercase letter, 1 number.')
    //   return;
    // }
    if (/\s/.test(password)) {
      setPasswordError('Password cannot contain spaces in between.');
      return;
    }
    if (confirmPassword === '') {
      setConfirmPasswordError('This field must not be blank.');
      return;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Password must be the same .');
      return;
    }

    // Dispatch sign up request
    const payload: ISignUpPayload = {
      name: fullname,
      email: "",
      username: username,
      password: password,
      // temp
      date_of_birth: "2023-12-24 15:16",
    };
    dispatch<any>(signUpRequest(payload))
      .then((result: any) => {
        if (result.payload?.response?.request?.response) {
          const response = JSON.parse(result.payload.response.request.response);
          console.log(response)
          const errorMessage = response.detail;

          console.log(errorMessage);
          if (errorMessage === "User is existed") {
            setEmailError('User Exists');
          }
        } else {
          // setShowSuccessMessage(!showSuccessMessage);
        }
      });
    // console.log("test: ", showSuccessMessage)
  };

  return (
    <div>
      <div className="row justify-content-center">
        {showSuccessMessage && (
          <div style={{ maxWidth: '75%', zIndex: 9999 }} className="alert alert-success alert-dismissible fade show position-absolute" role="alert">
            <button style={{ outline: 'none', boxShadow: 'none' }} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowSuccessMessage(false)}></button>
            <strong>Sign up successful!</strong> Click <span className='custom-text-link' onClick={() => { navigate('/sign_in') }}>here</span> to sign in.
          </div>
        )}
      </div>
      <div className="custom-container">
        <div className="custom-panel">
          <div className='position-relative'>
            <h1 className="custom-signin-title mb-4">Create Account</h1>
            <div>
              <input
                type="text"
                id="fullname"
                className="custom-input"
                value={fullname || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Fullname"
                autoComplete='off'
              />
            </div>
            <div className='custom-error-text-wrapper'>{fullnameError && <div className="text-danger small custom-error-text">{fullnameError}</div>}</div>
            <div>
              <input
                type="text"
                id="username"
                className="custom-input"
                value={username || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Username"
                autoComplete='off'
              />
            </div>
            <div className='custom-error-text-wrapper'>{emailError && <div className="text-danger small custom-error-text">{emailError}</div>}</div>
            <div>
              <input
                className="custom-input"
                type="password"
                id="password"
                value={password || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Password"
              />
            </div>
            <div className='custom-error-text-wrapper'>
              {passwordError && <div className="text-danger small custom-error-text">{passwordError}</div>}
            </div>
            <div>
              <input
                className="custom-input"
                type="password"
                id="confirmPassword"
                value={confirmPassword || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Confirm Password"
              />
            </div>
            <div className='custom-error-text-wrapper'>
              {confirmPasswordError && <div className="text-danger small custom-error-text">{confirmPasswordError}</div>}
            </div>
            <div className="mb-2 mt-3">
              <button className="custom-btn" onClick={handleSignUp} tabIndex={-1}>
                Sign Up
              </button>
            </div>
            <div>
              <p>
                {/* Already have an account? <Link to='/sign_in' className='custom-nav-text' tabIndex={-1}>
                  Sign in
                </Link> */}
                Already have an account? <span className='custom-text-link' onClick={() => { 
                  setOpenSignInModal(true);
                  setOpenSignUpModal(false);
                 }} tabIndex={-1}>
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;