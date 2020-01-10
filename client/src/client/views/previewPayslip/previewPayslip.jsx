import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { Font, PDFViewer, Document, Page, StyleSheet /*, PDFDownloadLink, BlobProvider */ } from '@react-pdf/renderer';

import Header from '../../atoms/header';
import PDFHeader from '../../atoms/pdfHeader';
import PDFInfo from '../../atoms/pdfInfo';
import PDFBreakdown from '../../atoms/pdfBreakdown';
import PDFFooter from '../../atoms/pdfFooter';

import './previewPayslip.scss';

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const page = StyleSheet.create({
  padding: "50px 45px",
});

class PreviewPayslip extends Component {
  constructor() {
    super();
    this.state = {
      pdfReady: false,
      pdfDisplayed: false,
    }
  }

  componentDidMount() {
    // temporary test
    setTimeout(() => {
      this.setState({ pdfReady: true });
    }, 2000);
  }

  // Fix for stream.push() after EOF bugs in react-pdf
  shouldComponentUpdate(_, nextState) {
    const { pdfDisplayed } = this.state;
    const { pdfReady } = nextState;
    
    console.log('-----');
    console.log(this.state);
    console.log(nextState);
    if (pdfReady && !pdfDisplayed) {
      console.log('updating');
      this.setState({ pdfDisplayed: true });
      return true;
    } else {
      return false;
    }
  }
  
  render() {
    // console.log(this.state);
    return (
      <Fragment>
        <Header title="Preview payslip" />

        <div className="preview-payslip">
          <div className="preview-payslip-box">
            <PDFViewer width="100%" height="100%">
              <Document>
                <Page style={page}>
                  <PDFHeader />
                  <PDFInfo />
                  <PDFBreakdown />
                  <PDFFooter />
                </Page>
              </Document>
            </PDFViewer>
          </div>

          <div className="preview-payslip-footer">
            <a href="/" className="button save-as-template-button disabled">Save as template</a>
            <Link to="/payslip/email" className="button email-payslip-button">Email PDF</Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default PreviewPayslip;
