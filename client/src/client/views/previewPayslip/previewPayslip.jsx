import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../atoms/header';
import { FormContextConsumer } from '../../../context/formContext';

import { info, breakdown, footer } from '../../../form.v2.json';
import './previewPayslip.scss';

// NOTE: maybe add a note saying "not accurate representation" or something
const PDFPreview = () => {
  const COLUMN_LEFT = ['particulars', 'payment'];
  const COLUMN_RIGHT = ['duration', 'cpf'];

  const renderer = side => {
    return Object.keys(info)
      .filter(key => side.includes(key))
      .map(key => {
        const rows = info[key];
        const displayDollarSign = key === 'cpf';

        return (
          <table key={key}>
            <tbody>
              {rows.map(({ id, label }) => (
                <FormContextConsumer key={id}>
                  {({ [id]: value }) => (
                    <tr>
                      <td>{label}</td>
                      <td className={displayDollarSign ? 'monetary' : ''}>{value}</td>
                    </tr>
                  )}
                </FormContextConsumer>
              ))}
            </tbody>
          </table>
        );
      });
  };

  return (
    <div className="preview-wrap">
      <div className="container">
        <p className="companyName">Magbelle Hair Salon</p>
        <p className="address">
          18 Yishun Avenue 9<br />
          Junction Nine #02-49
          <br />
          Singapore 768897
        </p>
        <p className="salarySlip">Salary Slip</p>
      </div>
      <div className="containerInfo">
        <div className="left">{renderer(COLUMN_LEFT)}</div>
        <div className="right">{renderer(COLUMN_RIGHT)}</div>
      </div>
      <div className="containerBreakdown">
        {Object.keys(breakdown)
          .filter(key => key !== 'nett')
          .map(key => (
            <table key={`${key}-table`}>
              <tbody>
                <tr>
                  <th colSpan="2">{key}</th>
                </tr>

                {breakdown[key] // All input fields
                  .filter(row => row.type !== 'auto')
                  .map(({ id, label }) => (
                    <FormContextConsumer key={id}>
                      {({ [id]: value }) => (
                        <tr>
                          <td>{label}</td>
                          <td className="monetary">{value}</td>
                        </tr>
                      )}
                    </FormContextConsumer>
                  ))}

                {breakdown[key] // ReadOnly fields
                  .filter(row => row.type === 'auto')
                  .map(({ id, label }) => (
                    <FormContextConsumer key={id}>
                      {({ [id]: value }) => (
                        <tr className="readonly-row">
                          <td>{label}</td>
                          <td className="monetary">{value}</td>
                        </tr>
                      )}
                    </FormContextConsumer>
                  ))}
              </tbody>
            </table>
          ))}
      </div>
      <div className="containerFooter">
        <table>
          <tbody>
            <tr>
              {Object.values(footer).map(({ id, label }) => (
                <td key={id}>{label}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

class PreviewPayslip extends Component {
  constructor() {
    super();
    this.state = {
      pdfDisplayed: false,
    };
  }
  render() {
    return (
      <Fragment>
        <Header title="Preview payslip" />

        <div className="preview-payslip">
          <div className="preview-payslip-box">
            {/* NOTE: react-pdf does not support viewing PDF in mobile yet */}
            <PDFPreview />
          </div>

          <div className="preview-payslip-footer">
            <a href="/" className="button save-as-template-button disabled">
              Save as template
            </a>
            <Link to="/payslip/email" className="button email-payslip-button">
              Email PDF
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default PreviewPayslip;
