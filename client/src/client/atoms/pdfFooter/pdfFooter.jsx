import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { footer } from '../../../form.json';

const BORDER_STYLE = 'solid';
const BORDER_COLOR = '#6c6c6c';
const COL_WIDTH_HALF = '50%';
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

const col = StyleSheet.create({
  borderLeftWidth: 1,
  borderTopWidth: 1,
  borderColor: BORDER_COLOR,
  borderStyle: BORDER_STYLE,
  width: COL_WIDTH_HALF,
});

const cell = StyleSheet.create({
  fontSize: NORMAL_FONT_SIZE,
  marginBottom: 4,
  marginLeft: 8,
  marginRight: 8,
  marginTop: 4,
  paddingBottom: 38,
  wordBreak: "break-word", // don't think this registers
});

const PDFFooter = () => {
  return (
    <View style={table}>
      <View style={tableRow}>
        {Object.values(footer)
          .map(({ id, label }) => (
            <View style={col} key={id}>
              <View style={cell}>
                <Text>{label}</Text>
              </View>
            </View>
          ))
        }
      </View>
    </View>
  );
};

export default PDFFooter;
