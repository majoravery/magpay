import React, { Fragment } from 'react';

export function rowRenderer(row, setField, state) {
  const { id, label, initialValue, type } = row;
  let component;
  switch(type) {
    case 'string':
      component = (
        <Fragment key={id}>
          <div className="label"><label htmlFor={id}>{label}</label></div>
          <div className="input">
            <input
              className="input-field"
              id={id}
              name={id} 
              type="text"
              defaultValue={initialValue ? initialValue : ''}
              onChange={e => setField(id, e.target.value) }
            />
          </div>
        </Fragment>
      );
      break;
    case 'number':
      component = (
        <Fragment key={id}>
          <div className="label"><label htmlFor={id}>{label}</label></div>
          <div className="input">
            <input
              className="input-field"
              id={id}
              name={id} 
              type="number"
              inputMode="decimal"
              step="0.01"
              onChange={e => {
                const value = parseFloat(e.target.value).toFixed(2);
                setField(id, value)
              }}
            />
          </div>
        </Fragment>
      );
      break;
    case 'auto':
      component = (
        <Fragment key={id}>
          <div className={`label ${row.sumType}`}>{label}</div>
          <div className={`output ${row.sumType}`}><span id={id}>{state[id]}</span></div>
        </Fragment>
      );
      break;
    case 'date':
      component = (
        <Fragment key={id}>
          <div className="label"><label htmlFor={id}>{label}</label></div>
          <div className="input">
            <input
              className="input-field"
              id={id}
              name={id} 
              type="date"
              onChange={e => setField(id, e.target.value) }
            />
          </div>
        </Fragment>
      );
      break;
    case 'month':
      component = (
        <Fragment key={id}>
          <div className="label"><label htmlFor={id}>{label}</label></div>
          <div className="input">
            <input
              className="input-field"
              id={id}
              name={id} 
              type="month"
              onChange={e => setField(id, e.target.value) }
            />
          </div>
        </Fragment>
      );
      break;
    case 'radio':
      component = (
        <Fragment key={id}>
          <div className="label radio-label"><label htmlFor={id}>{label}</label></div>
          <div className="radio-choices">
            {row.choices.map((mode, i) => {
              const { id: modeId, label: modeLabel } = mode;
              
              return (
                <div key={modeId} className="radio-choice">
                  <input
                    className="radio-choice-field"
                    type="radio"
                    id={modeId}
                    name={id}
                    value={modeId}
                    onChange={e => setField(id, e.target.value)}
                  />
                  <label className="radio-choice-label" htmlFor={modeId}>{modeLabel}</label>
                </div>
              );
            })}
          </div>
        </Fragment>
      );
      break;
    default:
      break;
  }

  return component;
}