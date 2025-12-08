'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { TermsAndCondition } from './TermsAndCondition';

const TermsAndConditionsPdf = ({}) => {
  const Footer = () => (
    <View style={styles.footerWrapper} fixed>
      <Text style={styles.footerDate}>30 Sep 2025</Text>
      <Text
        style={styles.footerPageNum}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
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
      <View style={styles.body}>{children}</View>
      <Footer />
    </Page>
  );
  return (
    <Document>
      <PageLayout>
        <TermsAndCondition />
      </PageLayout>
    </Document>
  );
};
export default TermsAndConditionsPdf;
const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
    flexDirection: 'column',
    fontFamily: 'Helvetica',
  },
  body: { paddingTop: 10, flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 0,
    paddingBottom: 6,
  },
  logo: { width: 120, height: 50, objectFit: 'contain' },
  TitleText: {
    fontSize: 15,
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 25,
  },
  headerText: {
    fontSize: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  secondaryText: {
    fontSize: 10,
    textAlign: 'left',
    marginBottom: 10,
    flexDirection: 'row',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerDate: {
    fontSize: 9,
    color: '#000',
    width: '45%',
    textAlign: 'left',
  },
  footerPageNum: {
    fontSize: 9,
    color: '#000',
    width: '50%',
    textAlign: 'left',
  },
});
