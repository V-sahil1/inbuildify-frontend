import { View, StyleSheet, Text } from '@react-pdf/renderer';
export const TermsAndCondition = () => {
  return (
    <>
      <View style={styles.TitleText}>
        <Text>Terms And Conditions</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <View>
          <Text style={styles.headerText}>Terms And Conditions</Text>
        </View>
        <View style={{ marginLeft: 10, marginRight: 30 }}>
          <View style={styles.secondaryText}>
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <View>
              <Text style={{ marginBottom: 10 }}>
                By signing this Sales Quotation, the Client agrees and acknowledges:
              </Text>
              <Text>
                (a) The Client agrees with all the terms and conditions contained in this Sales
                Quotation;
              </Text>
              <Text>
                (b) MyHome will prepare a Tender based on the information provided by the Client;
                and
              </Text>
              <Text> (c) The initial deposit will form part of the contract price.</Text>
            </View>
          </View>
          <View style={styles.secondaryText}>
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <Text>
              The Initial deposit is non-refundable as it covers all your appointments with your
              sales consultant; the preparation of your quotation, siting and associated documents;
              and all other necessary works to prepare your paperwork for the Tender Stage.
            </Text>
          </View>
          <View style={styles.secondaryText}>
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <Text>
              The Builder reserves the right to increase the price of this Sales Quotation to
              recover any increase in the GST rate which takes effect after the date of this Sales
              Quotation and which causes an increase in the cost to the Builder in constructing your
              home.
            </Text>
          </View>
          <View style={styles.secondaryText}>
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <Text>
              My Home will conduct a preliminary bushfire assessment at the time of the site survey.
              The costs associated with any additional works resulting from the Client’s land being
              in a bushfire-prone area will be borne by the Client.
            </Text>
          </View>
          <View style={styles.secondaryText}>
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <Text>
              The pricing and quantities contained in this Sales Quotation are approximates only and
              subject to adjustment, and Builder is not bound by the estimated pricing and/or any
              representation set out in this Sales Quotation. The pricing will be confirmed at the
              Tender appointment.
            </Text>
          </View>
          <View style={styles.secondaryText}>
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <Text>All prices quoted are GST inclusive.</Text>
          </View>
          <View style={styles.secondaryText}>
            <Text style={{ marginHorizontal: 5 }}>-</Text>
            <Text>
              This Sales Quotation is accepted by the Client once the Sales Quotation is signed and
              the initial deposit paid.
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  
});
