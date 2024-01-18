import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import { ISignUpPayload } from '../../types/auth';
import { signInRequest, signUpRequest, userInfoRequest } from './authApi';

interface ISignUpFormatProps {
  setOpenSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoginSuccess: () => void;
}

function SignUpPage(props: ISignUpFormatProps) {
  const [fullname, setfullname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // const [email, setEmail] = useState<string>('');
  // const [emailError, setEmailError] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullnameError, setfullnameError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [dateOfBirthError, setDateOfBirthError] = useState<string>('');
  const [isDeleteCharacter, setIsDeleteCharacter] = useState<boolean>(false);
  const [year, setYear] = useState<string>('')
  const [month, setMonth] = useState<string>('')
  const [day, setDay] = useState<string>('')

  // Checking
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(e.target.value)
  };


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
    // if (id === 'email') {
    //   setEmail(value);
    //   setEmailError('');
    // }
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
      setfullnameError('Không được để trống');
      return;
    }

    // if (email !== '' && !emailRegex.test(email)) {
    //   setEmailError('Email không hợp lệ');
    //   return;
    // }

    if (username === '') {
      setUsernameError('Không được để trống');
      return;
    }

    if (password === '') {
      setPasswordError('Không được để trống');
      return;
    }

    if (/\s/.test(password)) {
      setPasswordError('Mật khẩu không được chứa dấu cách');
      return;
    }
    if (confirmPassword === '') {
      setConfirmPasswordError('Không được để trống');
      return;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Mật khẩu phải giống nhau');
      return;
    }

    // Dispatch sign up request
    const payload: ISignUpPayload = {
      name: fullname,
      // email: email,
      username: username,
      password: password,
      date_of_birth: dateOfBirth,
    };

    dispatch<any>(signUpRequest(payload))
      .then(async (result: any) => {
        if (localStorage.getItem('error_sign_up')) {
          localStorage.removeItem('error_sign_up')
          return
        }
        await dispatch<any>(signInRequest(payload));
        if (result.meta.requestStatus === "fulfilled") {
          props.setOpenSignUpModal(false);
          props.handleLoginSuccess();
          return dispatch(userInfoRequest());
        } else {

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
            <h1 className="custom-signin-title mb-4">Đăng Ký</h1>
            <div>
              <input
                type="text"
                id="fullname"
                className="custom-input"
                value={fullname || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Họ và tên"
                autoComplete='off'
              />
            </div>
            <div className='custom-error-text-wrapper'>{fullnameError && <div className="text-danger small custom-error-text">{fullnameError}</div>}</div>
            {/* <div>
              <input
                type="mail"
                id="email"
                className="custom-input"
                value={email || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Email (tùy chọn)"
                autoComplete='off'
              />
            </div>
            <div className='custom-error-text-wrapper'>{emailError && <div className="text-danger small custom-error-text">{emailError}</div>}</div> */}
            <div className="mb-3">
              <label htmlFor="date" className="col-form-label">Ngày sinh</label>
              <input
                type="date"
                className="form-control custom-input"
                id="date"
                value={dateOfBirth}
                onChange={handleDateChange}
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid black' }}
              />
            </div>
            <div className='custom-error-text-wrapper'>{dateOfBirthError && <div className="text-danger small custom-error-text">{dateOfBirthError}</div>}</div>
            <div>
              <input
                type="text"
                id="username"
                className="custom-input"
                value={username || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Tên tài khoản"
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
                placeholder="Xác nhận mật khẩu"
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
                Đã có tài khoản? <span className='custom-nav-text' onClick={() => {
                  props.setOpenSignInModal(true);
                  props.setOpenSignUpModal(false);
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