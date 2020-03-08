import React from 'react';
import { string, func, number } from 'prop-types';

import './row.scss';

const Numeral = ({ className, id, label, sumGroup, initialValue, onChange, duplicate, value }) => {
  return (
    <div className={`numeral ${className} ${duplicate ? 'displayOnly' : ''}`}>
      <div className="label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="input">
      {duplicate ? (
        <input id={id} name={id} type="number" value={value ? value : ''} disabled />
      ) : (
        <input id={id} name={id} type="number" defaultValue={initialValue} inputMode="decimal" step="0.01" onChange={e => {
            const value = parseFloat(e.target.value).toFixed(2);
            onChange(id, value, sumGroup);
          }}
        />
      )}
      </div>
    </div>
  );
}

Numeral.propTypes = {
  className: string,
  id: string.isRequired,
  label: string.isRequired,
  sumGroup: string, 
  initialValue: number,
  onChange: func.isRequired,
  value: number,
}

Numeral.defaultProps = {
  className: '',
  sumGroup: null,
  initialValue: null,
  value: null,
}

export default Numeral;
