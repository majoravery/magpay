import React from 'react';

import { BACKEND_ROUTE } from '../../../constants';

import './splash.scss';

const Splash = props => {
  return (
    <div className="splash">
      <div className="splash-actions">
        <h1 className="splash-title">
          Magbelle Hair Salon
          Pay Slip Creator
        </h1>
        <a href={`${BACKEND_ROUTE}/login`} className="button splash-button">Login</a>
      </div>
    </div>
  );
}

export default Splash;
