import React, { Fragment } from 'react';

import { rowRenderer } from './rowRenderer';

import './PayslipForm.scss';

const PayslipFormBreakdown = ({ breakdown, setField, updateSubtotal, state }) => {
  return (
    <Fragment>
      {Object
        .keys(breakdown)
        .filter(key => key !== 'nett')
        .map(key => {
          const table = breakdown[key];
          return (
            <section key={key} id={key} onChange={() => updateSubtotal(key, true)}>
              <div className="header">{key}</div>
              {table.map(row => rowRenderer(row, setField, state))}
            </section>
          );
        })}

      <section id="final">
        {Object
        .keys(breakdown)
        .filter(key => key === 'nett')
        .map(key => {
          const table = breakdown[key];
          return table.map(row => rowRenderer(row, setField, state))
        })}
      </section>
    </Fragment>
  );
};

export default PayslipFormBreakdown;
