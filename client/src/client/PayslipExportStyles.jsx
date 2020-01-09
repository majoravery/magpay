import { StyleSheet } from '@react-pdf/renderer';

const BG_COLOR = '#eee';
const DARKER_BG_COLOR = '#c6c6c6';
const BORDER_COLOR = '#6c6c6c'
const BORDER_STYLE = 'solid'
const COL_WIDTH_QUARTER = '25%';
const COL_WIDTH_HALF = '50%';
const COL_WIDTH_THREE_QUARTERS = '75%';
const COL_WIDTH_FULL = '100%';
const NORMAL_FONT_SIZE = 10;

const cellMargin = {
  marginTop: 4,
  marginBottom: 4,
  marginLeft: 8,
  marginRight: 8,
}
const borderOuter = {
  borderStyle: BORDER_STYLE, 
  borderColor: BORDER_COLOR,
  borderWidth: 1, 
  borderLeftWidth: 0, 
  borderTopWidth: 0,
};
const borderInner = {
  borderStyle: BORDER_STYLE, 
  borderColor: BORDER_COLOR,
  borderWidth: 1, 
  borderRightWidth: 0, 
  borderBottomWidth: 0,
}

const styles = StyleSheet.create({
  body: {
    padding: "50px 45px",
  },

  /** Header section */
  headerContainer: {
    marginBottom: 20,
    textAlign: "center",
    width: COL_WIDTH_FULL,
  },
  addressContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 19,
    fontWeight: "bold",
  },
  address: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  salarySlip: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 0,
    marginRight: 0,
  },

  /** Container */
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  left: {
    marginRight: 20,
    overflow: "hidden",
    width: "48%",
  },
  right: {
    overflow: "hidden",
    width: "48%",
  },
  bottom: {
    flex: "1 0 100%",
    width: COL_WIDTH_FULL,
  },

  /** Basic table properties */
  table: { 
    ...borderOuter,
    display: "table", 
    width: "auto", 
    marginBottom: 16,
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row",
  },  

  /** Info table */ 
  infoLabelCol: { 
    ...borderInner,
    width: COL_WIDTH_HALF, 
  },   
  infoLabelCell: { 
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
    wordBreak: "break-word",
  },
  infoInputCol: { 
    ...borderInner,
    width: COL_WIDTH_HALF, 
  },   
  infoInputCell: { 
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
    textAlign: "right",
  },

  /** Breakdown table */
  breakdownHeaderCol: { 
    ...borderInner,
    width: COL_WIDTH_FULL,
  },   
  breakdownHeaderCell: {
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
    textAlign: "center",
  }, 
  breakdownInputLabelCol: { 
    ...borderInner,
    width: COL_WIDTH_THREE_QUARTERS, 
  },   
  breakdownInputLabelCell: { 
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
  },
  breakdownInputCol: { 
    ...borderInner,
    width: COL_WIDTH_QUARTER, 
  },   
  breakdownInputCell: { 
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
    position: "relative",
    textAlign: "right",
  },
  breakdownOutputLabelCol: { 
    ...borderInner,
    backgroundColor: BG_COLOR,
    width: COL_WIDTH_THREE_QUARTERS, 
  },   
  breakdownOutputLabelCell: { 
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
  },
  breakdownOutputCol: { 
    ...borderInner,
    backgroundColor: BG_COLOR,
    width: COL_WIDTH_QUARTER, 
  },   
  breakdownOutputCell: { 
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
    position: "relative",
    textAlign: "right",
  },
  
  /** Nett payment table */
  infoLabelColNett: { 
    ...borderInner,
    backgroundColor: DARKER_BG_COLOR,
    width: COL_WIDTH_THREE_QUARTERS, 
  },
  infoInputColNett: { 
    ...borderInner,
    backgroundColor: DARKER_BG_COLOR,
    width: COL_WIDTH_QUARTER, 
  },  

  /** Footer table */
  footerCol: { 
    ...borderInner,
    width: COL_WIDTH_HALF, 
  },   
  footerCell: { 
    ...cellMargin,
    fontSize: NORMAL_FONT_SIZE,
    paddingBottom: 38,
    wordBreak: "break-word",
  },

  dollarSign: {
    left: 0,
    position: "absolute",
    textAlign: "left",
    width: COL_WIDTH_HALF,
  },
  numericValue: {
    position: "absolute",
    right: 0,
    textAlign: "right",
    width: COL_WIDTH_HALF,
  },
  stringValue: {
    position: "absolute",
    textAlign: "left",
    width: COL_WIDTH_FULL,
  }
});

export default { styles };