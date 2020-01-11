import React, { Fragment, useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './views/home';
import Splash from './views/splash';
import NewPayslip from './views/newPayslip';
import PreviewPayslip from './views/previewPayslip';
import EmailPayslip from './views/emailPayslip';
import { FormContextProvider } from '../context/formContext';

import { BACKEND_ROUTE } from '../constants';

const Magpay = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) => {
          console.log({ loggedIn });
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
  }

  return (
    <FormContextProvider>
      <SessionContextConsumer>
        {({ hey }) => {
          return (
            <Fragment>
              <Route path="/" exact component={Splash} />
              <PrivateRoute path="/home"><Home /></PrivateRoute>
              <PrivateRoute path="/payslip/new"><NewPayslip /></PrivateRoute>
              <PrivateRoute path="/payslip/preview"><PreviewPayslip /></PrivateRoute>
              <PrivateRoute path="/payslip/email"><EmailPayslip /></PrivateRoute>
            </Fragment>
          );
        }}
      </SessionContextConsumer>
    </FormContextProvider>
  );
}

export default Magpay;
