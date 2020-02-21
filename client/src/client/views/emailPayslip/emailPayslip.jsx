import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { Font, Document, Page, StyleSheet, BlobProvider } from '@react-pdf/renderer';

import Header from '../../atoms/header';
import PDFHeader from '../../atoms/pdfHeader';
import PDFInfo from '../../atoms/pdfInfo';
import PDFBreakdown from '../../atoms/pdfBreakdown';
import PDFFooter from '../../atoms/pdfFooter';
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

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const page = StyleSheet.create({
  padding: "50px 45px",
});

const PDF = props => {
  return (
  <Document>
    <Page style={page}>
      <PDFHeader />
      <PDFInfo {...props} />
      <PDFBreakdown {...props} />
      <PDFFooter />
    </Page>
  </Document>
)};

const EmailPayslip = props => {
  const [ready, setReady] = useState(false);
  const [dataUri, setDataUri] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [recipient, setRecipient] = useState('vivianaverylim@gmail.com');
  const [subject, setSubject] = useState('New pay slip from Magpay');
  const [message, setMessage] = useState('');

  const recipientInputRef = useRef(null);
  const subjectInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const handleRecipientInput = e => setRecipient(e.target.value);
  const handleSubjectInput = e => setSubject(e.target.value);
  const handleMessageInput = e => setMessage(e.target.value);

  useEffect(() => {
    fetch(`${BACKEND_ROUTE}/user`)
      .then(res => res.json())
      .then(res => setRecipient(res.email));
  }, [])

  function sendEmail() {
    setIsSending(true);
    fetch(`${BACKEND_ROUTE}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        dataUri,
        recipient,
        subject,
        message,
      }),
    })
      .then(res => res.json())
      .then(({ success, message }) => {
        if (!success) {
          console.error(`Error: ${message}`);
        }
        setIsSending(false);
        setSent(success);
      })
      .catch(console.error);
  }

  if (sent) {
    return (<Redirect to={`/payslip/sent?recipient=${recipient}`} />);
  }

  return (
    <FormContextConsumer>
      {(props) => {
        const { nameOfEmployee, salaryPeriod } = props;
        const isButtonDisabled = !ready || !!isSending;
        const name = nameOfEmployee ? nameOfEmployee : `[employee name]`;

        return (
          <Fragment>
            {!ready && <BlobProvider document={<PDF {...props} />}>
              {({ blob, url, loading, error }) => {
                if (blob) {
                  blobToDataURL(blob, setDataUri);
                }
                if (!error && !loading && (url || blob)) {
                  setReady(true);
                }

                return null; // Important: component needs to return something (at least a null)
              }}
            </BlobProvider>}
            
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
                  <p>Payslip for {name} - {salaryPeriod ? salaryPeriod : `[salary period]`}</p>
                </div>

              </div>
              <div className="email-payslip-footer">
                <button onClick={sendEmail} className={`button send-email-button ${isButtonDisabled && 'disabled'}`} disabled={isButtonDisabled}>
                  {isSending ? (<span className="spinner">&nbsp;</span>) : 'Send email' }
                </button>
              </div>
            </div>
          </Fragment>
        );
      }}
    </FormContextConsumer>
  );
}

export default EmailPayslip;
