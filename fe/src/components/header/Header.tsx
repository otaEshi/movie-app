import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Dropdown } from 'react-bootstrap';
import Modal from '@mui/material/Modal';
import SignInPage from '../auth/SignInPage';
import SignUpPage from '../auth/SignUpPage';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, setAvatarURL } from '../auth/authSlice';
import axios from 'axios';
import { userInfoRequest } from '../auth/authApi';
import { ISearchPayload } from '../../types/search';
import { searchRequest } from '../search/searchApi';

const Header = () => {
  // set to reduce sending redundance request
  // localStorage.setItem('is_first_time_home_page', 'true');

  const [Mobile, setMobile] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [openSignUpModal, setOpenSignUpModal] = useState<boolean>(false);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(true);

  const currentUser = useAppSelector(store => store.auth.currentUser)
  const isAuthenticatedString = localStorage.getItem('isAuthenticated');
  const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : false;
  const [username, setUsername] = useState<string>(currentUser.username);
  const [avatar_url, setAvatar_url] = useState<string>(currentUser.avatar_url);

  const isAdmin = useAppSelector(store => store.auth.currentUser.is_admin)
  const isContentAdmin = useAppSelector(store => store.auth.currentUser.is_content_admin)

  // console.log('hehe before ', useAppSelector(store => store.auth.currentUser.is_content_admin))
  // console.log('hehe',isAdmin)
  // console.log(isContentAdmin)

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const currentImage = useAppSelector(store => store.auth.currentUser.avatar_id);

  // useEffect(() => {
  //   setImage_id(currentImage);
  //   console.log("currentImage: " + currentImage);
  //   console.log("image_id: " + image_id);
  // },[isLoadedAvatar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'search') {
      setSearch(value);
      // setEmailError('');
    }

    // search while typing
    // const handleSearch = () => {

    // }
  };

  const handleSignOut = () => {
    dispatch(logout());
  }

  const fetchData = async () => {
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : false;
    if (isAuthenticated) {
      await dispatch(userInfoRequest());
    }
  };

  useLayoutEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  useLayoutEffect(() => {
    setUsername(currentUser.username);
    setAvatar_url(currentUser.avatar_url);
  })

  const handleLoginSuccess = () => {
    setIsFirstLogin(false);
  };

  const handleSearch = async () => {
  
    const payload : ISearchPayload = {
      search_string : search.trim()
    }
    await dispatch(searchRequest(payload))
    navigate('/search_result')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (search !== ''){
        handleSearch();
      }
    }
  };

  // useEffect(() => {
  //   setIsAuthenticated( useAppSelector(store => store.auth.isAuthenticated) );
  // },[useAppSelector(store => store.auth.isAuthenticated)]);  

  return (
    <header>
      <div className='container flexSB'>
        <nav className='flexSB custom-height mt-3'>
          <ul className={Mobile ? 'navMenu-list' : 'flexSB'} onClick={() => setMobile(false)}>
            <li>
              <div className='custom-header-btn' onClick={() => navigate('/')}><i className="fa fa-home" aria-hidden="true"></i></div>
            </li>
            <li>
              <div className="dropdown">
                <div
                  className="d-flex align-items-center justify-content-center p-3 link-light text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: 'pointer', borderBottom: '1px solid white' }}>
                  Thể loại
                </div>
                <ul className="dropdown-menu text-small dropdown-user custom-dropdown" style={{ border: 'none', color: 'white' }}>
                  <li>
                    <button
                      className="dropdown-item mb-3 mt-2"
                      style={{ background: 'none', border: 'none', color: 'white', paddingTop: '6px' }}
                      onClick={() => navigate('/tags/sports')}
                    >
                      Thể thao
                    </button>
                    <button
                      className="dropdown-item mb-3 mt-3"
                      onClick={() => navigate('/tags/musics')}
                      style={{ background: 'none', border: 'none', color: 'white' }}
                    >
                      Âm nhạc
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate('/tags/travels')}
                      style={{ background: 'none', border: 'none', color: 'white' }}
                    >
                      Du lịch
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <div className='ms-4' >
              <button className="ms-2 header-button" onClick={handleSearch}><i className="fa fa-search custom-i" aria-hidden="true"></i></button>
              <input id='search' onKeyDown={handleKeyPress} className="input-search" type="text" name="q" placeholder="  Tìm kiếm" autoComplete="off" onChange={(e) => handleInputChange(e)}></input>
            </div>
          </ul>
          {/* <button className='toggle' onClick={() => setMobile(!Mobile)}>
            {Mobile ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
          </button> */}
        </nav>
        <div className='account flexSB'>
          {isAuthenticated ? (
            <Dropdown>
              <Dropdown.Toggle variant="dark" className='header-button'>
                <div >
                  <img src={`${avatar_url}`} alt='' style={{ width: '40px', height: '40px', objectFit: 'cover' }}></img>
                  <div>{username}</div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className='dropdown-item' onClick={() => navigate('/profile')} >Trang cá nhân</Dropdown.Item>
                <Dropdown.Item className='dropdown-item' onClick={() => navigate('/movie_list')}>Danh sách cá nhân</Dropdown.Item>
                {(isAdmin || isContentAdmin) && (
                  <Dropdown.Item className='dropdown-item' onClick={() => navigate('/admin')}>
                    Quản lý
                  </Dropdown.Item>
                )}
                <Dropdown.Item className='dropdown-item' onClick={() => handleSignOut()}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <button className='header-button' onClick={() => {
              setOpenSignInModal(true);
            }}>
              <i className="fa fa-sign-in" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
      
      <Modal
        open={openSignInModal}
        onClose={() => setOpenSignInModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SignInPage
          setOpenSignUpModal={setOpenSignUpModal}
          setOpenSignInModal={setOpenSignInModal}
          handleLoginSuccess={handleLoginSuccess}
        />
      </Modal>

      <Modal
        open={openSignUpModal}
        onClose={() => setOpenSignUpModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <SignUpPage
          setOpenSignUpModal={setOpenSignUpModal}
          setOpenSignInModal={setOpenSignInModal}
          handleLoginSuccess={handleLoginSuccess}
        />
      </Modal>
    </header>
  );
};

export default Header;