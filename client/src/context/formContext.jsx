import React, { Component, createContext } from 'react';
import { node } from 'prop-types';

import { info, breakdown } from '../form.v2.json';

const defaultState = {};

const { Provider, Consumer } = createContext(defaultState);

const BREAKDOWN_SUBTOTAL_KEYS = ['earnings', 'deductions', 'additions'];

class FormContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = { ...defaultState };

    this.setField = this.setField.bind(this);
  }

  componentDidMount() {
    this.setInitialState();
    this.createSumGroupObject();
  }

  componentDidUpdate(_, prevState, snapshot) {
    const changedId = Object.keys(prevState)
      .filter(key => prevState[key] !== this.state[key])[0];
    
    if (!changedId) {
      return;
    }

    const [setState, updatedSumGroups] = this.calculateSumGroups(changedId);

    if (setState) {
      this.setState({ ...updatedSumGroups });
    }
  }

  setInitialState() {
    let data = [];
    [info, breakdown].forEach(section => {
      Object.values(section)
        .forEach(items => {
          items.forEach(item => { 
            data[item.id] = item.initialValue ? item.initialValue : null;
          });
        });
    });
    this.setState({ ...data });
  }

  // This function turns the form json into an object like: { [rouproupID]: [field IDs] }
  createSumGroupObject() {
    let groups = {};
    [info, breakdown].map(section => (
      Object.values(section)
        .reduce((all, each) => (all.concat(each)), [])
        .filter(item => item.sumGroupId) // Filter items that have a sumGroupId
        .forEach(item => {
          if (groups[item.sumGroupId]) {
            groups[item.sumGroupId].push(item.id);  
          } else {
            groups[item.sumGroupId] = [item.id];
          }
        })
    ));
    this.sumGroups = groups;
  }

  // Calculate valules of subtotal and total fields
  calculateSumGroups(changedId) {
    const triggeredSumGroups = Object.keys(this.sumGroups)
      .filter(key => this.sumGroups[key].includes(changedId));

    let setState = false;
    let updatedSumGroups = {};
    let updateTotalNeeded = false;
    triggeredSumGroups.forEach(key => {
      const sum = this.sumGroups[key].reduce((acc, itemId) => {
        const c = this.state[itemId] && !isNaN(this.state[itemId]) ? parseFloat(this.state[itemId]) : 0;
        return parseFloat(acc) + c;
      }, 0);

      // Hardcoding this bit until I figure out a more robust solution #1
      if (BREAKDOWN_SUBTOTAL_KEYS.includes(key) && !updateTotalNeeded) {
        updateTotalNeeded = true;
      }

      if (this.state[key] !== updatedSumGroups[key]) {
        updatedSumGroups[key] = sum;
        setState = true;
      }
    });

    // Hardcoding this bit until I figure out a more robust solution #2
    if (updateTotalNeeded) {
      // Subtotal state hasn't been set yet, so use in-memory state value here
      const u = BREAKDOWN_SUBTOTAL_KEYS.map(key => updatedSumGroups[key] ? updatedSumGroups[key] : this.state[key])
      updatedSumGroups.breakdown = parseFloat(u[0]) - parseFloat(u[1]) + parseFloat(u[2]);
    }
    return [setState, updatedSumGroups];
  }

  setField(id, value) {
    this.setState({ [id]: value });
  }

  render() {
    const { children } = this.props;
    const value = {
      ...this.state,
      setField: this.setField,
    };
    
    return <Provider value={value}>{children}</Provider>;
  }
}

FormContextProvider.propTypes = {
  children: node.isRequired,
};

export { FormContextProvider, Consumer as FormContextConsumer };
