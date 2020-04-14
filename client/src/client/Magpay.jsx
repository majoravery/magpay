import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './views/home';
import Splash from './views/splash';
import NewPayslip from './views/newPayslip';
import PreviewPayslip from './views/previewPayslip';
import EmailPayslip from './views/emailPayslip';
import EmailSent from './views/emailSent';
import PrivacyPolicy from './views/privacyPolicy';
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
  // NOTE: i think i need switch in here??? idk why i dont have it, it didnt work without switch for socks3
  return (
    <FormContextProvider>
      <SessionContextConsumer>
      {({ loggedIn }) => {
        // FIXME: without these, the app will stay on the splash page forever
        // NOTE: this might not work when users log out but that's not being implemented rn anyway
        if (loggedIn === undefined) {
          return false;
        }
        return (
          <Fragment>
            <Route path="/" exact component={Splash} />
            <PrivateRoute path="/home" loggedIn={loggedIn}><Home /></PrivateRoute>
            {/* FIXME: these dont redirect back to / */}
            <PrivateRoute path="/payslip/new" loggedIn={loggedIn}><NewPayslip /></PrivateRoute>
            <PrivateRoute path="/payslip/preview" loggedIn={loggedIn}><PreviewPayslip /></PrivateRoute>
            <PrivateRoute path="/payslip/email" loggedIn={loggedIn}><EmailPayslip /></PrivateRoute>
            <PrivateRoute path="/payslip/sent" loggedIn={loggedIn}><EmailSent /></PrivateRoute>
            {/* FIXME: this page displays LOG OUT button */}
            <Route path="/privacy" component={PrivacyPolicy} />
          </Fragment>
        );
      }}
      </SessionContextConsumer>
    </FormContextProvider>
  );
}

export default Magpay;
