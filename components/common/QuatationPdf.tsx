"use client";
import { formatDate } from "@lib/utils/formatDate";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { User } from "@redux/feature/auth/IAuthState";
import { IFacadeState } from "@redux/feature/facade/IFacadeState";
import { IFloorPlanState } from "@redux/feature/floorPlan/IFloorPlanState";
import { Package } from "@redux/feature/package/IPackageState";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1pt solid #ccc",
    paddingBottom: 6,
  },
  headerLogo: { width: 80, height: 30, objectFit: "contain" },
  headerTextContainer: { flexDirection: "column", alignItems: "flex-end" },
  headerTitle: { fontSize: 12, fontWeight: "bold", color: "#000" },
  headerSlogan: { fontSize: 10, color: "#666" },
  backgroundImage: {
    width: "100%",
    height: "50%",
    objectFit: "cover",
  },
  content: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  logo: { width: 160, height: 60, marginBottom: 10, objectFit: "contain" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5, color: "#000" },
  slogan: { fontSize: 14, marginBottom: 8, color: "#444" },
  email: { fontSize: 12, color: "#1D4ED8" },
  section: {
    marginTop: 20,
    padding: 20,
    border: "1pt solid #ddd",
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1D4ED8",
    textTransform: "uppercase",
  },
  row: { flexDirection: "row", marginBottom: 6 },
  label: {
    width: "35%",
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
  },
  value: { fontSize: 11, color: "#555", flexShrink: 1 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#444",
    textAlign: "center",
    borderTop: "1pt solid #ccc",
    paddingTop: 6,
  },
});

interface QuatationPdfProps {
  user: User;
  leadDetail: any;
  propertyDetail: any;
  facade: IFacadeState;
  quotePackage: Package;
  backgroundImg?: string;
  floorPlan: IFloorPlanState;
}

export const QuatationPdf = ({
  user,
  leadDetail,
  quotePackage,
  propertyDetail,
  floorPlan,
  facade,
  backgroundImg = "https://i.postimg.cc/KYZDbwxQ/Hexagonal-Facade-Design-2-Large-2.jpg",
}: QuatationPdfProps) => {
  const Footer = () => {
    return (
      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `${user?.email} • ${formatDate(
            new Date()
          )} • Page ${pageNumber} of ${totalPages}`
        }
        fixed
      />
    );
  };

  const Header = () => {
    return (
      <View style={styles.header} fixed>
        <Image src={user?.logo} style={styles.headerLogo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{user?.firmName}</Text>
          <Text style={styles.headerSlogan}>{user?.slogen}</Text>
        </View>
      </View>
    );
  };

  const PageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={{ padding: 80 }}>{children}</View>
        <Footer />
      </Page>
    );
  };

  const TitleOfPage = ({ title }: { title: string }) => {
    return (
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        {title}
      </Text>
    );
  };

  return (
    <Document>
      {/* Page 1: Company Info */}
      <Page size="A4" style={styles.page}>
        <Image src={backgroundImg} style={styles.backgroundImage} />
        <View style={styles.content}>
          <Image src={user?.logo} style={styles.logo} />
          <Text style={styles.title}>{user?.firmName}</Text>
          <Text style={styles.slogan}>{user?.slogen}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <Footer />
      </Page>

      {/* Page 2: Property Details Page */}
      <PageLayout>
        <TitleOfPage title="Quotation" />

        <Text style={{ fontSize: 11, marginBottom: 20 }}>To,</Text>
        <Text style={{ fontSize: 11, marginBottom: 20 }}>
          {leadDetail?.name}
        </Text>

        <Text style={{ fontSize: 11, marginBottom: 8 }}>
          Project: Two story house
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 8 }}>
          Address: {propertyDetail?.address1}, {propertyDetail?.citySuburb}
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 8 }}>
          Lot: {propertyDetail?.propertyId?.slice(0, 3)} DP:{" "}
          {propertyDetail?.propertyId?.slice(-7)}
        </Text>

        <Text style={{ fontSize: 11, marginTop: 15, marginBottom: 8 }}>
          Lot Size: {propertyDetail?.totalSizeM2} Sq M
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 20 }}>
          Construction Area: {propertyDetail?.widthM / 100} Sq M
        </Text>

        {/* <Text style={{ fontSize: 11, marginBottom: 8 }}>
            Tender amount: AUD 598700.00
          </Text>
          <Text style={{ fontSize: 11, marginBottom: 40 }}>
            Five Hundred Ninety-Eight Thousand Seven Hundred.
          </Text>*/}

        <Text style={{ fontSize: 10, marginTop: 60 }}>
          Owner&apos;s Initials.................
        </Text>
      </PageLayout>

      {/* Page 3: Package Details */}
      <PageLayout>
        <TitleOfPage title="Package Details" />

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Package Name:</Text>
            <Text style={styles.value}>{quotePackage?.name || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>
              AUD {quotePackage?.amount || "0.00"}
            </Text>
          </View>
        </View>

        {quotePackage?.categoryItemDescriptions?.length > 0 && (
          <View style={{ marginTop: 25 }}>
            <Text
              style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}
            >
              Inclusions / Descriptions:
            </Text>
            {quotePackage.categoryItemDescriptions.map(
              (desc: string, index: number) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", marginBottom: 6 }}
                >
                  <Text style={{ fontSize: 11, marginRight: 6 }}>•</Text>
                  <Text style={{ fontSize: 11, flex: 1 }}>{desc}</Text>
                </View>
              )
            )}
          </View>
        )}
      </PageLayout>

      {/* Page: Floor Plan */}
      <PageLayout>
        <TitleOfPage title={`Floor Plan – ${floorPlan?.name}`} />

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#666",
            marginBottom: 20,
          }}
        >
          Floor Plan – {floorPlan?.name}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#666",
            marginBottom: 20,
          }}
        >
          {floorPlan?.rangeName} Collection –{" "}
          {floorPlan?.dwellingTypeName?.replace("_", " ")}
        </Text>

        <Image
          src={floorPlan?.image}
          style={{
            width: "100%",
            height: 280,
            objectFit: "contain",
            marginBottom: 20,
          }}
        />

        <Text
          style={{
            fontSize: 12,
            marginBottom: 12,
            lineHeight: 1.5,
            color: "#333",
          }}
        >
          The <Text style={{ fontWeight: "bold" }}>{floorPlan?.name}</Text> is a{" "}
          <Text style={{ fontWeight: "bold" }}>
            {floorPlan?.dwellingTypeName?.replace("_", " ")}
          </Text>{" "}
          design offering{" "}
          <Text style={{ fontWeight: "bold" }}>{floorPlan?.beds} bedrooms</Text>
          ,{" "}
          <Text style={{ fontWeight: "bold" }}>
            {floorPlan?.bath} bathrooms
          </Text>
          , and{" "}
          <Text style={{ fontWeight: "bold" }}>
            {floorPlan?.carPark} car parks
          </Text>
          . This home spans a total of{" "}
          <Text style={{ fontWeight: "bold" }}>
            {floorPlan?.totalSqft} sqft
          </Text>
          , with dimensions of {floorPlan?.widthMeter}m wide by{" "}
          {floorPlan?.depthMeter}m deep.
        </Text>

        <Text style={{ fontSize: 12, lineHeight: 1.5, color: "#333" }}>
          Featuring a modern layout that includes a{" "}
          {floorPlan?.garage ? "spacious garage, " : ""}
          {floorPlan?.porch ? "welcoming porch, " : ""}
          {floorPlan?.alfresco ? "outdoor alfresco area, " : ""}
          this home is designed for both comfort and functionality.
        </Text>
      </PageLayout>

      {/* Facade information */}
      <PageLayout>
        <TitleOfPage title={`Facade - ${facade?.name}`} />

        {/* Dwelling Type */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#666",
            marginBottom: 20,
          }}
        >
          {facade?.dwellingTypeName?.replace("_", " ")}
        </Text>

        {/* Facade Image */}
        <Image
          src={facade?.image}
          style={{
            width: "100%",
            height: 280,
            objectFit: "contain",
            marginBottom: 20,
            borderRadius: 8,
            border: "1pt solid #ddd",
          }}
        />

        {/* Descriptive Text */}
        <Text
          style={{
            fontSize: 12,
            marginBottom: 12,
            lineHeight: 1.5,
            color: "#333",
          }}
        >
          The <Text style={{ fontWeight: "bold" }}>{facade?.name}</Text> is a{" "}
          <Text style={{ fontWeight: "bold" }}>
            {facade?.dwellingTypeName?.replace("_", " ")}
          </Text>{" "}
          style facade that blends modern design with practicality. This facade
          option is{" "}
          {facade?.standard ? "included as standard" : "available as upgrade"}{" "}
          with the home design and can be further customized to suit your style
          preferences.
        </Text>

        {/* Standard / Upgrade flags */}
        <View style={{ marginTop: 15 }}>
          {facade?.standard && (
            <Text style={{ fontSize: 11, marginBottom: 6 }}>
              ✔ Standard Option Included
            </Text>
          )}
          {facade?.upgrade && (
            <Text style={{ fontSize: 11, marginBottom: 6 }}>
              ⬆ Available as an Upgrade
            </Text>
          )}
        </View>
      </PageLayout>

      {/* Acceptance */}
      <PageLayout>
        <TitleOfPage title="ACCEPTANCE" />

        <Text style={{ fontSize: 12, marginBottom: 10 }}>
          1. We accept this tender as per the inclusions stated herein.
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 20 }}>
          2. In the event that the client or builder don’t enter into the
          building contract, any deposit paid will be non-refundable.
        </Text>

        <Text style={{ fontSize: 12, marginBottom: 25 }}>
          I have read and understood the tender and hereby accept the tender.
        </Text>

        <Text style={{ fontSize: 12, marginBottom: 8 }}>
          Client's Signature
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 20 }}>
          NAME: ............................................................
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 25 }}>
          Sign: ................................................ Date:
          ................................................
        </Text>

        {/* Second Client (if multiple) */}
        <Text style={{ fontSize: 12, marginBottom: 20 }}>
          Sign: ................................................ Date:
          ................................................
        </Text>

        {/* Builder Section */}
        <Text style={{ fontSize: 12, marginBottom: 8 }}>
          Builder’s Signatures
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>
          {user?.firmName}
        </Text>
        <Text style={{ fontSize: 12, marginTop: 10 }}>
          Sign: ................................................ Date:
          ................................................
        </Text>
      </PageLayout>
    </Document>
  );
};

export default QuatationPdf;
