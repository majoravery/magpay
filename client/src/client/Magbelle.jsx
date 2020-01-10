import React, { Fragment, Component } from 'react';
import { Route, Redirect, Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import Home from './views/home';
import Splash from './views/splash';
import NewPayslip from './views/newPayslip';
import PreviewPayslip from './views/previewPayslip';
import EmailPayslip from './views/emailPayslip';
import PayslipExport from './PayslipExport';
import { SessionContextProvider } from '../context/sessionContext';

import {
  BACKEND_ROUTE,
  COOKIE_LOGGED_IN_IDENTIFIER,
  COOKIE_LOGGED_IN_EXPIRE_DAYS,
  COOKIE_USER_ID_IDENTIFIER,
  COOKIE_USER_ID_EXPIRE_DAYS,
} from '../constants';

import './index.scss';

import { sections } from '../form.json';

const INFO = sections.info;
const BREAKDOWN = sections.breakdown;
const FOOTER = sections.footer;
const MODE_OF_PAYMENTS = INFO.bottomLeft.filter(row => row.id === 'modeOfPayment')[0].choices;

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        isStillLoggedIn().then(console.log);
        // console.log(!!localStorage.getItem('loggedIn'));
        const loggedIn = true;
        return loggedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
              push
            />
          )
      }}
    />
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

async function isStillLoggedIn() {
  const loggedIn = await fetch(`${BACKEND_ROUTE}/authhealthcheck`)
    .then(res => res.status === 200 && res.status !== 401);
  return loggedIn;
}

class Magbelle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fields = {};
    this.accessToken = null;
    this.refreshToken = null;
    
    // there has to be a better way to do these two tbh
    // Initiailising state for all the output items
    [INFO, BREAKDOWN].map(section => (
      Object.keys(section)
        .map(key => section[key])
        .reduce((all, each) => (all.concat(each)), []) // Flatten array
        .filter(key => key.type === 'auto')
        .map(item => this.state[item.id] = item.initialValue ? item.initialValue : 0)
    ));

    // Initiailising this object for all input fields
    [INFO, BREAKDOWN].map(section => (
      Object.keys(section)
        .map(key => section[key])
        .reduce((all, each) => (all.concat(each)), []) // Flatten array
        .filter(key => key.type === 'number')
        .map(item => this.fields[item.id] = item.initialValue ? item.initialValue : parseFloat(0).toFixed(2))
    ));

    // Initiailising this object for all input fields
    [INFO, BREAKDOWN].map(section => (
      Object.keys(section)
        .map(key => section[key])
        .reduce((all, each) => (all.concat(each)), []) // Flatten array
        .filter(key => key.type !== 'number' && key.type !== 'auto')
        .map(item => this.fields[item.id] = item.initialValue ? item.initialValue : '')
    ));

    this.setField = this.setField.bind(this);
    this.updateSubtotal = this.updateSubtotal.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    this.renderMain = this.renderMain.bind(this);
    this.renderHomepage = this.renderHomepage.bind(this);
    this.renderPayslip = this.renderPayslip.bind(this);
    this.renderExport = this.renderExport.bind(this);
  }

  get outputForPdf() {
    let master = {
      ...this.state,
      ...this.fields,
    };
    master = {
      ...master,
      modeOfPayment: this.fields.modeOfPayment ? MODE_OF_PAYMENTS.filter(mode => mode.id === this.fields.modeOfPayment)[0].label : '',
    }

    return master;
  }

  setField(id, value) {
    this.fields[id] = value;
  }

  updateTotal() {
    const { earningsOutput, deductionsOutput, additionsOutput } = this.state;
    const total = parseFloat(earningsOutput) - parseFloat(deductionsOutput) + parseFloat(additionsOutput);
    this.setState({ nettPayment: parseFloat(total).toFixed(2) });
  }

  updateSubtotal(sectionId, updateTotal) {
    if (!sectionId) {
      return;
    }
    const outputKey = `${sectionId}Output`;
    const inputKeys = (BREAKDOWN[sectionId] || INFO[sectionId])
      .filter(row => row.type !== 'auto')
      .map(row => row.id);
    const inputSum = Object.keys(this.fields)
      .filter(item => inputKeys.includes(item))
      .reduce((sum, item) => parseFloat(sum) + parseFloat(this.fields[item]), 0);
    this.setState({ [outputKey]: parseFloat(inputSum).toFixed(2) }, updateTotal ? this.updateTotal : null);
  }

  renderMain() {
    const query = useQuery();
    const loggedInQuery = query.get('loginSuccess');
    const loggedInLocalStorage = localStorage.getItem('loggedIn');

    fetch(`${BACKEND_ROUTE}/authhealthcheck`)
      .then(console.log);

    if (!!loggedInQuery || !!loggedInLocalStorage) {
      localStorage.setItem('loggedIn', 1);
      return (
        <Redirect to={{ pathname: '/home/', state: { from: '/' } }} push />
      );
    }

    return (
      <div className="homepageContainer">
        <h2 style={{ marginTop: 0, fontSize: '1.7em', }}>Magbelle Hair Salon<br/>Pay Slip Creator</h2>
        <a href={`${BACKEND_ROUTE}/login`} className="button">Login</a>
      </div>
    );
  }
  
  renderHomepage() {
    return (
      <div className="homepageContainer">
        <h2 style={{ marginTop: 0, fontSize: '1.7em', }}>Magbelle Hair Salon<br/>Pay Slip Creator</h2>
        <Link to="/payslip/new/" className="button">Create new pay slip</Link>
      </div>
    );
  }

  renderPayslip() {
    return (
      <div id="main">
        <h1 className="title">New pay slip</h1>
        {/* <PayslipFormInfo info={INFO} setField={this.setField} updateSubtotal={this.updateSubtotal} state={this.state} />
        <PayslipFormBreakdown breakdown={BREAKDOWN} setField={this.setField} updateSubtotal={this.updateSubtotal} state={this.state} /> */}
        <section id="nextSteps">
          <div className="formButton">
            <Link to="/">Back</Link>
          </div>
          <div className="formButton" id="generatePdf">
            <Link to="/payslip/exportTest">Generate PDF</Link>
          </div>
        </section>
      </div>
    );
  }

  renderExport() {
    return (
      <PayslipExport info={INFO} breakdown={BREAKDOWN} footer={FOOTER} state={this.outputForPdf} accessToken={this.accessToken} />
    );
  }

  render() {
    return (
      <Fragment>
        {/* Rendering homepage component here as children doesn't work - it appears on top of everything else, not sure why*/}
        {/* <Route path="/" exact component={this.renderMain} /> */}
        <Route path="/home" exact component={Home} />
        <Route path="/splash" exact component={Splash} />
        <Route path="/newPayslip" exact>
          <NewPayslip />
        </Route>
        <Route path="/previewPayslip" exact component={PreviewPayslip} />
        <Route path="/emailPayslip" exact component={EmailPayslip} />
        {/* <PrivateRoute path="/home/">
          {this.renderHomepage()}
        </PrivateRoute>
        <PrivateRoute path="/payslip/new/">
          {this.renderPayslip()}
        </PrivateRoute>
        <PrivateRoute path="/payslip/export/">
          {this.renderExport()}
        </PrivateRoute>

        <Route path="/payslip/newTest/" component={this.renderPayslip} />
        <Route path="/payslip/exportTest/" component={this.renderExport} /> */}
      </Fragment>
    );
  }
}


export default Magbelle;
