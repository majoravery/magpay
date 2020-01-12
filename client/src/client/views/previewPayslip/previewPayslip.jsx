import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../atoms/header';
import './previewPayslip.scss';

class PreviewPayslip extends Component {
  constructor() {
    super();
    this.state = {
      pdfDisplayed: false,
    }
  }
  
  render() {
    return (
      <Fragment>
        <Header title="Preview payslip" />

        <div className="preview-payslip">
          <div className="preview-payslip-box">
            {/* NOTE: react-pdf does not support viewing PDF in mobile yet */}
            PDF HERE
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
