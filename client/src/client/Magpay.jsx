import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './views/home';
import Splash from './views/splash';
import NewPayslip from './views/newPayslip';
import PreviewPayslip from './views/previewPayslip';
import EmailPayslip from './views/emailPayslip';
import { FormContextProvider } from '../context/formContext';
import { SessionContextConsumer } from '../context/sessionContext';

let authed = true; // FIXME: set this to false when going live and auth is implemented

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return authed
        ? children
        : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
              push
            />
          );
      }}
    />
  );
}

const Magpay = () => {
  return (
    <FormContextProvider>
      <SessionContextConsumer>
        {({ userId }) => {
          if (userId) {
            authed = true;
          }
          
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
