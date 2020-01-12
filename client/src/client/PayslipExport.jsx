import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";
import { Page, Text, View, Document, Font, PDFViewer, BlobProvider } from '@react-pdf/renderer';

import { BACKEND_ROUTE } from '../constants';

import styles from './PayslipExportStyles';

import { sections } from './../form.json';

const INFO = sections.info;
const BREAKDOWN = sections.breakdown;
const FOOTER = sections.footer;

const state = {
  additions: null,
  advanceLoan: null,
  basicPay: null,
  bonus: null,
  breakdown: null,
  commission: null,
  cpf: null,
  dateOfPayment: null,
  deductions: null,
  earnings: null,
  employeeCpf: null,
  employerCpf: null,
  icNo: null,
  incomeTax: null,
  modeOfPayment: null,
  nameOfEmployee: null,
  nameOfEmployer: null,
  nettPayment: 0,
  overtimeHours: null,
  overtimePay: null,
  ratePerHour: null,
  reimbursement: null,
  salaryPeriod: null,
};

const {
  infoLabelCol,
  infoInputCol,
  body,
  headerContainer,
  companyName,
  addressContainer,
  address,
  salarySlip,
  container,
  left,
  right,
  bottom,
  breakdownHeaderCol,
  breakdownHeaderCell,
  breakdownInputLabelCol,
  breakdownInputLabelCell,
  breakdownInputCol,
  breakdownInputCell,
  breakdownOutputLabelCol,
  breakdownOutputLabelCell,
  breakdownOutputCol,
  breakdownOutputCell,
  infoLabelColNett,
  infoLabelCell,
  infoInputColNett,
  infoInputCell,
  table,
  tableRow,
  footerCol,
  footerCell,
  dollarSign,
  numericValue,
  stringValue,
} = styles.styles; // NOTE: still a bit confused about this tbh

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const InfoRows = ({ id, label, displayDollarSign }) => (
  <View style={tableRow} key={id}>
    <View style={infoLabelCol}>
      <View style={infoLabelCell}>
        <Text>{label}</Text>
      </View>
    </View>
    <View style={infoInputCol}>
      <View style={infoInputCell}>
        {displayDollarSign
          ? <Fragment><Text style={dollarSign}>$</Text><Text style={numericValue}>{state[id]}</Text></Fragment>
          : <Text style={stringValue}>{state[id]}</Text>}
      </View>
    </View>
  </View>
);

const PDFHeader = () => (
  <View style={headerContainer}>
    <Text style={companyName}>Magbelle Hair Salon</Text>
    <View style={addressContainer}>
      <Text style={address}>18 Yishun Avenue 9</Text>
      <Text style={address}>Junction Nine #02-49</Text>
      <Text style={address}>Singapore 768897</Text>
    </View>
    <Text style={salarySlip}>Salary Slip</Text>
  </View>
);

const PDFInfo = () => (
  <Fragment>
    <View style={left}>
      {Object.keys(INFO)
        .filter(key => key === 'topLeft' || key === 'bottomLeft')
        .map(key => {
          const rows = INFO[key];
          return (
            <View style={table} key={key}>
              {rows.map(row => <InfoRows key={row.id} state={state} {...row} />)}
            </View>
          )
        })}
    </View>
    <View style={right}>
      {Object.keys(INFO)
        .filter(key => key === 'topRight' || key === 'cpfContribution')
        .map(key => {
          const rows = INFO[key];
          return (
            <View style={table} key={key}>
              {rows.map(row => <InfoRows key={row.id} state={state} {...row} displayDollarSign={key === 'cpfContribution'} />)}
            </View>
          )
        })}
    </View>
  </Fragment>
);

const PDFBreakdown = () => (
  Object.keys(BREAKDOWN)
    .filter(key => key !== 'nett')
    .map(key => (
      <View style={table} key={`${key}-table`}>
        <View style={tableRow}>
          <View style={breakdownHeaderCol}>
            <View style={breakdownHeaderCell}>
              {/* Unfort react-pdf StyleSheet does not support text-transform: capitalize */}
              <Text>{key.charAt(0).toUpperCase()}{key.substr(1)}</Text>
            </View>
          </View>
        </View>
        
        {BREAKDOWN[key]
          .filter(row => row.type !== 'auto')
          .map(({ id, label }) => (
            <View style={tableRow} key={id}>
              <View style={breakdownInputLabelCol}>
                <View style={breakdownInputLabelCell}>
                  <Text>{label}</Text>
                </View>
              </View>
              <View style={breakdownInputCol}>
                <View style={breakdownInputCell}>
                  <Text style={dollarSign}>$</Text><Text style={numericValue}>{state[id]}</Text>
                </View>
              </View>
            </View>
          ))}

        {BREAKDOWN[key]
          .filter(row => row.type === 'auto')
          .map(({ id, label }) => (
            <View style={tableRow} key={id}>
              <View style={breakdownOutputLabelCol}>
                <View style={breakdownOutputLabelCell}>
                  <Text>{label}</Text>
                </View>
              </View>
              <View style={breakdownOutputCol}>
                <View style={breakdownOutputCell}>
                  <Text style={dollarSign}>$</Text><Text style={numericValue}>{state[id]}</Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    ))
);

const PDFNett = () => {
  const { id, label } = BREAKDOWN['nett'][0]; // There's only one item in the "section"
  return (
    <View style={table}>
      <View style={tableRow} key={id}>
        <View style={infoLabelColNett}><View style={infoLabelCell}>
          <Text>{label}</Text>
        </View></View>
        <View style={infoInputColNett}><View style={infoInputCell}>
          <Text style={dollarSign}>$</Text><Text style={numericValue}>{state[id]}</Text>
        </View></View>
      </View>
    </View>
  );
};

const PDFFooter = () => (
  <View style={table}>
    <View style={tableRow}>
      {Object.keys(FOOTER)
        .map(key => FOOTER[key][0]) // There's only one item in each "section"
        .map(({ id, label }) => (
          <View style={footerCol} key={id}><View style={footerCell}>
            <Text>{label}</Text>
          </View></View>
        ))
      }
    </View>
  </View>
);

const PDF = () => (
  <Document>
    <Page style={body}>
      <PDFHeader />

      <View style={container}>
        <PDFInfo INFO={INFO} state={state} />
        
        <View style={bottom}>
          <PDFBreakdown BREAKDOWN={BREAKDOWN} state={state} />
          <PDFNett BREAKDOWN={BREAKDOWN} state={state} />
          <PDFFooter FOOTER={FOOTER} />
        </View>
      </View>
    </Page>
  </Document>
);

function blobToDataURL(blob, callback) {
  const a = new FileReader();
  a.onload = function(e) {
    callback(e.target.result);
  }
  a.readAsDataURL(blob);
}

const EmailLink = ({ pdfFileName, ...props }) => {
  const { state, accessToken } = props;
  const [dataUri, setDataUri] = useState(null);
  const [sentStatus, setSentStatus] = useState(null);
  let component;
  let buttonText;

  const sendEmail = () => {
    setSentStatus(false);
    fetch(`${BACKEND_ROUTE}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        dataUri,
        pdfFileName,
        state,
        accessToken,
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

  return (
    <BlobProvider document={<PDF {...props} />}>
      {({ blob, url, loading, error }) => {
        console.log({ blob, url, loading, error });

        if (blob) {
          blobToDataURL(blob, setDataUri);
        }
        
        if (error || (!loading && !url)) {
          component = <p className="exportButton">Error</p>;
        } else if (!error && !loading && url) {

          if (sentStatus === null) {
            buttonText = 'Email PDF';
          } else {
            buttonText = sentStatus ? 'Sent!' : 'Sending...';
          }

          component = (
            <button onClick={sendEmail} className="exportButton">{buttonText}</button>
          );
        } else {
          component = <p className="exportText">Loading</p>;
        }

        return component;
      }}
    </BlobProvider>
  );
}

const PayslipExport = props => {
  let nameOfEmployee = 'Name of Employee';
  let salaryPeriod = 'Salary Period';
  // const { nameOfEmployee, salaryPeriod } = props.state;

  const pdfFileName = [nameOfEmployee, salaryPeriod].join('_').replace(' ', '-');

  return (
    <div id="main">
      <h1 className="title">View PDF</h1>
      <div style={{ height: '75%', width: '100%' }}>
        <PDFViewer width="100%" height="100%"><PDF {...props} /></PDFViewer>
      </div>
      <section style={{ paddingTop: '32px' }} id="nextSteps">
        <div className="formButton">
          <Link to="/payslip/new">Back</Link>
        </div>
        <div className="formButton">
          <EmailLink pdfFileName={pdfFileName} {...props} />
        </div>
      </section>
    </div>
  );
};

export default PayslipExport;
