import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";
import { Page, Text, View, Document, Font, PDFViewer, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';

import { BACKEND_ROUTE } from '../constants';

import styles from './PayslipExportStyles';

import './PayslipExport.scss';

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

const InfoRows = ({ id, label, state, displayDollarSign }) => (
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

const PDFInfo = ({ info, state }) => (
  <Fragment>
    <View style={left}>
      {Object.keys(info)
        .filter(key => key === 'topLeft' || key === 'bottomLeft')
        .map(key => {
          const rows = info[key];
          return (
            <View style={table} key={key}>
              {rows.map(row => <InfoRows key={row.id} state={state} {...row} />)}
            </View>
          )
        })}
    </View>
    <View style={right}>
      {Object.keys(info)
        .filter(key => key === 'topRight' || key === 'cpfContribution')
        .map(key => {
          const rows = info[key];
          return (
            <View style={table} key={key}>
              {rows.map(row => <InfoRows key={row.id} state={state} {...row} displayDollarSign={key === 'cpfContribution'} />)}
            </View>
          )
        })}
    </View>
  </Fragment>
);

const PDFBreakdown = ({ breakdown, state }) => (
  Object.keys(breakdown)
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
        
        {breakdown[key]
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

        {breakdown[key]
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

const PDFNett = ({ breakdown, state }) => {
  const { id, label } = breakdown['nett'][0]; // There's only one item in the "section"
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

const PDFFooter = ({ footer }) => (
  <View style={table}>
    <View style={tableRow}>
      {Object.keys(footer)
        .map(key => footer[key][0]) // There's only one item in each "section"
        .map(({ id, label }) => (
          <View style={footerCol} key={id}><View style={footerCell}>
            <Text>{label}</Text>
          </View></View>
        ))
      }
    </View>
  </View>
);

const PDF = ({ info, breakdown, footer, state }) => (
  <Document>
    <Page style={body}>
      <PDFHeader />

      <View style={container}>
        <PDFInfo info={info} state={state} />
        
        <View style={bottom}>
          <PDFBreakdown breakdown={breakdown} state={state} />
          <PDFNett breakdown={breakdown} state={state} />
          <PDFFooter footer={footer} />
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
        state: props.state,
      }),
    })
      .then(res => res.json())
      .then(({ res }) => {
        const sentStatus = !res.rejected.length && !!res.accepted.length;
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
          component = <p className="exportText">Error</p>;
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

const DownloadLink = ({ pdfFileName, ...props }) => {
  let component;

  return (
    <PDFDownloadLink document={<PDF {...props} />} fileName={pdfFileName}>
      {({ blob, url, loading, error }) => {
        component = loading ? <p className="exportText">Loading document...</p> : <button onClick={() => {}} className="exportButton">Download PDF</button>

        return <div className="exportContainer">{component}</div>;
      }}
    </PDFDownloadLink>
  );
};

const PayslipExport = props => {
  const { nameOfEmployee, salaryPeriod } = props.state;

  const pdfFileName = [nameOfEmployee, salaryPeriod].join('_').replace(' ', '-');

  return (
    <div style={{ width: '100%', height: '100%', padding: '1em' }}>
      <PDFViewer width="100%" height="85%"><PDF {...props} /></PDFViewer>
      {/* <DownloadLink pdfFileName={pdfFileName} {...props} /> */}
      <section style={{ width: '100%', height: '15%', paddingTop: '32px' }} id="nextSteps">
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
