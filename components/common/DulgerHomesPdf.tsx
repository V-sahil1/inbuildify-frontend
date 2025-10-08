"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const DulgerHomesPdf = ({ }) => {

    const PageLayout = ({ children }: { children: React.ReactNode }) => (
        <Page size="A4" style={styles.page}>
            <View style={styles.body}>{children}</View>
        </Page>
    );
    return (
        <Document>
            <PageLayout>
                <View>
                    <View style={styles.headerContainer}>
                        <View><Image src='/company-light.png' style={styles.logo}></Image></View>
                        <View><Text style={styles.headerText}>DULGER HOMES LANDSCAPING ACKNOWLEDGEMENT</Text></View>
                    </View>
                    <View style={{marginBottom:10}}><Text style={styles.secondaryText}>Congratulations on starting your Journey with Dulger homes. To get the best out of your new home, there are a few things to consider for your land. The below will outline the expectations of landscaping and the softscapes around your home.</Text></View>

                    <View style={{marginBottom:10}}><Text style={styles.secondaryText}>To achieve the best result, and to protect your home from unwanted damage, there are a number of gardening requirements for you to maintain.</Text></View>
                    <View>
                        <View style={styles.step}>
                            <Text>1. </Text>
                            <Text>Planting of trees and shrubs should be away from your slab. It is reccomended you plant trees at least 1.5 times the mature height away from any building, this will help to protect the slab from soil swelling/contraction due to trees.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text>2. </Text>
                            <Text>Where possible, providing an apron of concrete around your slab, with drainage being directed away from the home. This can be done by angling the concrete or providing drains to concreted areas.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text>3. </Text>
                            <Text>If you have any serious weather events, you should conduct a visual inspection of the outside of your home to check for any damage/blockages of drains, downpipes and any leaking fixtures/fittings. Failure to do so could lead to long term damage of your home. and could effect your structural warranty</Text>
                        </View>
                        <View style={styles.step}>
                            <Text>4. </Text>
                            <Text>you should never plant any trees/Shrubs directly against the slab, as the additional water may cause soil movement that could damage your home and void your structural warranty</Text>
                        </View>
                        <View style={styles.step}>
                            <Text>5. </Text>
                            <Text>As per the Residential housing code, a minimum of 20% of your total land size should allow for water to penetrate (percentages may differ on small lots). Concreting, or erecting further structure beyond this point may cause poor drainage and cause water to pond/pool against your home causing damage.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text>6. </Text>
                            <Text>all additional building works, landscaping or paving should comply with the CSIRO footing and foundation maintenance guide availiable online (and included in your new home welcome package). Failure to do so may void your new homes warranty.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text>7. </Text>
                            <Text>any additional works to your property should be conducted by a qualified professional, and each job should have some form of insurance included to protect you from the cost of repairs, should something go wrong.</Text>
                        </View>
                    </View>
                    <View style={{marginBottom:40}}>
                        <Text style={styles.secondaryText}>Please sign to ackowledge the above items, By signing this you acknowledge that you have been given a copy of the CSIRO footing and foundation guide and will remedy any issues as soon as the problem occurs. Failure to do so may void your structural warranty.</Text>
                    </View>
                    <View style={styles.section}>
                        <View><Text>Client name:_______________________</Text></View>
                        <View><Text>Signature:_______________________</Text></View>
                    </View>
                    <View style={styles.section}>
                        <View><Text>Client name:_______________________</Text></View>
                        <View><Text>Signature:_______________________</Text></View>
                    </View>
                </View>
            </PageLayout>
        </Document>
    )
};
export default DulgerHomesPdf;
const styles = StyleSheet.create({
    page: {
        paddingTop: 70,
        paddingBottom: 65,
        paddingHorizontal: 60,
        backgroundColor: "#fff",
        flexDirection: "column",
        fontFamily: "Helvetica",
    },
    body: { paddingTop: 10, flex: 1 },
    logo: { width: 120, height: 50, objectFit: "contain"},
    headerContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:20,
    marginRight:30
    },
    headerText:{
    fontSize:20,
    textAlign:'center',
    width:330
    },
    secondaryText:{
    fontSize:10,
    textAlign:'center'
    },
    section:{
        flexDirection:'row',
        justifyContent:'space-between',
        fontSize:10,
        marginBottom:50
    },
    step:{
        flexDirection:'row',
        fontSize:10,
        marginBottom:15
    }
});
