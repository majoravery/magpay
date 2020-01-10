import React from 'react';
import { string, number, oneOfType } from 'prop-types';

import './row.scss';

const ReadOnly = ({ className, id, label, sumType, value }) => {
  let displayValue = value;
  if (typeof value === 'number') {
    displayValue = parseFloat(value).toFixed(2);
  }
  return (
    <div className={`readonly ${className}`} data-type={sumType}>
      <div className="label">{label}</div>
      <div className="output">
        <span id={id}>{displayValue}</span>
      </div>
    </div>
  );
}

ReadOnly.propTypes = {
  className: string,
  id: string.isRequired,
  label: string.isRequired,
  sumGroup: string,
  value: oneOfType([number, string]),
}

ReadOnly.defaultProps = {
  className: '',
  sumGroup: null,
  value: null,
}

export default ReadOnly;
