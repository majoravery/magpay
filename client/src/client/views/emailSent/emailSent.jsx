import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Header from '../../atoms/header';

import './emailSent.scss';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EmailSent = props => {
  let query = useQuery();
  const recipient = query.get('recipient');

  return (
    <Fragment>
      <Header title="Email payslip" />
      <div className="email-sent">
        <div className="email-sent-text">
            <h2>Done!</h2>
            <p>Your email was sent to {recipient}.</p>
          </div>
        <div className="email-sent-actions">
          <Link to="/payslip/new/" className="button">Create another pay slip</Link>
          <Link to="/" className="button">Back to home page</Link>
        </div>
      </div>
    </Fragment>
  );
}

export default EmailSent;
