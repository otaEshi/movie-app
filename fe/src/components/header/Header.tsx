import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Dropdown } from 'react-bootstrap';

const Header = () => {
  const [Mobile, setMobile] = useState(false);
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate();

  var isAuthenticated = false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'search') {
      setSearch(value);
      // setEmailError('');
    }
  };

  const handleSearch = () => {

  }

  return (
    <header>
      <div className='container flexSB'>
        <nav className='flexSB custom-height mt-3'>
          <div className='logo'>
            [logo here]
            {/* <img src='./images/logo.png' alt='' /> */}
          </div>
          <ul className={Mobile ? 'navMenu-list' : 'flexSB'} onClick={() => setMobile(false)}>
            <li>
              <a href='/'><i className="fa fa-home" aria-hidden="true"></i></a>
            </li>
            <li>
              <a href='/'>Series</a>
            </li>
            <li>
              <a href='/'>Tags</a>
            </li>
            <button className="ms-2 header-button" onClick={() => handleSearch}><i className="fa fa-search custom-i" aria-hidden="true"></i></button>
            <input id='search' className="input-search" type="text" name="q" placeholder="Search" autoComplete="off" onChange={(e) => handleInputChange(e)}></input>
          </ul>
          <button className='toggle' onClick={() => setMobile(!Mobile)}>
            {Mobile ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
          </button>
        </nav>
        <div className='account flexSB'>
          {isAuthenticated ? (
            <Dropdown>
              <Dropdown.Toggle variant="dark" className='header-button'>
                {/* user's avatar or default avatar */}
                <i className='fas fa-user'></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className='dropdown-item' href="#">function 1</Dropdown.Item>
                <Dropdown.Item className='dropdown-item' href="#">function 2</Dropdown.Item>
                <Dropdown.Item className='dropdown-item' href="#">function 3</Dropdown.Item>
                <Dropdown.Item className='dropdown-item' href="#">function 4</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <button className='header-button' onClick={() => {navigate('/sign_in')}}>
              <i className="fa fa-sign-in" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;