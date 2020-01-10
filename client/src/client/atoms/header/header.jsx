import React from 'react';
import { string, bool } from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

import './header.scss';

const Header = props => {
  const { title, disableBackButton } = props;
  let history = useHistory();

  return (
    <article className="header-header">
      <div className="header-back-button">
        {!disableBackButton && <a className="go-back-button" onClick={() => history.goBack()}><span></span></a>}
      </div>
      <div className="header-title">{title}</div>
      <div className="header-home-button">
        <Link to="/home" className="go-home-button"><span></span></Link>
      </div>
    </article>
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
