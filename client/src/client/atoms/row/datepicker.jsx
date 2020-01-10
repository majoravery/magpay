import React from 'react';
import { string, func } from 'prop-types';

import './row.scss';

const DatePicker = ({ className, id, label, sumGroup, initialValue, onChange }) => {
  return (
    <div className={`datepicker ${className}`}>
      <div className="label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="input">
        <input id={id} name={id} type="date" defaultValue={initialValue} onChange={e => onChange(id, e.target.value, sumGroup) } />
      </div>
    </div>
  );
}

DatePicker.propTypes = {
  className: string,
  id: string.isRequired,
  label: string.isRequired,
  sumGroup: string, 
  initialValue: string,
  onChange: func.isRequired,
}

DatePicker.defaultProps = {
  className: '',
  sumGroup: null,
  initialValue: null,
}

export default DatePicker;
