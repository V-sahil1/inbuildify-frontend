'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const ContractDocumentPdf = ({}) => {
  const data = {
    constructiontype: [
      {
        label: `If the cost of the building work is more than $16,000, has an insurance policy or certificate of currency for domestic building insurance covering your project been issued and provided to you?
(Note: If not, the Contract is conditional upon you receiving either an insurance policy or a certificate of currency for domestic building insurance.)`,
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          'If this Contract is conditional upon you receiving written approval for finance, have you obtained such approval?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: `Have you appointed a private building surveyor or has a municipal building surveyor been engaged?
(Note: If not, you will need to choose and engage a building surveyor before your building work starts so that a building permit can be issued for your building work.)`,
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
    ],
    mandatoruRules: [
      {
        label: 'Have you had this contract long enough to read and understand it?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          'Have you been provided with evidence that the builder named in this contract is registered with the Victorian Building Authority?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Are the price and progress payments clearly stated',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Do you understand how the price is calculated and may be varied',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          'Has the builder assessed the suitability of the site for the proposed works? If tests are necessary, have they been carried out?',
        Value: '',
        options: ['Yes', 'No'],
      },
      {
        label:
          'If a deposit is payable, is it within the legal limit? The maximum under the Domestic Building Contracts Act 1995 is:',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          'Is the work shown and described clearly in the contract, plans and specifications and any other relevant documents (such as engineering computations or soil report)?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          'Are your special requirements or standards of finish included in the plans and specifications?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          'Are the commencement date and completion date clearly stated or capable of being worked out?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Do you understand the procedure for extensions of time?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          "Are any 'provisional sums' or 'prime cost items' clearly stated in the schedules and understood by you?",
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Do you understand the procedure for variations of plans and specifications?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Do you understand the circumstances in which you can end the contract?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Did your builder give you a copy of the Domestic Building Consumer Guide?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label:
          'Have you read the Domestic Building Consumer Guide and the related information at consumer.vic.gov.au/buildingguide?',
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
    ],
  };

  const scheduleData = [
    { title: 'SCHEDULE 1', content: 'Prime Cost Items and Provisional Sums', page: '6, 7' },
    { title: 'SCHEDULE 2', content: 'Construction Stages and Table', page: '6, 7' },
    { title: 'SCHEDULE 1', content: 'Prime Cost Items and Provisional Sums', page: '6, 7' },
    { title: 'SCHEDULE 1', content: 'Prime Cost Items and Provisional Sums', page: '6, 7' },
    { title: 'SCHEDULE 1', content: 'Prime Cost Items and Provisional Sums', page: '6, 7' },
    { title: 'SCHEDULE 1', content: 'Prime Cost Items and Provisional Sums', page: '6, 7' },
    { title: 'SCHEDULE 1', content: 'Prime Cost Items and Provisional Sums', page: '6, 7' },
    { title: 'SCHEDULE 1', content: 'Prime Cost Items and Provisional Sums', page: '6, 7' },
  ];

  const ViewData = ({ label, isCheckBox, Value, options }) => (
    <View style={styles.item}>
      <Text style={{ width: 200 }}>{label}</Text>
      <Text>: </Text>
      {isCheckBox ? (
        <View style={{ width: 300, flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
          :
          {options?.map((op, index) =>
            Value === op ? (
              <View key={index} style={{ flexDirection: 'row' }}>
                <View style={checkBoxStyle.container}>
                  <Image src="/check.png"></Image>
                </View>
                <Text>{op}</Text>
              </View>
            ) : (
              <View key={index} style={{ flexDirection: 'row' }}>
                <View style={checkBoxStyle.container}></View> <Text>{op}</Text>
              </View>
            )
          )}
        </View>
      ) : (
        <Text style={{ width: 300 }}>{Value}</Text>
      )}
    </View>
  );

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
      {/* <Header /> */}
      <View style={styles.body}>{children}</View>
      <Footer />
    </Page>
  );
  return (
    <Document>
      <PageLayout>
        <View style={styles.frontPage}>
          <View style={styles.titleText}>
            <Text>VICTORIAN</Text>
            <Text>NEW HOMES CONTRACT</Text>
            <Text>AUGUST 2017</Text>
          </View>
          <Image src="/company-light.png" style={styles.logo} />
          <Text>HOUSING INDUSTRY ASSOCIATION</Text>
          <Image src="/company-light.png" style={styles.logo} />
          <View style={styles.headerText}>
            <Text>Location Of Building Site</Text>
            <View style={ItemTable.table}>
              <View style={ItemTable.row}>
                <Text style={ItemTable.cell}>Company Name : </Text>
                <Text style={ItemTable.cell}>My Home Pty Ltd</Text>
              </View>
              <View style={ItemTable.row}>
                <Text style={ItemTable.cell}>ABN : </Text>
                <Text style={ItemTable.cell}>82 156 644 478</Text>
              </View>
              <View style={ItemTable.row}>
                <Text style={ItemTable.cell}>Site Address: </Text>
                <Text style={ItemTable.cell}>Lot 89 ,VIC 2075</Text>
              </View>
              <View style={ItemTable.row}>
                <Text style={ItemTable.cell}>Buider :</Text>
                <Text style={ItemTable.cell}>My Home</Text>
              </View>
              <View style={ItemTable.row}>
                <Text style={ItemTable.cell}>Contract Expiry: </Text>
                <Text style={ItemTable.cell}>12</Text>
              </View>
              <View style={ItemTable.row}>
                <Text style={ItemTable.cell}>Regestration No: </Text>
                <Text style={ItemTable.cell}>123</Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View>
            <Text>
              NOTICE APPROVED BY THE DIRECTOR OF CONSUMER AFFAIRS PURSUANT TO SECTION 31 (1) (n) OF
              THE DOMESTIC BUILDING CONTRACTS ACT 1995
            </Text>
            <Text>COOLING OFF PERIOD</Text>
            <Text>
              NOTICE TO BUILDING OWNER: YOU MAY END THIS CONTRACT WITHIN FIVE CLEAR BUSINESS DAYS
              AFTER RECEIPT BY YOU OF A SIGNED COPY OF THE CONTRACT BY FILLING IN THE NOTICE BELOW
              AND GIVING IT TO THE BUILDER IN ONE OF THE FOLLOWING WAYS:
            </Text>
            <Text>
              <Text style={styles.bullets}>1.</Text>PERSONALLY
            </Text>
            <Text>
              <Text style={styles.bullets}>2.</Text>LEAVING IT AT HIS OR HER ADDRESS SET OUT IN THE
              CONTRACT WITH A PERSON WHO APPEARS TO BE AT LEAST 16 YEARS OLD
            </Text>
            <Text>
              <Text style={styles.bullets}>3.</Text>SENDING IT BY PRE-PAID REGISTERED POST TO THE
              ADDRESS SET OUT IN THIS CONTRACT
            </Text>
            <Text>
              <Text style={styles.bullets}>4.</Text>SENDING IT BY FACSIMILE TO THE FACSIMILE NUMBER
              (IF ANY) SET OUT IN THIS CONTRACT
            </Text>
          </View>
          <View>
            <Text>NOTICE THAT CONTRACT HAS ENDED</Text>
            <Text>A Building Owner cannot withdraw from a contract under the Act if:</Text>
            <Text>
              <Text style={styles.bullets}>1.</Text>The Builder and the Building Owner have
              previously entered into a major domestic building contract that is in substantially
              the same terms for the carrying out of the work in relation to the same home or land;
              OR
            </Text>
            <Text>
              <Text style={styles.bullets}>2.</Text>The Building Owner received independent legal
              advice from a practising solicitor concerning the contract before entering into the
              contract.
            </Text>
            <Text>To: </Text>
            <Text>I/We </Text>
            <Text>
              notice under our contract with you that the contractis ended.Please refund the deposit
              lets $100 and any out of pocket expenses incurred by you which I/We have previously
              approved
            </Text>
          </View>
          <View style={ItemTable.table}>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Purchaser 1 Signature</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Full Name</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Date</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
          </View>
          <View style={ItemTable.table}>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Purchaser 2 Signature</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Full Name</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Date</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
          </View>
        </View>
        <View>
          <View>
            DIRECTOR OF CONSUMER AFFAIRS VICTORIA APPROVED DOMESTIC BUILDING CONTRACTS CHECKLIST
            SECTION 31 (1) (f) OF THE DOMESTIC BUILDING CONTRACTS ACT 1995
          </View>
          <Text>
            This checklist must be included in major domestic building contracts entered into from 1
            September 2016 in substantially the same form or to the same effect as follows.
          </Text>
          <Text>Before signing this legally binding contract, check this list:</Text>
          {data.constructiontype.map((item, index) => (
            <View key={index}>
              <Text>{item.label}</Text>
              <View style={{ width: 300, flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
                {item.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={{ flexDirection: 'row' }}>
                    <View style={checkBoxStyle.container}>
                      {item.Value === option && <Image src="/check.png"></Image>}
                    </View>
                    <Text>{option}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <Text>
            If you answer “NO” to any of the following questions that apply to your building
            project, you are not ready to sign the contract:
          </Text>
          {data.mandatoruRules.map((item, index) => (
            <View key={index}>
              <Text>{item.label}</Text>
              <View style={{ width: 300, flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
                {item.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={{ flexDirection: 'row' }}>
                    <View style={checkBoxStyle.container}>
                      {item.Value === option && <Image src="/check.png"></Image>}
                    </View>
                    <Text>{option}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <Text>This checklist does not form part of the Contract.</Text>
          <Text>Read, signed and dated by the building owner</Text>
          <View style={ItemTable.table}>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Purchaser 1 Signature</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Full Name</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Date</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
          </View>
          <View style={ItemTable.table}>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Purchaser 2 Signature</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Full Name</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={ItemTable.cell}>Date</Text>
              <Text style={ItemTable.cell}></Text>
            </View>
          </View>
          <Text>
            Note: Not all of these questions will apply to a domestic building contract that covers
            a limited scope of work, for example , a contract that is limited to the preparation of
            building plans and specifications.
          </Text>
        </View>
        <View>
          <Text>INDEX</Text>
        </View>
      </PageLayout>
    </Document>
  );
};
export default ContractDocumentPdf;

const ItemTable = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerRow: {
    backgroundColor: '#f1f1f1',
  },
  cell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: '#000',
  },

  col40: { flex: 4 },
  col15: { flex: 1.5, textAlign: 'right' },
  col100: { flex: 1 },
});
const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
    flexDirection: 'column',
    fontFamily: 'Helvetica',
  },
  frontPage: {
    justifyContent: 'center',
    marginTop: 40,
  },
  body: { padding: 20, flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  logo: { width: 120, height: 50, objectFit: 'contain' },
  titleText: {
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 20,
  },
  headerText: {
    backgroundColor: '#929292',
    fontSize: 10,
    color: 'white',
    padding: 6,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  secondaryText: { fontWeight: 'bold' },
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
  item: {
    fontSize: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullets: {
    marginRight: 2,
  },
});

const checkBoxStyle = StyleSheet.create({
  container: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
});
