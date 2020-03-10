import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { info } from '../../../form.json';

const BORDER_STYLE = 'solid';
const BORDER_COLOR = '#6c6c6c';
const COL_WIDTH_HALF = '50%';
const COL_WIDTH_FULL = '100%';
const NORMAL_FONT_SIZE = 10;

const COLUMN_LEFT = ['particulars', 'payment'];
const COLUMN_RIGHT = ['duration', 'cpf'];

const container = StyleSheet.create({
  flexDirection: "row",
  flexWrap: "wrap",
});

const left = StyleSheet.create({
  marginRight: 20,
  overflow: "hidden",
  width: "48%",
});

const right = StyleSheet.create({
  overflow: "hidden",
  width: "48%",
});

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

const col = StyleSheet.create({
  borderStyle: BORDER_STYLE,
  borderColor: BORDER_COLOR,
  borderLeftWidth: 1,
  borderTopWidth: 1,
  width: COL_WIDTH_HALF,
});

const labelCell = StyleSheet.create({
  marginTop: 4,
  marginBottom: 4,
  marginLeft: 8,
  marginRight: 8,
  fontSize: NORMAL_FONT_SIZE,
  wordBreak: "break-word",
});

const valueCell = StyleSheet.create({
  marginTop: 4,
  marginBottom: 4,
  marginLeft: 8,
  marginRight: 8,
  fontSize: NORMAL_FONT_SIZE,
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

const stringValue = StyleSheet.create({
  position: "absolute",
  textAlign: "left",
  width: COL_WIDTH_FULL,
});

const renderer = (keyGroup, props) => {
  return Object.keys(info)
    .filter(key => keyGroup.includes(key))
    .map(key => {
      const rows = info[key];
      const displayDollarSign = key === 'cpf';

      return (
        <View style={table} key={key}>
          {rows.map(({ id, label }) => {
            const { [id]: value } = props;
            return (
              <View style={tableRow} key={id}>
                <View style={col}>
                  <View style={labelCell}>
                    <Text>{label}</Text>
                  </View>
                </View>
                <View style={col}>
                  <View style={valueCell}>
                    {displayDollarSign
                      ? <Fragment>
                          <Text style={dollarSign}>$</Text><Text style={numericValue}>{value}</Text>
                        </Fragment>
                      : <Text style={stringValue}>{value}</Text>}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      );
    });
}

const PDFInfo = props => {
  return (
    <View style={container}>
      <View style={left}>
        {renderer(COLUMN_LEFT, props)}
      </View>
      <View style={right}>
        {renderer(COLUMN_RIGHT, props)}
      </View>
    </View>
  );
};

export default PDFInfo;
