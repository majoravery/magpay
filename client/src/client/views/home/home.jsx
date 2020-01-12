import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../atoms/header';
import { BACKEND_ROUTE } from '../../../constants';
import './home.scss';

const name = 'Avery'; // TODO: change to name of logged in user

const Home = props => {
  return (
    <Fragment>
      <Header title="Home" disableBackButton={true} />
      <div className="home">
        <div className="home-prompt">
            <h2>Hi {name}!</h2>
            <p>What would you like to do?</p>
          </div>
        <div className="home-actions">
          <Link to="/payslip/new/" className="button">Create new pay slip</Link>
          <Link to="/" className="button disabled">Create pay slip from template</Link>
          <a href={`${BACKEND_ROUTE}/logout`} className="button">Logout</a>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
