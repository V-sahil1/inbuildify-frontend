import { View, StyleSheet, Text } from '@react-pdf/renderer';

export const HomeInclusion = ({ data, ImportantNotes, isjobDocument }) => {
  return (
    <>
      <View style={styles.TitleText}>
        <Text>My Home Inclusions</Text>
      </View>
      <View>
        {data.map((item, index) => (
          <View key={index} style={{ marginHorizontal: 10 }}>
            <View>
              <Text style={isjobDocument ? styles.subHeader : styles.headerText}>{item.label}</Text>
            </View>
            <View style={{ marginLeft: 5 }}>
              {item.points.map((point, index) => (
                <View key={index} style={styles.secondaryText}>
                  <Text style={{ marginHorizontal: 10 }}>-</Text>
                  <Text>{point}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        <View style={{ marginHorizontal: 10 }}>
          <View>
            <Text style={isjobDocument ? styles.subHeader : styles.headerText}>
              Important Notes
            </Text>
          </View>
          <View style={{ marginLeft: 5 }}>
            {ImportantNotes.map((point, index) => (
              <View key={index} style={styles.secondaryText}>
                <Text style={{ marginHorizontal: 10 }}>-</Text>
                <Text>{point}</Text>
              </View>
            ))}
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
    marginRight: 35,
    flexDirection: 'row',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E3A8A',
    color: 'white',
    padding: 3,
    fontSize: 10,
    textAlign: 'left',
  },
});
