'use client';
import { Document } from '@react-pdf/renderer';
import { Text, View, StyleSheet, Image, Page } from '@react-pdf/renderer';
import { CompactionReport } from '@redux/feature/lead/ILeadState';

export const CompactionReportPdf = (compactionReport: CompactionReport) => {
  const Footer = () => (
    <View style={styles.footerWrapper} fixed>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={styles.footerTopText}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer} fixed>
      <Image src="/company-light.png" style={styles.logo} />
    </View>
  );
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <Page size="A4" style={styles.page}>
      <Header />
      {/* <Watermark /> */}
      <View style={styles.body}>{children}</View>
      <Footer />
    </Page>
  );
  return (
    <Document>
      <PageLayout>
        <View style={{ marginLeft: 20 }}>
          <View style={[styles.secondaryText, { marginVertical: 30 }]}>
            <View>
              <Text style={styles.headerText}>Compaction Report</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Land Type</Text>
              <Text>: {compactionReport.landType}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Ground Level</Text>
              <Text>: {compactionReport.groundLevel}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Slope Condition</Text>
              <Text>: {compactionReport.slopeCondition}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Soil Type</Text>
              <Text>: {compactionReport.soilType}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Soil Classification (AS 2870)</Text>
              <Text>: {compactionReport.soilClass}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Moisture Content (%)</Text>
              <Text>: {compactionReport.moistureContent}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Dry Density (kg/m³)</Text>
              <Text>: {compactionReport.dryDensity}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Max Dry Density (kg/m³)</Text>
              <Text>: {compactionReport.maxDryDensity}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>% Compaction</Text>
              <Text>: {compactionReport.compaction}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Result</Text>
              <Text>: {compactionReport.result.toUpperCase()}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Engineer Name</Text>
              <Text>: {compactionReport.engineerName}</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Remark</Text>
              <Text>: {compactionReport.remarks || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </PageLayout>
    </Document>
  );
};
const styles = StyleSheet.create({
  page: {
    paddingTop: 10,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
    flexDirection: 'column',
    fontFamily: 'Helvetica',
  },
  body: { paddingTop: 5, flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  logo: { width: 120, height: 50, objectFit: 'contain' },
  headerTextContainer: { flexDirection: 'column', alignItems: 'flex-end' },
  headerText: { fontSize: 15, textAlign: 'left', fontWeight: 'bold', marginBottom: 10 },
  secondaryText: { fontSize: 10, textAlign: 'left', marginBottom: 10 },
  footerWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  footerTopText: {
    fontSize: 9,
    color: '#000',
    textAlign: 'center',
  },
});

const Page1styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  customerRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  customerLabel: {
    width: 150,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    fontSize: 10,
    flex: 1,
    width: 50,
  },
});
