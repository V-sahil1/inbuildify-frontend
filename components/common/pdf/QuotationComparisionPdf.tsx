'use client';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/1PTSg8zYS_SKfqw6.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/helveticaneue/v1/1PTSg8zYS_SKfqw6.ttf',
      fontWeight: 'bold',
    },
  ],
});

interface Props {
  comparisonResult: any[];
  propertyAddress?: string;
  selectedVersions?: any[];
  slugId?: string;
}

export const QuotationComparisionPdf = ({
  comparisonResult,
  propertyAddress,
  selectedVersions,
  slugId,
}: Props) => {
  const v1 = selectedVersions?.[0] || { quotationVersionNo: 'Version 1', grandTotalCost: '0.00' };
  const v2 = selectedVersions?.[1] || { quotationVersionNo: 'Version 2', grandTotalCost: '0.00' };

  const Footer = () => (
    <View style={styles.footerWrapper} fixed>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
      />
      <Text style={styles.footerLink}>
        https://app.insimplify.com.au/screens/LeadInfo.aspx?r=5594f23d-80bc-4da2-be62-13d96efd27c2
      </Text>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer} fixed>
      <View style={styles.headerTopLine}>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('en-GB')},{' '}
          {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.headerTitle}>Quotation Version Comparison - {slugId || ''}</Text>
      </View>

      {/* Summary Box */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          {/* Column 1: Address (Matches Description Column Flex 3) */}
          <View style={styles.summaryColAddress}>
            <Text style={styles.summaryAddressLabel}>Property Address : {propertyAddress}</Text>
            <Text style={styles.itemsLabel}>Items</Text>
          </View>

          {/* Column 2: Version 1 (Matches Value Column Flex 1) */}
          <View style={styles.summaryColVersion}>
            <Text style={styles.versionLabel}>Version {v1.quotationVersionNo}</Text>
            <Text style={styles.versionAmount}>${Number(v1.grandTotalCost).toFixed(2)}</Text>
          </View>

          {/* Column 3: Version 2 (Matches Value Column Flex 1) */}
          <View style={styles.summaryColVersion}>
            <Text style={styles.versionLabel}>Version {v2.quotationVersionNo}</Text>
            <Text style={styles.versionAmount}>${Number(v2.grandTotalCost).toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <Page size="A4" style={styles.page}>
      <Header />
      <View style={styles.body}>{children}</View>
      <Footer />
    </Page>
  );

  return (
    <Document>
      <PageLayout>
        <View style={ItemTable.table}>
          {comparisonResult.map((item, index) => (
            <View key={index} style={ItemTable.row} wrap={false}>
              {/* Item Description Column */}
              <View style={ItemTable.colDescription}>
                <Text style={ItemTable.categoryName}>{item.name || 'Category'}</Text>
                {/* <Text style={ItemTable.itemDescription}>{item.description}</Text> */}
              </View>

              {/* Version 1 Value */}
              <View style={ItemTable.colValue}>
                <Text style={ItemTable.valueText}>
                  {item.type === 'pricelist_item'
                    ? item.version1TotalPrice || '-'
                    : item.version1Value || '-'}
                </Text>
                {/* {item.left?.value !== '-' && item.left?.quantity > 0 && (
                  <Text style={ItemTable.detailsText}>{item.left?.details}</Text>
                )} */}
              </View>

              {/* Version 2 Value */}
              <View style={ItemTable.colValue}>
                <Text style={ItemTable.valueText}>
                  {item.type === 'pricelist_item'
                    ? item.version2TotalPrice || '-'
                    : item.version2Value || '-'}
                </Text>
                {/* {item.right?.value !== '-' && item.right?.quantity > 0 && (
                  <Text style={ItemTable.detailsText}>{item.right?.details}</Text>
                )} */}
              </View>
            </View>
          ))}
        </View>
      </PageLayout>
    </Document>
  );
};

export default QuotationComparisionPdf;

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  body: {
    marginTop: 80,
    marginBottom: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  headerTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headerDate: { fontSize: 8, color: '#000' },
  headerTitle: { fontSize: 10, fontWeight: 'bold' },

  summaryBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryColAddress: {
    flex: 3,
    padding: 5,
    justifyContent: 'space-between',
  },
  summaryColVersion: {
    flex: 1,
    padding: 5,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  summaryAddressLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  versionLabel: { fontSize: 8, color: '#333' },
  versionAmount: { fontSize: 9, fontWeight: 'bold' },
  itemsLabel: { fontSize: 11, fontWeight: 'bold' },

  footerWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
  },
  footerLink: { fontSize: 7, color: '#666' },
  footerText: { fontSize: 8 },
});

const ItemTable = StyleSheet.create({
  table: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minHeight: 40,
  },
  colDescription: {
    flex: 3,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    justifyContent: 'flex-start',
  },
  colValue: {
    flex: 1,
    padding: 5,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  categoryName: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 9,
  },
  valueText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
});
