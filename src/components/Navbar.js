import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={'/'} className="nav-link active" aria-current="page">
                  <FaHome />
                  ホーム
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/createpost'} className="nav-link">
                  記事投稿
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/login'} className="nav-link">
                  ログイン
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
