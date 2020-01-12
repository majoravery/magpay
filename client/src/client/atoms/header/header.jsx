import React, { Fragment, useState } from 'react';
import { string, bool } from 'prop-types';
import { useHistory } from 'react-router-dom';

import { BACKEND_ROUTE } from './../../../constants';

import './header.scss';

const Header = props => {
  const { title, disableBackButton } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let history = useHistory();

  return (
    <Fragment>
      <article className="header-header">
        <div className="header-back-button">
          {!disableBackButton && <a className="go-back-button" onClick={() => history.goBack()}><span></span></a>}
        </div>
        <div className="header-title">{title}</div>
        <div className="header-menu-button">
          <button className="open-menu-button" onClick={() => setIsMenuOpen(true)}><span></span></button>
        </div>
      </article>
      <div className={`menu${!isMenuOpen ? ' hidden' : ''}`}>
        <button className="close-menu-button" onClick={() => setIsMenuOpen(false)}><span></span></button>
        <ul className="menu-items">
          <li className="menu-item disabled">Change language</li>
        </ul>
        <div className="logout-area">
          <a href={`${BACKEND_ROUTE}/logout`} className="logout">Logout</a>
        </div>
      </div>
    </Fragment>
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
