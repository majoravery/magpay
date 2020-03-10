import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { breakdown } from '../../../form.json';

const BG_COLOR = '#eee';
const BORDER_STYLE = 'solid';
const BORDER_COLOR = '#6c6c6c';
const COL_WIDTH_QUARTER = '25%';
const COL_WIDTH_HALF = '50%';
const COL_WIDTH_THREE_QUARTERS = '75%';
const COL_WIDTH_FULL = '100%';
const NORMAL_FONT_SIZE = 10;

const table = StyleSheet.create({
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderColor: BORDER_COLOR,
  borderStyle: BORDER_STYLE,
  display: "table",
  marginBottom: 16,
  width: "auto",
});

const tableRow = StyleSheet.create({
  flexDirection: "row",
  margin: "auto",
});

const tableRowReadOnly = StyleSheet.create({
  ...tableRow,
  backgroundColor: BG_COLOR,
});

const headerCol = StyleSheet.create({
  borderColor: BORDER_COLOR,
  borderLeftWidth: 1,
  borderStyle: BORDER_STYLE,
  borderTopWidth: 1,
  width: COL_WIDTH_FULL,
});

const headerCell = StyleSheet.create({
  fontSize: NORMAL_FONT_SIZE,
  marginBottom: 4,
  marginLeft: 8,
  marginRight: 8,
  marginTop: 4,
  textAlign: "center",
});

const labelCol = StyleSheet.create({
  borderColor: BORDER_COLOR,
  borderLeftWidth: 1,
  borderStyle: BORDER_STYLE,
  borderTopWidth: 1,
  width: COL_WIDTH_THREE_QUARTERS, 
});

const labelCell = StyleSheet.create({
  fontSize: NORMAL_FONT_SIZE,
  marginBottom: 4,
  marginLeft: 8,
  marginRight: 8,
  marginTop: 4,
});

const valueCol = StyleSheet.create({
  borderColor: BORDER_COLOR,
  borderLeftWidth: 1,
  borderStyle: BORDER_STYLE,
  borderTopWidth: 1,
  width: COL_WIDTH_QUARTER,
});

const valueCell = StyleSheet.create({
  fontSize: NORMAL_FONT_SIZE,
  marginBottom: 4,
  marginLeft: 8,
  marginRight: 8,
  marginTop: 4,
  position: "relative",
  textAlign: "right",
});

const dollarSign = StyleSheet.create({
  left: 0,
  position: "absolute",
  textAlign: "left",
  width: COL_WIDTH_HALF,
});

const numericValue = StyleSheet.create({
  position: "absolute",
  right: 0,
  textAlign: "right",
  width: COL_WIDTH_HALF,
});

const PDFBreakdown = props => {
  return (
    Object.keys(breakdown)
      .filter(key => key !== 'nett')
      .map(key => (
        <View style={table} key={`${key}-table`}>
          <View style={tableRow}> 
            <View style={headerCol}>
              <View style={headerCell}>
                {/* Unfort react-pdf StyleSheet does not support text-transform: capitalize */}
                <Text>{key.charAt(0).toUpperCase()}{key.substr(1)}</Text>
              </View>
            </View>
          </View>
          
          {breakdown[key] // All input fields
            .filter(row => row.type !== 'auto')
            .map(({ id, label }) => {
              const { [id]: value } = props;
              return (
                <View style={tableRow} key={id}>
                  <View style={labelCol}>
                    <View style={labelCell}>
                      <Text>{label}</Text>
                    </View>
                  </View>
                  <View style={valueCol}>
                    <View style={valueCell}>
                      <Text style={dollarSign}>$</Text><Text style={numericValue}>{value}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

          {breakdown[key] // ReadOnly fields
            .filter(row => row.type === 'auto')
            .map(({ id, label }) => {
              const { [id]: value } = props;
              return (
                <View style={tableRowReadOnly} key={id}>
                  <View style={labelCol}>
                    <View style={labelCell}>
                      <Text>{label}</Text>
                    </View>
                  </View>
                  <View style={valueCol}>
                    <View style={valueCell}>
                      <Text style={dollarSign}>$</Text><Text style={numericValue}>{value}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      ))
  );
};

export default PDFBreakdown;
