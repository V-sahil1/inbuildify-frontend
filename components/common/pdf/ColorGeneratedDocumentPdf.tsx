'use client';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/1PTSg8zYS_SKfqw6.ttf' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/1PTSg8zYS_SKfqw6.ttf', fontWeight: 'bold' },
    ],
});

interface ColorItem {
    key: string;
    image: string;
    categoryName: string;
    itemCode: string;
    supplierName: string;
    costType: string;
    // ... any other fields
}

interface ColorGeneratedDocumentPdfProps {
    data: ColorItem[];
    address: string;
}

const ColorGeneratedDocumentPdf = ({ data, address }: ColorGeneratedDocumentPdfProps) => {

    const Header = () => (
        <View style={styles.header}>
            {/* Logo Placeholder - InSimplify Text for now or use the logo URL if available */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}><Text style={{ color: '#d32f2f' }}>In</Text>Simplify</Text>
                <Text style={styles.logoSubText}>Technologies for Leading Builders</Text>
            </View>

            <Text style={styles.docTitle}>COLOR SCHEDULE</Text>
            <Text style={styles.docAddress}>{address}</Text>
            <View style={styles.divider} />
        </View>
    );

    const ItemBlock = ({ item }: { item: ColorItem }) => (
        <View style={styles.itemContainer} wrap={false}>
            {/* Left: Image */}
            <View style={styles.imageContainer}>
                {item.image ? (
                    <Image src={item.image} style={styles.itemImage} />
                ) : (
                    <View style={styles.noImage}>
                        <Text style={styles.noImageText}>NO IMAGE</Text>
                    </View>
                )}
            </View>

            {/* Right: Info Table */}
            <View style={styles.infoTable}>
                {/* Row 1: Category / Name */}
                <View style={[styles.tableRow, styles.tableRowTop]}>
                    <Text style={styles.tableCellContentBold}>{item.categoryName}</Text>
                </View>

                {/* Row 2: Item Code */}
                <View style={styles.tableRow}>
                    <View style={styles.labelCol}>
                        <Text style={styles.tableLabel}>Item Code</Text>
                    </View>
                    <View style={styles.valueCol}>
                        <Text style={styles.tableCellContent}>{item.itemCode}</Text>
                    </View>
                </View>

                {/* Row 3: Supplier */}
                <View style={styles.tableRow}>
                    <View style={styles.labelCol}>
                        <Text style={styles.tableLabel}>Supplier</Text>
                    </View>
                    <View style={styles.valueCol}>
                        <Text style={styles.tableCellContent}>{item.supplierName}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const groupedData = data.reduce((acc, item) => {
        const cat = item.categoryName || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, ColorItem[]>);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Header />
                <View style={styles.body}>
                    {Object.entries(groupedData).map(([category, items]) => (
                        <View key={category} style={styles.section}>
                            <Text style={styles.sectionTitle}>{category.toUpperCase()}</Text>
                            {items.map((item) => (
                                <ItemBlock key={item.key} item={item} />
                            ))}
                        </View>
                    ))}
                </View>
                <View style={styles.pageBorder} fixed />
            </Page>
        </Document>
    );
};

export default ColorGeneratedDocumentPdf;

const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingBottom: 40,
        paddingHorizontal: 40,
        backgroundColor: '#fff',
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    pageBorder: {
        position: 'absolute',
        top: 15,
        left: 15,
        right: 15,
        bottom: 15,
        borderWidth: 1,
        borderColor: '#000',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoSubText: {
        fontSize: 8,
        color: '#666',
        marginTop: 2,
    },
    docTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    docAddress: {
        fontSize: 11,
        marginBottom: 10,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomStyle: 'dashed', // Dashed line in image
    },
    body: {
        flex: 1,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    imageContainer: {
        width: 120, // Adjust based on image
        height: 80,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    noImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noImageText: {
        fontSize: 8,
        color: '#ccc',
        textAlign: 'center',
    },
    infoTable: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        minHeight: 20,
    },
    tableRowTop: {
        backgroundColor: '#fff', // Or any header bg
    },
    labelCol: {
        width: '30%',
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        justifyContent: 'center',
    },
    valueCol: {
        width: '70%',
        padding: 5,
        justifyContent: 'center',
    },
    tableLabel: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    tableCellContent: {
        fontSize: 9,
    },
    tableCellContentBold: {
        fontSize: 9,
        fontWeight: 'bold',
        padding: 5,
    },
});