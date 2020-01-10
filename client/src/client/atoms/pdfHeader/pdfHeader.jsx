import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const COL_WIDTH_FULL = '100%';

const container = StyleSheet.create({
  marginBottom: 20,
  textAlign: "center",
  width: COL_WIDTH_FULL,
});

const companyName = StyleSheet.create({
  fontSize: 19,
  marginBottom: 4,
});

const addressContainer = StyleSheet.create({
  marginTop: 8,
  marginBottom: 4,
});

const address = StyleSheet.create({
  fontSize: 12,
  marginBottom: 2,
});

const salarySlip = StyleSheet.create({
  fontSize: 14,
  marginTop: 8,
  marginBottom: 4,
});

const PDFHeader = () => {
  return (
    <View style={container}>
      <Text style={companyName}>Magbelle Hair Salon</Text>
      <View style={addressContainer}>
        <Text style={address}>18 Yishun Avenue 9</Text>
        <Text style={address}>Junction Nine #02-49</Text>
        <Text style={address}>Singapore 768897</Text>
      </View>
      <Text style={salarySlip}>Salary Slip</Text>
    </View>
  );
};

export default PDFHeader;
