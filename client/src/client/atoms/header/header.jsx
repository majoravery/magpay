import React, { Fragment, useState } from 'react';
import { string, bool } from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

import { SessionContextConsumer } from '../../../context/sessionContext';
import { BACKEND_ROUTE } from './../../../constants';

import './header.scss';

const Header = props => {
  const { title, disableBackButton } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let history = useHistory();

  return (
    <SessionContextConsumer>
      {({ loggedIn }) => (
        <Fragment>
          <article className="header-header">
            <div className="header-back-button">
              {!disableBackButton && <button className="go-back-button" onClick={() => history.goBack()}><span></span></button>}
            </div>
            <div className="header-title">{title}</div>
            <div className="header-menu-button">
              <button className="open-menu-button" onClick={() => setIsMenuOpen(true)}><span></span></button>
            </div>
          </article>
          <div className={`menu${!isMenuOpen ? ' hidden' : ''}`}>
            <button className="close-menu-button" onClick={() => setIsMenuOpen(false)}><span></span></button>
            <ul className="menu-items">
              <li className="menu-item"><Link to='/home'>Home</Link></li>
              <li className="menu-item"><Link to='/privacy'>Privacy policy</Link></li>
              <hr className="menu-separator"></hr>
              <li className="menu-item disabled">Change language</li>
            </ul>
            {loggedIn && <div className="logout-area">
              <a href={`${BACKEND_ROUTE}/logout`} className="logout">Logout</a>
            </div>}
          </div>
        </Fragment>
      )}
    </SessionContextConsumer>    
  );
}

Header.propTypes = {
  title: string.isRequired,
  backButton: bool,
}

Header.defaultProps = {
  backButton: false,
}

export default Header;
