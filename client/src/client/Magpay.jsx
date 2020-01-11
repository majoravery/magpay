import React, { Fragment, useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './views/home';
import Splash from './views/splash';
import NewPayslip from './views/newPayslip';
import PreviewPayslip from './views/previewPayslip';
import EmailPayslip from './views/emailPayslip';
// import PrivateRoute from './atoms/privateRoute';
import { FormContextProvider } from '../context/formContext';
import { SessionContextConsumer } from '../context/sessionContext';

const PrivateRoute = ({ children, loggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return loggedIn
          ? children
          : (
              <Redirect
                to={{
                  pathname: "/", // Maybe add something here specifying that you're redirected bc you're not logged in
                  state: { from: location }
                }}
                push
              />
            );
        }}
    />
  );
      
};

const Magpay = () => {
  return (
    <FormContextProvider>
      <SessionContextConsumer>
      {({ loggedIn }) => {
        // NOTE: this might not work when users log out but that's not being implemented rn anyway
        if (loggedIn === undefined) {
          return false;
        }

        return (
          <Fragment>
            <Route path="/" exact component={Splash} />
            <PrivateRoute path="/home" loggedIn={loggedIn}><Home /></PrivateRoute>
            <PrivateRoute path="/payslip/new" loggedIn={loggedIn}><NewPayslip /></PrivateRoute>
            <PrivateRoute path="/payslip/preview" loggedIn={loggedIn}><PreviewPayslip /></PrivateRoute>
            <PrivateRoute path="/payslip/email" loggedIn={loggedIn}><EmailPayslip /></PrivateRoute>
          </Fragment>
        );
      }}
      </SessionContextConsumer>
    </FormContextProvider>
  );
}

export default Magpay;
