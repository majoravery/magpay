import React from 'react';

import ReadOnly from './readonly';
import DatePicker from './datepicker';
import MonthPicker from './monthpicker';
import Numeral from './numeral';
import Radio from './radio';
import Text from './text';
import { FormContextConsumer } from '../../../context/formContext';

const rowRenderer = row => {
  return (
    <FormContextConsumer key={row.id}>
      {({ setField, [row.id]: value }) => { // dunno if [row.id] works
        switch(row.type) {
          case 'auto':
            return <ReadOnly value={value} {...row} />;
          case 'date':
            return <DatePicker onChange={setField} {...row} />;
          case 'month':
            return <MonthPicker onChange={setField} {...row} />;
          case 'number':
            return <Numeral onChange={setField} {...row} />;
          case 'radio':
            return <Radio onChange={setField} {...row} />;
          case 'string':
            return <Text onChange={setField} {...row} />;
          default:
            break;
          }
      }}
    </FormContextConsumer>
  );
}

export default rowRenderer;
