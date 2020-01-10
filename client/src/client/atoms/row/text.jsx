import React from 'react';
import { string, func } from 'prop-types';

import './row.scss';

const Text = ({ className, id, label, sumGroup, initialValue, onChange }) => {
  return (
    <div className={`text ${className}`}>
      <div className="label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="input">
        <input id={id} name={id} type="text" defaultValue={initialValue} onChange={e => onChange(id, e.target.value, sumGroup) } />
      </div>
    </div>
  );
}

Text.propTypes = {
  className: string,
  id: string.isRequired,
  label: string.isRequired,
  sumGroup: string, 
  initialValue: string,
  onChange: func.isRequired,
}

Text.defaultProps = {
  className: '',
  sumGroup: null,
  initialValue: null,
}

export default Text;
