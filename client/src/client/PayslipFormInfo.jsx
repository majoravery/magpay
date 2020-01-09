import React from 'react';

import { rowRenderer } from './rowRenderer';

import './PayslipForm.scss';

const PayslipFormInfo = ({ info, setField, updateSubtotal, state }) => {
  return (
    Object.keys(info).map(key => {
      const table = info[key];
      return (
        <section
          key={key}
          id={key}
          className="infoTable"
          onChange={() => {
            if (key === 'cpfContribution') {
              updateSubtotal(key, false);
            }
          }}
        >
          {table.map(row => rowRenderer(row, setField, state))}
        </section>
      );
    })
  );
}

export default PayslipFormInfo;
