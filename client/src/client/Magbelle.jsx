import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import Cookies from 'js-cookie';

import PayslipFormInfo from './PayslipFormInfo';
import PayslipFormBreakdown from './PayslipFormBreakdown';
import PayslipExport from './PayslipExport';
import { BACKEND_ROUTE } from '../constants';

import './index.scss';

import { sections } from '../form.json';

const INFO = sections.info;
const BREAKDOWN = sections.breakdown;
const FOOTER = sections.footer;
const MODE_OF_PAYMENTS = INFO.bottomLeft.filter(row => row.id === 'modeOfPayment')[0].choices;

function PrivateRoute({ loggedIn, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !!loggedIn ? (
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
      }
    />
  );
}

class Magbelle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: !!Cookies.get('magbelle_logged_in'),
    };
    this.fields = {};
    
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

  renderHomepage() {
    const { loggedIn } = this.state;
    let component;

    const loginPromise = () => (
      Promise.resolve()
    )

    if (loggedIn) {
      component = (
        <Fragment>
          {/* <button className="button" onClick={() => {}}>Create pay slip from template</button> */}
          <Link to="/payslip/new/" className="button">Create new pay slip</Link>
        </Fragment>
      );
    } else {
      component = (<a href={`${BACKEND_ROUTE}/login`} className="button">Login</a>);
    }

    return (
      <div className="homepageContainer">
        <h2 style={{ marginTop: 0, fontSize: '1.7em', }}>Magbelle Hair Salon<br/>Pay Slip Creator</h2>
        {component}
      </div>
    );
  }

  renderPayslip() {
    return (
      <div id="main">
        <h1 className="title">Create new pay slip</h1>
        <PayslipFormInfo info={INFO} setField={this.setField} updateSubtotal={this.updateSubtotal} state={this.state} />
        <PayslipFormBreakdown breakdown={BREAKDOWN} setField={this.setField} updateSubtotal={this.updateSubtotal} state={this.state} />
        <section id="nextSteps">
          <div className="formButton">
            <Link to="/">Back</Link>
          </div>
          <div className="formButton" id="generatePdf">
            <Link to="/payslip/export">Generate PDF</Link>
          </div>
        </section>
      </div>
    );
  }

  renderExport() {
    return (
      <PayslipExport info={INFO} breakdown={BREAKDOWN} footer={FOOTER} state={this.outputForPdf} />
    );
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <Router>
        {/* Rendering homepage component here as children doesn't work - it appears on top of everything else, not sure why*/}
        <Route path="/" exact component={this.renderHomepage} />
        <PrivateRoute loggedIn={loggedIn} path="/payslip/new/">
          {this.renderPayslip()}
        </PrivateRoute>
        <PrivateRoute loggedIn={loggedIn} path="/payslip/export/">
          {this.renderExport()}
        </PrivateRoute>
      </Router>
    );
  }
}


export default Magbelle;
