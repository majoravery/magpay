import React from 'react';

import rowRenderer from '../row';

import { info } from '../../../form.json';

import './formInfo.scss';

const FormInfo = () => {
  return (
    Object.keys(info).map(key => {
      return (
        <section key={key} id={key} className="form-info">
          {info[key].map(rowRenderer)}
        </section>
      );
    })
  );
}

export default FormInfo;
