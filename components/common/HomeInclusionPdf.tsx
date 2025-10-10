"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const HomeInclusionPdf = ({ }) => {

    const data = [
        {
            label: 'SiteCosts And Connections',
            points: [
                'Site cost & connection based on land size up to 450m2, and up to 300mm fall overbuilding',
                'Excludes electricity, water tap and telephone costumer account opening fees.',
                'kkkk'
            ]
        },
        {
            label: ' External Features',
            points: [
                'Facades as per design',
                'Rendering at the front pillars',
                'Timber look garage door',
                'Exposed driveway',
                'Exposed walkway to front'
            ]
        },
        {
            label: 'Internal Feature',
            points: [
                '3m High ceiling',
                '3 coat paint Dulux',
                '2 coat paint ceiling',
                'Metal look door stoppers'
            ]
        },
        {
            label: 'Doors',
            points: [
                '2040 mm x 920 mm Entry door',
                'Laundry external sliding Aluminum door 2100x1450',
                'Stacker Aluminum door to Alfresco 2100x2700'
            ]
        },
        {
            label: 'Door furniture',
            points: [
                'Gainsborough terrace to remaining external doors',
                'Lemar lever door handles to internal doors throughout',
                'Tri lock lever to front door'
            ]
        },
        {
            label: 'Robes and Linen',
            points: [
                'Sliding mirrored doors robes to entire house as per plan',
                'Partition and sliding door in WIR as per plan',
                'Master bedroom WIR (1 hanging, 4 boxes and set of drawers)',
                'Robe sizes 820x2040'
            ]

        },
        {
            label: 'Laundry',
            points: [
                'broom cupboard',
                '45-litre laundry sink and tap',
                'bottom cabinet',
                'Laundry sink with 20mm stone (builders range)'
            ]
        },
        {
            label: 'Bathroom and Ensuite',
            points: [
                'Custom made laminated cabinets',
                'Double vanity in ensuite',
                'Semi framed shower glass',
                'Large vanity mirror or 2 singles with polished raised edge'
            ]
        },
        {
            label: ' Kitchen',
            points: [
                'Standard door handles from category 1 range-soft close',
                '20mm stone bench top (builders range)',
                'Microwave space',
                '2 bank of drawer (top drawer with cutlery insert)'
            ]
        },

        {
            label: ' Paint work',
            points: [
                'Gloss enamel to the Entrance door',
                'Low sheen acrylic to external timberwork and external doors',
                'Flat acrylic to ceilings',
                'Washable acrylic to internal walls'
            ]
        },

        {
            label: 'Electrical',
            points: [
                'Earth leakage electrical safety switch to lights and power point',
                'RCD safety switch with circuit breaker to the meter box',
                'HPM white plates to switch',
                'L.E.D Screen Intercom'
            ]
        },

        {
            label: 'Garage',
            points: [
                'Plaster board ceiling to garage',
                'Garage height max 2210x4800',
                '75mm plaster cove cornice to garage',
                'Remote control roller door with timber look (double garage)'
            ]
        },

        {
            label: 'Floor Covering',
            points: [
                'Timber laminated flooring 12 mm throughout the house or carpet $80 Per Linear m.',
                'Porcelain Tiles 600x600 up to $25 per sqm in wet areas only'
            ]
        },
    ]

    const ImportantNotes = [
        'Our Suppliers use quality materials in the manufacturing process of your splash-back in accordance to Australian Standards',
        'GlassSplashbacks may be subjected to colour variation conditional in different light condition; this is due to the iron content in the glass.',
        'Breakage cannot be a process of warranty, as it can be due to impact or spontaneous breakage. Spontaneous breakage is a very rare occurrence which is caused by the formation of nickel sulphide (Minutes impurities in glass) which occurs in the manufacturing process of all toughened glass. No toughened glass can be guaranteed against spontaneous breakage.',
        'Recommended the product not be installed next to a high flame cooking area as this may cause the paint to discolour.',
        'Gas burners less than 140mm from the centre of the burner to the glass and utensils “Resting” against splashback will void the warranty.',
        'Prolonged cooking at extreme temperature can still cause paint burning discoloration.',
        'Silicon is applied to all edges for sealing, expansion, and contraction. The use of strong chemical cleaning agent may cause discolouring of these seals.'
    ]
    const Footer = () => (
        <View style={styles.footerWrapper} fixed>
            <Text style={styles.footerDate}>30 Sep 2025</Text>
            <Text style={styles.footerPageNum}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
        </View>
    );

    const Header = () => (
        <View style={styles.headerContainer} fixed>
            <Image
                src="/company-light.png"
                style={styles.logo}
            />
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
                <View style={styles.TitleText}><Text>My Home Inclusions</Text></View>
                <View>
                    {data.map((item) => (
                        <View style={{ marginHorizontal: 10 }}>
                            <View><Text style={styles.headerText}>{item.label}</Text></View>
                            <View style={{ marginLeft: 5 }}>
                                {item.points.map((point) => (
                                    <View style={styles.secondaryText}>
                                        <Text style={{ marginHorizontal: 10 }}>-</Text>
                                        <Text >{point}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                    <View style={{ marginHorizontal: 10 }}>
                        <View><Text style={styles.headerText}>Important Notes</Text></View>
                        <View style={{ marginLeft: 5 }}>
                            {ImportantNotes.map((point) => (
                                <View style={styles.secondaryText}>
                                    <Text style={{ marginHorizontal: 10 }}>-</Text>
                                    <Text >{point}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </PageLayout>
        </Document>
    )
};

export default HomeInclusionPdf;

const styles = StyleSheet.create({
    page: {
        paddingTop: 20,
        paddingBottom: 65,
        paddingHorizontal: 35,
        backgroundColor: "#fff",
        flexDirection: "column",
        fontFamily: "Helvetica",
    },
    body: { paddingTop: 10, flex: 1 },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 6,
    },
    TitleText: {
        fontSize: 15,
        alignItems: "center",
        fontWeight: "bold",
        marginBottom: 25
    },
    logo: {
        width: 120,
        height: 50,
        objectFit: "contain"
    },
    headerText: {
        fontSize: 10,
        textAlign: "left",
        fontWeight: "bold",
        marginBottom: 10
    },
    secondaryText: {
        fontSize: 10,
        textAlign: "left",
        marginBottom: 10,
        marginRight: 35,
        flexDirection: 'row'
    },
    footerWrapper: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
    },
    footerDate: {
        fontSize: 9,
        color: "#000",
        width: "45%",
        textAlign: "left",
    },
    footerPageNum: {
        fontSize: 9,
        color: "#000",
        width: "50%",
        textAlign: "left",
    },
});
