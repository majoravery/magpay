import React, { Fragment, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer';

import Header from '../../atoms/header';
import { FormContextConsumer } from '../../../context/formContext';
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

  const [recipient, setRecipient] = useState('vivianaverylim@gmail.com');
  const [subject, setSubject] = useState('Payslip for employee XYZ');
  const [message, setMessage] = useState(null);

  const recipientInputRef = useRef(null);
  const subjectInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const handleRecipientInput = e => setRecipient(e.target.value);
  const handleSubjectInput = e => setSubject(e.target.value);
  const handleMessageInput = e => setMessage(e.target.value);

  function sendEmail() {
    setSentStatus(false);
    fetch(`${BACKEND_ROUTE}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        dataUri,
        subject,

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
    <FormContextConsumer>
      {({ nameOfEmployee, salaryPeriod }) => (
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
                <label htmlFor="recipient">Recipient Address</label>
                <input id="recipient" name="recipient" type="text" value={recipient} ref={recipientInputRef} onChange={handleRecipientInput} />
              </div>

              <div className="email-payslip-field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" value={subject} ref={subjectInputRef} onChange={handleSubjectInput} />
              </div>

              <div className="email-payslip-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" type="text" rows="8" placeholder="Type message here" value={message} ref={messageInputRef} onChange={handleMessageInput} ></textarea>
              </div>

              <div className="email-payslip-attachment">
                <span></span>File attached:
                <p>Payslip for {nameOfEmployee ? nameOfEmployee : `[employee name]`} - {salaryPeriod ? salaryPeriod : `[salary period]`}</p>
              </div>

            </div>
            <div className="email-payslip-footer">
              <button onClick={sendEmail} className={`button send-email-button ${!ready && 'disabled'}`}>Send email</button>
            </div>
          </div>
        </Fragment>
      )}
    </FormContextConsumer>
  );
}

export default EmailPayslip;
