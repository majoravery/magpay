import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Magpay from './Magpay';
import { SessionContextProvider } from '../context/sessionContext';

import {
  COOKIE_LOGGED_IN_IDENTIFIER,
  COOKIE_LOGGED_IN_EXPIRE_DAYS,
  COOKIE_USER_ID_IDENTIFIER,
  COOKIE_USER_ID_EXPIRE_DAYS,
} from '../constants';

const RootContainer = () => {
  const session = {
    cookieLoggedInIdentifier: COOKIE_LOGGED_IN_IDENTIFIER,
    cookieLoggedInExpireDays: COOKIE_LOGGED_IN_EXPIRE_DAYS,
    cookieUserIdIdentifier: COOKIE_USER_ID_IDENTIFIER,
    cookieUserIdExpireDays: COOKIE_USER_ID_EXPIRE_DAYS,
  };

  return (
    <SessionContextProvider {...session}>
      <BrowserRouter>
        <Magpay />
      </BrowserRouter>
    </SessionContextProvider>
  );
};

export default RootContainer;
