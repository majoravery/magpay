import React from 'react';
import { string, func, arrayOf, shape } from 'prop-types';

import './row.scss';

const Radio = ({ className, id, label, sumGroup, initialValue, choices, onChange }) => {
  return (
    <div className={`radio ${className}`}>
      <div className="label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="options">
        {choices.map((mode, i) => {
          const { id: modeId, label: modeLabel } = mode;
          
          return (
            <div key={modeId} className="option">
              <input type="radio" id={modeId} name={id} value={modeId} onChange={e => onChange(id, e.target.value, sumGroup)} />
              <label htmlFor={modeId}>{modeLabel}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Radio.propTypes = {
  className: string,
  id: string.isRequired,
  label: string.isRequired,
  sumGroup: string, 
  initialValue: string,
  choices: arrayOf(
    shape({
      id: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
  onChange: func.isRequired,
}

Radio.defaultProps = {
  className: '',
  sumGroup: null,
  initialValue: null,
}

export default Radio;
