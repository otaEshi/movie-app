import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Dropdown } from 'react-bootstrap';
import Modal from '@mui/material/Modal';
import SignInPage from '../auth/SignInPage';
import SignUpPage from '../auth/SignUpPage';

const Header = () => {
  const [Mobile, setMobile] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [openSignUpModal, setOpenSignUpModal] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  // const handleLogin = () => {
  //   setIsLogin(true);
  // }

  const handleLogout = () => {
    setIsLogin(false);
    window.location.reload();
    console.log('test logout')
  }

  const navigate = useNavigate();

  var isAuthenticated = false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'search') {
      setSearch(value);
    }

    // search while typing
    const handleSearch = () => {

    }
  };



  return (
    <header>
      <div className='container flexSB'>
        <nav className='flexSB custom-height mt-3'>
          <ul className={Mobile ? 'navMenu-list' : 'flexSB'} onClick={() => setMobile(false)}>
            <li>
              <a href='/'><i className="fa fa-home" aria-hidden="true"></i></a>
            </li>
            <li>
              <div className="dropdown">
                <div
                  className="d-flex align-items-center justify-content-center p-3 link-light text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{cursor:'pointer', borderBottom: '1px solid white' }}>
                  Thể loại
                </div>
                <ul className="dropdown-menu text-small dropdown-user custom-dropdown" style={{ border:'none', color:'white'}}>
                  <li>
                    <button
                      className="dropdown-item mb-3 mt-2"
                      style={{background:'none', border:'none', color:'white', paddingTop:'6px'}}
                    onClick={() => navigate('/tags/sports')}
                    >
                      Thể thao
                    </button>
                    <button
                      className="dropdown-item mb-3 mt-3"
                      onClick={() => navigate('/tags/musics')}
                    style={{background:'none', border:'none', color:'white'}}
                    >
                      Âm nhạc
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate('/tags/travels')}
                    style={{background:'none', border:'none', color:'white'}}
                    >
                      Du lịch
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <div className='ms-4' >
              <button className="ms-2 header-button" disabled><i className="fa fa-search custom-i" aria-hidden="true"></i></button>
              <input id='search' className="input-search" type="text" name="q" placeholder="  Tìm kiếm" autoComplete="off" onChange={(e) => handleInputChange(e)}></input>
            </div>
          </ul>
          {/* <button className='toggle' onClick={() => setMobile(!Mobile)}>
            {Mobile ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
          </button> */}
        </nav>
        <div className='account flexSB'>
          {isLogin ? (
            <Dropdown>
              <Dropdown.Toggle variant="dark" className='header-button'>
                {/* user's avatar or default avatar */}
                <i className='fas fa-user'></i>
                <span>{username}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className='dropdown-item' onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                <Dropdown.Item className='dropdown-item' href="#">function 2</Dropdown.Item>
                <Dropdown.Item className='dropdown-item' href="#">function 3</Dropdown.Item>
                <Dropdown.Item className='dropdown-item' href="#">function 4</Dropdown.Item>
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

      {/* Modals */}
      <Modal
        open={openSignInModal}
        onClose={() => setOpenSignInModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SignInPage setOpenSignUpModal={setOpenSignUpModal} setOpenSignInModal={setOpenSignInModal} isLoginOk={setIsLogin} setUsernameHeader={setUsername}/>
      </Modal>
      
      <Modal
        open={openSignUpModal}
        onClose={() => setOpenSignUpModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <SignUpPage setOpenSignUpModal={setOpenSignUpModal} setOpenSignInModal={setOpenSignInModal}/>
      </Modal>
    </header>
  );
};

export default Header;