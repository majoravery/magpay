import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../atoms/header';
import FormInfo from '../../atoms/formInfo';
import FormBreakdown from '../../atoms/formBreakdown';

import './newPayslip.scss';

const NewPayslip = props => {
  return (
    <Fragment>
      <Header title="New payslip" />

      <div className="new-payslip">
        <div className="new-payslip-form">
          <FormInfo />
          <FormBreakdown />
        </div>

        <div className="new-payslip-footer">
          <Link to="/payslip/preview" className="button continue-button">Continue</Link>
        </div>
      </div>
    </Fragment>
  );
}

export default NewPayslip;
