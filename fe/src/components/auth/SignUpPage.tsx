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

  function isValidDate(day: string, month: string, year: string) {
    // Create a new Date object using the components
    const dateObject = new Date(`${year}-${month}-${day}`);

    // Check if the components match the original input and are valid
    return (
      dateObject.getFullYear() === parseInt(year, 10) &&
      dateObject.getMonth() === parseInt(month, 10) - 1 &&
      dateObject.getDate() === parseInt(day, 10)
    );
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setIsDeleteCharacter(true);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'fullname') {
      setfullname(value);
      setfullnameError('');
    }

    if (id === 'day') {
      if (day.length < 2 || isDeleteCharacter) {
        setDay(value);
        setDateOfBirthError('');
        setIsDeleteCharacter(false);
      }
    }

    if (id === 'month') {
      if (month.length < 2 || isDeleteCharacter) {
        setMonth(value);
        setDateOfBirthError('');
        setIsDeleteCharacter(false);
      }
    }

    if (id === 'year') {
      if (year.length < 4 || isDeleteCharacter) {
        setYear(value);
        setDateOfBirthError('');
        setIsDeleteCharacter(false);
      }
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
    setDateOfBirth(year + '-' + month + '-' + day);
  };

  const handleSignUp = () => {
    // if (isValidDate(day, month, year)) {
    setDateOfBirth(year + '-' + month + '-' + day);
    // } else {
    // setDateOfBirthError('Ngày sinh không hợp lệ')
    // }

    if (fullname === '') {
      setfullnameError('Không được để trống');
      return;
    }

    if (day === '' || month === '' || year === '') {
      setDateOfBirthError('Không được để trống');
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
      email: "",
      username: username,
      password: password,
      date_of_birth: dateOfBirth,
    };

    dispatch<any>(signUpRequest(payload))
      .then(async (result: any) => {
        if (result.payload?.response?.request?.response) {
          const response = JSON.parse(result.payload.response.request.response);
          const errorMessage = response.detail;
          if (errorMessage === "User is existed") {
            setUsernameError('User Exists');
          }
        } else {
          const result = await dispatch<any>(signInRequest(payload));
          if (result.meta.requestStatus === "fulfilled") {
            props.setOpenSignUpModal(false);
            props.handleLoginSuccess();
            return dispatch(userInfoRequest());
          } else {

          }
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
            <div className='d-flex justify-content-between'>
              <input
                type="text"
                id="day"
                className="custom-DoB-input"
                value={day || ''}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleKeyDown}
                placeholder="Ngày"
                autoComplete='off'
                inputMode='numeric'
              />
              <input
                type="text"
                id="month"
                className="custom-DoB-input"
                value={month || ''}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleKeyDown}
                placeholder="Tháng"
                autoComplete='off'
                inputMode='numeric'
              />
              <input
                type="text"
                id="year"
                className="custom-DoB-input"
                value={year || ''}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleKeyDown}
                placeholder="Năm"
                autoComplete='off'
                inputMode='numeric'
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