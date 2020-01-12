import React, { useEffect } from 'react';

import { BACKEND_ROUTE } from '../../../constants';

import './splash.scss';

const splashColours = [
  ['#cc2200', '#03698f'], // burgundy and teal
  ['#372772', '#2E0F15'], // violet and dark maroon
  ['#618bff', '#fbff00'], // electric blue and yellow
  ['#09814A', '#ff8c00'], // green and orange
];

const Splash = props => {
  let root = document.documentElement;

  useEffect(() => {
    const [primary, secondary, title] = splashColours[Math.floor(Math.random() * splashColours.length)];
    root.style.setProperty('--splash-primary-colour', primary);
    root.style.setProperty('--splash-secondary-colour', secondary);
  }, []);

  return (
    <div className="splash">
      <div className="splash-bgs">
        <div className="splash-bg bg-one"></div>
        <div className="splash-bg bg-two"></div>
        <div className="splash-bg bg-three"></div>
      </div>
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
