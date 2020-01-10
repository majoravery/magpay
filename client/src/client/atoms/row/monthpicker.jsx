import React from 'react';
import { string, func } from 'prop-types';

import './row.scss';

const MonthPicker = ({ className, id, label, sumGroup, initialValue, onChange }) => {
  return (
    <div className={`monthpicker ${className}`}>
      <div className="label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="input">
        <input id={id} name={id} type="month" defaultValue={initialValue} onChange={e => onChange(id, e.target.value, sumGroup) } />
      </div>
    </div>
  );
}

MonthPicker.propTypes = {
  className: string,
  id: string.isRequired,
  label: string.isRequired,
  sumGroup: string, 
  initialValue: string,
  onChange: func.isRequired,
}

MonthPicker.defaultProps = {
  className: '',
  sumGroup: null,
  initialValue: null,
}

export default MonthPicker;
