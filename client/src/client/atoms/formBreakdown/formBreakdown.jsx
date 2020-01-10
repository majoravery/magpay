import React, { Fragment } from 'react';

import rowRenderer from '../row';

import { breakdown } from '../../../form.v2.json';

import './formBreakdown.scss';

const { earnings, deductions, additions, nett } = breakdown;

const FormBreakdown = () => {
  const fields = { earnings, deductions, additions };
  return (
    <Fragment>
      {Object.keys(fields).map(key => {
        return (
          <section key={key} id={key} className="form-breakdown">
            <div className="form-section-header">{key}</div>
            {fields[key].map(rowRenderer)}
          </section>
        );
      })}

      <section id="nett" className="form-breakdown">
        {Object.values(nett).map(rowRenderer)}
      </section>
    </Fragment>
  );
}

export default FormBreakdown;
