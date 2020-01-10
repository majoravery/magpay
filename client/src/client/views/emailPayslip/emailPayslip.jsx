import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer';

import Header from '../../atoms/header';
import { BACKEND_ROUTE } from '../../../constants';

import './emailPayslip.scss';

function blobToDataURL(blob, callback) {
  const a = new FileReader();
  a.onload = function(e) {
    callback(e.target.result);
  }
  a.readAsDataURL(blob);
}

const EmailPayslip = props => {
  // const { state, accessToken } = props;
  const [ready, setReady] = useState(false);
  const [dataUri, setDataUri] = useState(null);
  const [sentStatus, setSentStatus] = useState(null);

  function sendEmail() {
    setSentStatus(false);
    fetch(`${BACKEND_ROUTE}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        dataUri,
        // pdfFileName,
        // state,
        // accessToken,
      }),
    })
      .then(res => res.json())
      .then(({ res }) => {
        console.log({ res });
        const sentStatus = res && !res.rejected.length && !!res.accepted.length;
        setSentStatus(sentStatus);
      })
      .catch(console.error);
  }

  // const document = <PDF {...props} />;
  return (
    <Fragment>

      <BlobProvider document={null}>
        {({ blob, url, loading, error }) => {
          if (blob) {
            blobToDataURL(blob, setDataUri);
          }
          
          if (!error && !loading && (url || blob)) {
            setReady(true);
          }
        }}
      </BlobProvider>

      <Header title="Email payslip" />
      <div className="email-payslip">
        <div className="email-payslip-box">
        
          <div className="email-payslip-field">
            <label htmlFor="email-address">Recipient Address</label>
            <input id="email-address" name="email-address" type="text" defaultValue="vivianaverylim@gmail.com" />
          </div>

          <div className="email-payslip-field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" type="text" placeholder="Payslip for employee XYZ"/>
          </div>

          <div className="email-payslip-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" type="text" rows="8" placeholder="Type message here"></textarea>
          </div>

          <div className="email-payslip-attachment">
            <span></span>File attached:
            <p>[employee] payslip for [duration]</p>
          </div>

        </div>
        <div className="email-payslip-footer">
          <button onClick={sendEmail} className={`button send-email-button ${!ready && 'disabled'}`}>Send email</button>
        </div>
      </div>
    </Fragment>
  );
}

export default EmailPayslip;
