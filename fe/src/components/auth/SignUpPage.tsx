import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import { ISignUpPayload } from '../../types/auth';
import { signUpRequest } from './authApi';

function SignUpPage({setOpenSignInModal, setOpenSignUpModal}:any) {
  const [fullname, setfullname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullnameError, setfullnameError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Checking
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/;
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      setUsernameError('');
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
      setfullnameError('Không được bỏ trống.');
      return;
    }
    if (username === '') {
      setUsernameError('Không được bỏ trống.');
      return;
    }
    if (/\s/.test(username)) {
      setUsernameError('Tài khoản không được chứa dấu cách.');
      return;
    }
    // if (!usernameRegex.test(username)) {
    //   setusernameError('Please enter a valid username address.');
    //   return;
    // }
    if (password === '') {
      setPasswordError('Không được bỏ trống.');
      return;
    }
    // if (!passwordRegex.test(password)) {
    //   setPasswordError('Password must contain: 8-64 characters, 1 uppercase letter, 1 lowercase letter, 1 number.')
    //   return;
    // }
    if (/\s/.test(password)) {
      setPasswordError('Tài khoản không được chứa dấu cách.');
      return;
    }
    if (confirmPassword === '') {
      setConfirmPasswordError('Không được bỏ trống.');
      return;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Mật khẩu phải giống nhau.');
      return;
    }

    // Dispatch sign up request
    const payload: ISignUpPayload = {
      name: fullname,
      email: '',
      username: username,
      password: password,
      day_of_birth: 0,
      month_of_birth: 0,
      year_of_birth: 0,
    };
    dispatch<any>(signUpRequest(payload))
      .then((result: any) => {
        if (result.type === 'api/sign-up/rejected') {
            setUsernameError('Tài khoản đã tồn tại');

        } else if (result.type  === 'api/sign-up/fulfilled') {
          setOpenSignUpModal(false);

        }
      });
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
            <h1 className="custom-signin-title mb-4">Đăng ký</h1>
            <div>
              <input
                type="text"
                id="fullname"
                className="custom-input"
                value={fullname || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Họ Tên"
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
                placeholder="Tài khoản"
                autoComplete='off'
              />
            </div>
            <div className='custom-error-text-wrapper'>{usernameError && <div className="text-danger small custom-error-text">{usernameError}</div>}</div>
            <div>
              <input
                className="custom-input"
                type="password"
                id="password"
                value={password || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Mật khẩu"
                autoComplete='off'
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
                autoComplete='off'
              />
            </div>
            <div className='custom-error-text-wrapper'>
              {confirmPasswordError && <div className="text-danger small custom-error-text">{confirmPasswordError}</div>}
            </div>
            <div className="mb-2 mt-3">
              <button className="custom-btn" onClick={handleSignUp} tabIndex={-1}>
                ĐĂNG KÝ
              </button>
            </div>
            <div>
              <p>
                {/* Already have an account? <Link to='/sign_in' className='custom-nav-text' tabIndex={-1}>
                  Sign in
                </Link> */}
                Đã có tài khoản? <span className='custom-text-link' onClick={() => { 
                  setOpenSignInModal(true);
                  setOpenSignUpModal(false);
                 }} tabIndex={-1}>
                  Đăng nhập
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