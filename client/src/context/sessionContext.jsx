import React, { Component, createContext } from 'react';
import { node, string, number } from 'prop-types';
import cookie from 'js-cookie';

import { captureException } from '../captureException';
import { BACKEND_ROUTE, COOKIE_STATE_TRUE } from '../constants';

const defaultState = {
  userId: undefined,
  loggedIn: undefined,
};

const { Provider, Consumer } = createContext(defaultState);

class SessionContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
    }

    this.logUserOut = this.logUserOut.bind(this);
    this.logUserIn = this.logUserIn.bind(this);
  }

  componentDidMount() {
    this.setInitialData();
  }

  async setInitialData() {
    try {
      const { cookieLoggedInIdentifier } = this.props;

      const profile = await Promise.all([
        cookie.get(cookieLoggedInIdentifier) === COOKIE_STATE_TRUE ? this.fetchProfile() : undefined,
      ]);

      const userId = profile.id;

      this.setUserLoggedIn(userId);
      this.setState({ userId });
    } catch (error) {
      captureException(new Error(`SessionContext initial data set failed ${error}`));
    }
  }

  async fetchProfile() {
    // TODO: 
    // const { client } = this.props;

    // const profileData = await client.query({ query: FETCH_PROFILE, errorPolicy: IGNORE_ERROR_POLICY });
    // return get('data.profile', profileData);
    return { id: 'mabel' };
  }

  async setUserLoggedIn(userId) {
    const {
      cookieLoggedInIdentifier,
      cookieLoggedInExpireDays,
      cookieUserIdIdentifier,
      cookieUserIdExpireDays,
    } = this.props;
    if (userId) {
      cookie.set(cookieUserIdIdentifier, userId, { expires: cookieUserIdExpireDays });
      cookie.set(cookieLoggedInIdentifier, COOKIE_STATE_TRUE, { expires: cookieLoggedInExpireDays });
    } else {
      cookie.remove(cookieUserIdIdentifier);
      cookie.remove(cookieLoggedInIdentifier);
    }

    let loggedIn = false;
    fetch(`${BACKEND_ROUTE}/logincheck`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(({ success }) => {
        loggedIn = success;
        this.setState({ loggedIn });
      })
      .catch(console.error);
  }

  // NOTE: these arent being used!!! use it
  logUserIn(userId) {
    return new Promise(resolve => {
      this.setUserLoggedIn(userId);
      this.setState({ userId }, resolve);
    });
  }

  logUserOut() {
    return new Promise(resolve => {
      // Not sure why this isn't done in the same order as above
      this.setState(defaultState);
      this.setUserLoggedIn(undefined);
      resolve();
    });
  }

  render() {
    const { children } = this.props;
    const { userId, loggedIn } = this.state;
    const value = {
      userId,
      loggedIn,
      logUserOut: this.logUserOut,
      logUserIn: this.logUserIn,
    };
    return <Provider value={{ ...value }}>{children}</Provider>;
  }
}

SessionContextProvider.propTypes = {
  children: node.isRequired,
  cookieLoggedInIdentifier: string.isRequired,
  cookieLoggedInExpireDays: number.isRequired,
  cookieUserIdIdentifier: string.isRequired,
  cookieUserIdExpireDays: number.isRequired,
};

export { SessionContextProvider, Consumer as SessionContextConsumer };
