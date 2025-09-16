"use client";
import { numberToWords } from "@lib/utils/convertNumberToWords";
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

interface QuatationPdfProps {
  user: User;
  leadDetail: any;
  propertyDetail: any;
  facade: IFacadeState;
  quotePackage: Package;
  quotationAmount: number;
  floorPlan: IFloorPlanState;
  items: any;
}

export const QuatationPdf = ({
  user,
  leadDetail,
  quotePackage,
  propertyDetail,
  floorPlan,
  facade,
  quotationAmount,
  items,
}: QuatationPdfProps) => {

  const nonPackageItems = items?.map(category => ({
    ...category,
    items: category.items.filter(item => !quotePackage?.categoryItemIds?.includes(item.categoryItemId))
  }));

  const packageItems = items?.map(category => ({
    ...category,
    items: category.items.filter(item => quotePackage?.categoryItemIds?.includes(item.categoryItemId))
  }));
  const Footer = () => {
    return (
      <View style={styles.footerWrapper} fixed>
        {/* Top White Row */}
        <View style={styles.footerTop}>
          <Text style={styles.footerTopText}>{formatDate(new Date())}</Text>
          <Text
            style={styles.footerTopText}
            render={({ pageNumber }) => `Page ${pageNumber}`}
          />
          <Text style={styles.footerTopText}>Initial................ / ................</Text>
        </View>

        {/* Bottom Blue Row */}
        <View style={styles.footerBottom}>
          {/* Phone */}
          {
            user?.phoneNumber && (
              <View style={styles.footerItem}>
                <Image
                  src="https://img.icons8.com/ios-filled/50/e63946/phone.png"
                  style={styles.footerIconImg}
                />
                <Text style={styles.footerText}>{user?.phoneNumber}</Text>
              </View>
            )
          }

          {/* Email */}
          {
            user?.email && (
              <View style={styles.footerItem}>
                <Image
                  src="https://img.icons8.com/ios-filled/50/e63946/new-post.png"
                  style={styles.footerIconImg}
                />
                <Text style={styles.footerText}>{user?.email}</Text>
              </View>
            )
          }
        </View>
      </View>
    );
  };

  const Header = () => {
    return (
      <View style={styles.header} fixed>
        <Image src={user?.logo} style={styles.headerLogo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{user?.licenseNumber && ("Lic No : " + user?.licenseNumber)}</Text>
          <Text style={styles.headerSlogan}>{user?.abnNumber && ("ABN : " + user?.abnNumber)}</Text>
        </View>
      </View>
    );
  };

  const Watermark = () => {
    return (
      <View style={styles.watermarkWrapper} fixed>
        <Image src={user?.logo} style={styles.watermarkImage} />
      </View>
    );
  };

  const PageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <Page size="A4" style={styles.page}>
        <Header />
        <Watermark />
        <View style={styles.contentWrapper}>{children}</View>
        <Footer />
      </Page>
    );
  };

  // Helper component for creating lists with a title
  const ListWithTitle = ({ title, list, description, imageSrc }: { title?: string; list?: string[], description?: string | string[], imageSrc?: string }) => (
    <View style={Page3styles.section}>
      {
        title && (
          <Text style={Page3styles.SubHeading}>{title}</Text>
        )
      }
      {/* Row container for list + image */}
      <View style={Page3styles.row}>
        {/* Left column (list + description) */}
        <View style={Page3styles.leftCol}>
          {list?.map((item, i) => (
            <View key={i} style={Page3styles.listItem}>
              <Text style={Page3styles.bullet}>•</Text>
              <Text style={Page3styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
        {/* Right column (image) */}
        {imageSrc && (
          <>
            <View style={Page3styles.rightCol}>
              <Image src={imageSrc} style={Page3styles.image} />
            </View>
          </>
        )}
      </View>

      {Array.isArray(description) ?
        (
          description?.map((item, i) => (
            <View key={i} style={Page3styles.listItem}>
              <Text style={Page3styles.listText}>{item}</Text>
            </View>
          ))
        ) : (
          <View style={Page3styles.listItem}>
            <Text style={Page3styles.listText}>{description}</Text>
          </View>
        )
      }
    </View>
  );

  return (
    <Document>
      {/* Page 1: Introduction */}
      <PageLayout>
        <View style={Page1styles.page}>
          {/* Date */}
          <View style={Page1styles.row}>
            <Text style={Page1styles.label}>Date</Text>
            <Text style={Page1styles.colon}>:</Text>
            <Text style={Page1styles.value}>{formatDate(new Date())}</Text>
          </View>

          {/* Dear */}
          <View style={Page1styles.row}>
            <Text style={Page1styles.label}>Dear</Text>
            <Text style={Page1styles.colon}>:</Text>
            <Text style={Page1styles.value}>{leadDetail?.name || "-"}</Text>
          </View>

          {/* Body */}
          <View style={Page1styles.body}>
            <Text style={Page1styles.paragraph}>
              Thank you for your recent enquiry and for the opportunity to work
              collaboratively throughout the negotiation process. {user?.firmName || "-"} is
              pleased to present the premium tender proposal for the Double-Storey
              Home,
            </Text>

            <Text style={Page1styles.paragraph}>
              We respectfully submit the following proposal for your consideration.
            </Text>

            <Text style={Page1styles.paragraph}>
              Please note that any requested upgrades, design amendments, or
              modifications to the inclusions will be clearly documented and itemized
              as variations in the final tender contract.
            </Text>

            <Text style={Page1styles.paragraph}>
              We look forward to the possibility of partnering with you to deliver a
              high-quality result that meets your expectations.
            </Text>

            <Text style={Page1styles.paragraph}>Warm regards,</Text>
          </View>

          {/* Signature */}
          <View style={Page1styles.signature}>
            <Text style={Page1styles.name}>{user?.name || ""}</Text>
            <Text style={Page1styles.position}>Director</Text>
            {
              user?.phoneNumber && (
                <Text style={Page1styles.phone}>Ph No. {user?.phoneNumber || ""}</Text>
              )
            }
          </View>
        </View>
      </PageLayout>

      {/* Page 2: Client & Project Details */}
      <PageLayout>
        <View style={Page2styles.table}>
          {/* DATE + QUOTE NO (4 columns) */}
          <View style={Page2styles.row}>
            <Text style={[Page2styles.cell, Page2styles.col25]}>DATE</Text>
            <Text style={[Page2styles.cell, Page2styles.col25]}>{formatDate(new Date())}</Text>
          </View>

          {/* CLIENT 1 (2 columns) */}
          <View style={Page2styles.row}>
            <Text style={[Page2styles.cell, Page2styles.col25]}>CLIENT</Text>
            <View style={[Page2styles.cell, Page2styles.col75]}>
              <Text>Name: {leadDetail?.name || "-"}</Text>
              <Text>Email: <Text style={Page2styles.boldText}>{leadDetail?.email || "-"}</Text></Text>
              <Text>Mobile: +61 {leadDetail?.phone || "-"}</Text>
            </View>
          </View>

          {/* CLIENT 2 (2 columns) */}
          {/* <View style={Page2styles.row}>
            <Text style={[Page2styles.cell, Page2styles.col25]}>CLIENT 2</Text>
            <View style={[Page2styles.cell, Page2styles.col75]}>
              <Text>Name:</Text>
              <Text>Email:</Text>
              <Text>Mobile:</Text>
              <Text>Address:</Text>
            </View>
          </View> */}

          {/* PROJECT ADDRESS */}
          <View style={Page2styles.row}>
            <Text style={[Page2styles.cell, Page2styles.col25]}>PROJECT ADDRESS</Text>
            <Text style={[Page2styles.cell, Page2styles.col75]}>
              {`${propertyDetail?.address1 || ""} ${propertyDetail?.address2 || ""}, ${propertyDetail?.citySuburb || ""}, ${propertyDetail?.stateRegion || ""} ${propertyDetail?.zipPostalCode || ""}, ${propertyDetail?.country || ""}`}
            </Text>
          </View>

          {/* DESCRIPTIONS */}
          <View style={Page2styles.row}>
            <Text style={[Page2styles.cell, Page2styles.col25]}>DESCRIPTIONS</Text>
            <View style={[Page2styles.cell, Page2styles.col75]}>
              <Text style={Page2styles.boldText}>
                Construction of a {floorPlan?.dwellingTypeName?.replace("_", " ")} Home
              </Text>

              <Text style={Page2styles.paragraph}>
                {floorPlan?.dwellingTypeName?.replace("_", " ")} home with {floorPlan?.beds} bedrooms, {floorPlan?.bath} bathrooms, {floorPlan?.carPark} car parking and {floorPlan?.garage} garage.
              </Text>
              <Text style={Page2styles.paragraph}>
                Total covered area approx. {Number(floorPlan?.totalSqft).toFixed(0)} Sq ft.
              </Text>

              <Text>
                The construction includes concrete slab, timber frame, brick veneer walls with concrete tiled or steel fabricated roof.
              </Text>
            </View>
          </View>


          {/* TOTAL COST */}
          <View style={Page2styles.row}>
            <Text style={[Page2styles.cell, Page2styles.col25]}>TOTAL QUOTATION COST</Text>
            <View style={[Page2styles.cell, Page2styles.col75]}>
              <Text>${quotationAmount}</Text>
              <Text>{numberToWords(quotationAmount)}</Text>
              <Text>All prices are GST inclusive</Text>
            </View>
          </View>

          {/* ADDITIONAL NOTES */}
          {/* <View style={Page2styles.row}>
            <Text style={[Page2styles.cell, Page2styles.col25]}>ADDITIONAL NOTES</Text>
            <View style={[Page2styles.cell, Page2styles.col75]}>
              <Text>Provisional allowance Including as per following</Text>
              <Text>Additional site costs: $25,000</Text>
              <Text>Landscaping fencing and blinds: $15,000</Text>
            </View>
          </View> */}
        </View>
      </PageLayout>

      <PageLayout>
        {/* Lead Detail Section */}
        <ListWithTitle
          title="Lead Details"
          list={[
            `Name: ${leadDetail?.name}`,
            `Email: ${leadDetail?.email}`,
            `Phone: +61 ${leadDetail?.phone}`,
            // `Status: ${leadDetail?.status?.replace("_", " ")}`,
            // `Lead Source: ${leadDetail?.leadSource}`,
            // `Created At: ${new Date(leadDetail?.created_at).toLocaleDateString()}`,
            // `Updated At: ${new Date(leadDetail?.updated_at).toLocaleDateString()}`
          ]}
        />

        <ListWithTitle
          title="Property Details"
          list={[
            `Estate Name: ${propertyDetail?.estateName}`,
            `Project Address: ${propertyDetail?.address1} ${propertyDetail?.address2}, ${propertyDetail?.citySuburb}, ${propertyDetail?.stateRegion} ${propertyDetail?.zipPostalCode}, ${propertyDetail?.country}`,
            `Title Status: ${propertyDetail?.titleStatus}`,
            `Title Date: ${new Date(propertyDetail?.titleDate).toLocaleDateString()}`,
            `Land Type: ${propertyDetail?.landType}`,
            `Width: ${propertyDetail?.widthM} m`,
            `Depth: ${propertyDetail?.depthM} m`,
            `Total Size: ${propertyDetail?.totalSizeM2} m²`,
            `Site Fall: ${propertyDetail?.siteFallMm} mm`,
            `Land Fill: ${propertyDetail?.landFillMm} mm`,
            `Bush Fire: ${propertyDetail?.bushFire ? "Yes" : "No"}`,
            `Corner Block: ${propertyDetail?.cornerBlock ? "Yes" : "No"}`
          ]}
        />

        <ListWithTitle
          title="Floor Plan Details"
          list={[
            `Name: ${floorPlan?.name}`,
            `Range: ${floorPlan?.rangeName}`,
            `Dwelling Type: ${floorPlan?.dwellingTypeName?.replace("_", " ")}`,
            `Bedrooms: ${floorPlan?.beds}`,
            `Bathrooms: ${floorPlan?.bath}`,
            `Car Parks: ${floorPlan?.carPark}`,
            `Garage: ${floorPlan?.garage}`,
            `Porch: ${floorPlan?.porch} m²`,
            `Alfresco: ${floorPlan?.alfresco} m²`,
            `Width: ${floorPlan?.widthMeter} m`,
            `Depth: ${floorPlan?.depthMeter} m`,
            `Dwelling: ${floorPlan?.dwelling}`,
            `Total Area: ${floorPlan?.totalSqft} Sqft`
          ]}
          imageSrc={floorPlan?.image}
        />

        {/* Facade Detail Section */}
        <View style={{ marginTop: 15 }}>
          <ListWithTitle
            title="Facade Details"
            list={[
              `Name: ${facade?.name}`,
              `Dwelling Type: ${facade?.dwellingTypeName?.replace("_", " ")}`,
              `Standard: ${facade?.standard ? "Yes" : "No"}`,
              `Upgrade: ${facade?.upgrade ? "Yes" : "No"}`,
              `Cost: ${facade?.cost}`,
              // `Created At: ${new Date(facade?.createdAt).toLocaleDateString()}`,
              // `Updated At: ${new Date(facade?.updatedAt).toLocaleDateString()}`
            ]}
            imageSrc={facade?.image}
          />

          {quotePackage?.categoryItemIds?.length > 0 && (
            <View style={{ marginTop: 15 }}>
              <Text style={Page3styles.SubHeading}>Package Details</Text>
              {/* Package name is now outside the table */}
              <Text style={Page3styles.packageTitle}>{quotePackage?.name}</Text>

              <View style={ItemTable.table}>
                {/* Header with two columns */}
                <View style={[ItemTable.row, ItemTable.headerRow]}>
                  <Text style={[ItemTable.cell, ItemTable.col40]}>Item Name</Text>
                  <Text style={[ItemTable.cell, ItemTable.col15, ItemTable.centerText]}>Quantity</Text>
                </View>

                {/* Rows with two columns */}
                {packageItems
                  .map((cat) => cat.items)
                  .flat()
                  .map((item, i) => (
                    <View key={i} style={ItemTable.row}>
                      <Text style={[ItemTable.cell, ItemTable.col40]}>{item.description}</Text>
                      <Text style={[ItemTable.cell, ItemTable.col15, ItemTable.centerText]}>{item.quantity}</Text>
                    </View>
                  ))}

                {/* Total row with two columns and a span */}
                <View style={[ItemTable.row, ItemTable.totalRow]}>
                  <Text
                    style={[ItemTable.cell, ItemTable.col40, { borderRightWidth: 0 }]}
                  >
                    Package Amount
                  </Text>
                  {/* The amount will now span across the remaining width */}
                  <Text
                    style={[ItemTable.cell, ItemTable.col15, ItemTable.centerText, { borderLeftWidth: 1, borderRightWidth: 1 }]}
                  >
                    ${Number(quotePackage?.amount).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>


        <View style={{ marginTop: 10 }}>
        {nonPackageItems.length > 0 &&
            nonPackageItems
              ?.map((cat: any) => cat.items.length > 0)
              .includes(true) && (
              <Text style={Page3styles.SubHeading}>Quotation Items</Text>
            )}
          {nonPackageItems?.map((cat: any, catIndex: number) => (
            cat.items.length > 0 && (
              <View key={catIndex} style={{ marginBottom: 15 }}>
                <Text style={Page3styles.categoryHeading}>{cat.categoryName}</Text>
                {cat.description && (
                  <Text style={[Page3styles.description, { marginBottom: 15 }]}>
                    {cat.description}
                  </Text>
                )}
                <View style={ItemTable.table}>
                  <View style={[ItemTable.row, ItemTable.headerRow]}>
                    <Text style={[ItemTable.cell, ItemTable.col40]}>Description</Text>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>Qty</Text>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>Price</Text>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>Total</Text>
                  </View>
                  {cat.items.map((item: any, i: number) => (
                    <View key={i} style={ItemTable.row}>
                      <Text style={[ItemTable.cell, ItemTable.col40]}>
                        {item.description || item.shortDescription || "-"}
                      </Text>
                      <Text style={[ItemTable.cell, ItemTable.col15]}>{item.quantity}</Text>
                      <Text style={[ItemTable.cell, ItemTable.col15]}>
                        ${Number(item.price).toLocaleString()}
                      </Text>
                      <Text style={[ItemTable.cell, ItemTable.col15]}>
                        ${Number(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                  <View style={[ItemTable.row, ItemTable.totalRow]}>
                    <Text style={[ItemTable.cell, ItemTable.col40]}>Subtotal</Text>
                    <Text style={[ItemTable.cell, ItemTable.col15]} />
                    <Text style={[ItemTable.cell, ItemTable.col15]} />
                    <Text style={[ItemTable.cell, ItemTable.col15]}>
                      ${
                        Number(cat.items.reduce((sum, item) => sum + item.price * item.quantity, 0))
                      }
                    </Text>
                  </View>
                </View>
              </View>
            )
          ))}
        </View>

        {/* Final Total Section */}
        <View style={finalTotalStyles.container}>
          <Text style={finalTotalStyles.title}>Final Total Amount</Text>
          <View style={finalTotalStyles.row}>
            <Text style={finalTotalStyles.label}>Package Total:</Text>
            <Text style={finalTotalStyles.value}>${Number(quotePackage?.amount).toLocaleString()}</Text>
          </View>
          <View style={finalTotalStyles.row}>
            <Text style={finalTotalStyles.label}>Facade Total:</Text>
            <Text style={finalTotalStyles.value}>${Number(facade?.cost).toLocaleString()}</Text>
          </View>
          <View style={finalTotalStyles.row}>
            <Text style={finalTotalStyles.label}>Quotation Items Subtotal:</Text>
            <Text style={finalTotalStyles.value}>${Number(nonPackageItems.reduce((sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0)).toLocaleString()}</Text>
          </View>
          <View style={finalTotalStyles.divider} />
          <View style={finalTotalStyles.row}>
            <Text style={finalTotalStyles.label}>Grand Total:</Text>
            <Text style={finalTotalStyles.value}>${Number(quotationAmount).toLocaleString()}</Text>
          </View>
        </View>
      </PageLayout>

      {/* <PageLayout>
        <Text style={Page3styles.heading}>Inclusions</Text>
        <ListWithTitle
          title="Pre- Construction"
          list={[
            "Site inspection by a qualified surveyor to perform a contour survey",
            "Complete preliminary, Council DA drawings / CDC and final construction plans",
            "Structural Engineer plans for Council and construction",
            "Basix certification to State government requirements and assessment fees",
            "Preparation and submission of “statement of environmental effects” (if required by the council)",
            "Developer approval and application fees (where required)",
            "Standard Landscape plan (if required)",
            "HIA Contract preparations and signing",
            "Colour selections for exterior and interior works",
            "CDC submission has been allowed for in this tender with the private certifier. If a council development application is required, this council cost will be charged as a variation to the client.",
            "Lodgement of the plans to appropriate authorities",
            "Standard Sydney water inspection and drainage fees (excluding sewer “peg out” and encasement fees)",
            "Issuance of Construction insurance including Public Liability and Home Warranty Insurance (for single dwelling including granny flat) Please note home warranty insurance will vary for subdivision projects on case-by-case basis and will be quoted separately.",
            "Long service leave levy’s, Vehicle crossings & Road opening permit (Owner to pay)",
          ]}
        />
        <ListWithTitle
          title="Site Costs and Statutory Requirements"
          list={[
            "Erection of temporary fencing along the site boundary",
            "Site preparation and leveling including machine hire for excavation and construction of concrete waffle pod slab as per engineer’s plan",
            "Cut and fill up allowance up to 1m",
            "Concrete pump hire for slab & piering work",
            "Provide concrete piering to the allowance of 75 lineal meters (additional piering cost $125/LM plus GST). Due to the time constraints associated with piering and footings these variations will be handled differently to other variations. It is impractical to stop the process of piering and footing whilst the customer’s authorisation is obtained and accordingly the customer will accept all charges.",
            "For the purpose of this tender Zircon Homes will complete an even cut and fill up to 1m of site fall. (excludes soil removal, import of fill, dropped edge beams, rock excavation, ",
            " garage step down and retaining wall if required) . If additional dirt needs to be removed, it will be charged at $650 + GST per truck load. Uncontaminated dirt is the only dirt Zircon Homes can remove off site, if the dirt is classified as contaminated the client will be notified and additional cost of removing the dirt will be charged as a variation. ",
            "Drop Edge Beams – For the purpose of this tender no drop edge beam has been allowed for. Should drop edge beams be required to the slab, they will be charged at $375 + GST /sqm. Due to the time constraints associated with the placing of the drop edge beams these variations will be treated differently to other variations. It is impractical to stop the process of placing concrete needed for a drop edge beam whilst the customer’s authorisation is obtained and accordingly the customer will except all charges. ",
            "Sewer connection to the sewer mains to be within 10 meters from the home ",
            "Storm water drainage as per plan (stormwater connection to rear/front of the residence to be within 10 meters from the home) ",
            "Provide water & gas connection ",
            "Single phase power connection & meter box to be within 10 meters of the home",
            "Telstra/NBN conduits connections from the pit to the house. Note: Owner will be responsible for connection charges payable to NBN provider and for infrastructure upgrade for 2nd connection (applicable to dual dwelling construction)",
            "Provide all weather access (as required by council)",
            "Provide trade waste compound, on-site toilet, sediment control barrier ",
            "Pegout survey / final identification report ",
            "Wind classification N2 medium",
          ]}
        />
        <ListWithTitle
          title="Basix Features"
          list={[
            "R2.0 insulation to walls excluding Garage, Porch and Alfresco or as per BASIX requirements",
            "R4.1 insulation to ceilings of living areas as per BASIX requirements",
            "Heavy duty sarking to underside of roof tiles",
            "2 external taps, 1 rainwater connected and 1 town water connected",
            "100mm storm water piping",
            "Provide slimline rainwater tank above ground as per BASIX, including pump and connections",
            "Gas connections wherever applicable",
            "Provide instantaneous gas hot water system from standard builder’s range",
          ]}
        />
        <ListWithTitle
          title="Building & Structure"
          list={[
            "Provide Waffle pod concrete slab to engineer’s specification (M class or H Class).",
            "Brick veneer construction",
            "2700 mm ceiling height - unless upgraded",
            "Frames & Beams - Timber frames construction as per Framing code",
            "Frames & Beams - Supply and fix beams as per engineering details",
            "External Walls - Brick veneer walls and bricks from the builder’s range",
            "External Walls - Provide off white flush joints to brickwork",
            "Termite Treatment - Provide termite protection to the perimeter of the slab and approved collars to the internal pipes",
            "Cladding - Cladding used will be 230mm smooth face weather board. Any cladding used will be fully sarked and painted",
            "Hebel (if included in the tender)- Included supply and install of CSR 50mm or 75mm Hebel Power Panels (as per plans), Novatex Render/ Texture and 1 coat of paint. Note- Blue board and foam will also be used in areas as required."
          ]}
        />
        <ListWithTitle
          title="Facade"
          list={[
            "As per plans TBC",
          ]}
        />
        <ListWithTitle
          title="Roofing"
          list={[
            "Roofing - Provide concrete roof tiles from builder’s range. If metal roof is selected,",
            "this will be an upgrade and will be listed as an external variation to the standard.",
            "Roofing - Provide heavy-duty sarking to roof frame",
            "Roofing - Provide colour bond fascia, gutter & down pipes 90mm from builder’s range",
            "Roofing - Provide 450mm wide eaves to perimeter of your home (subject todesign) ",
          ]}
        />
        <ListWithTitle
          title="Windows"
          list={[
            "Window Glass & Frames - Residential grade (standard size) aluminum frame sliding doors and windows as per windows schedule (Note: double glazed and nonstandard windows will cost extra)",
            "Keyed windows locks fitted to windows and sliding doors.",
          ]}
        />
        <ListWithTitle
          title="Plastering/Internal Linings"
          list={[
            "10mm plasterboard to walls & ceilings, 6mm villa board to wet areas",
            "Standard 90mm cove cornice or Square set finish throughout house ",
          ]}
        />
        <ListWithTitle
          title="Kitchen"
          list={[
            "Kitchen as per approved plan and the benchtop including island up to 6.5 m is included.",
            "Polyurethane/Laminated/ Polytech doors to kitchen and cupboard door to be pencil edge with soft close.",
            "Customer can have combination of two colors. Size of kitchen as per the supplied sample plans 2400mm height with bulkhead on top.",
            "Soft closing kitchen drawer (1x3) to main kitchen and remaining cupboard with high quality.",
            "Double bowlx1 in main kitchen and single bowl in pantry or vice versa, if required as per drawings.",
            "Stone or Tile splash back as per owner’s choice of color in Main kitchen.",
            "Shelving in pantry with white melamine board.",
            "Externally ducted range hood.",
            "Laminate cabinets under benchtop and choice of splash back tiles in butler kitchen.",
            "40 mm Stone benchtop for island with waterfall edges. (Builder Range)",
            "40 mm engineered Stone benchtop in the main kitchen. (Builder Range)",
            "20 mm benchtop in laundry and all vanities also included.",
            "Bulkhead to main kitchen cabinets if required.",
            "All taps and sink to be selected from builder range Water outlet for fridge. ",
          ]}
        />
        <ListWithTitle
          title="Kitchen Appliances"
          list={[
            "Daniella premium stainless-steel range hood (900mm)",
            "Daniella premium 900mm oven",
            "Daniella premium 900mm cooktop (Stainless steel)",
            "Daniella premium 600mm dishwasher",
            "Above appliances with 2year company warranty",
            "Daniella 600mm Appliances for Granny Flats ",
          ]}
        />
        <ListWithTitle
          title="Floor coverings"
          list={[
            "All tiles to be selected from Builder Range",
            "Ground floor –600x 600 porcelain tiles",
            "Tile Selection is from Beaumont Tiles, or another Supplier specified by Builder.",
            "Outdoor floor (alfresco and porch) – 450x450 or 300x600 outdoor",
            "Carpet or Hybrid timber floor ($50/sqm Supply & Install allowance)",
            "Wet Areas 300x300,450x450 or 300x600 tiles ",
          ]}
        />
        <ListWithTitle
          title="Bathroom, Ensuite, Toilet & Laundry"
          list={[
            "Wall hung Vanity with 20mm standard stone for bathrooms.",
            "Bevel edged mirror to the length of the vanity ",
            "Tiles to all wet areas up to ceiling From Beaumont Tiles or Builders Supplier (Builders Range)",
            "Semi Frameless, clear glass shower screens 2000mm height",
            "Premium range towel rails and toilet roll holders From O Star",
            "Rimless Toilet system Dual flush white Back to wall toilets with soft close",
            "Freestanding bathtub standard sizes design specific",
            "Smart Square floor wastes ",
          ]}
        />
        <ListWithTitle
          title="Waterproofing"
          list={[
            "Waterproofing to all wet areas to Australian standard.",
          ]}
        />
        <ListWithTitle
          title="Built in Robes, Walk in Robes, and linen Cupboards."
          list={[
            "1 set of 3 drawers in each robe 2 sets of 3 open shelving in each robe",
            "Melamine fixed shelf with hanging rail",
            "One open divided tower of shelving and one 3 drawers",
            "2400mm mirror glass sliding doors ",
          ]}
        />
        <ListWithTitle
          title="Plumbing"
          list={[
            "1 x Rheem B26l Instantaneous Hot Water Unit mounted on wall",
            "Square/Round ceramic insert vanity basins Builder Range",
            "Mixer tap ware to Basins, Laundry, Bath and Showers Builder Range",
            "Laundry — Single 45lt stainless steel sink with laundry cabinets.",
            "Water tap for fridge (client to advise fridge dimensions)",
            "External 2x taps at outdoors",
            "Rainwater tank as per BASIX plan",
            "1 internal gas point for heating",
            "Installation, Connection and fit-off of all wet area in accordance with project drawings only",
          ]}
        />
        <ListWithTitle
          title="Electrical"
          list={[
            "Light and PowerPoint schedule as per builder schedule",
            "Downlights: 40 for single story, 50 for double story (LED 10 watts) - unless upgraded",
            "Installation of island benchtop only (lights to be provided by owner)",
            "Installation of Pillar Lights x 2 (lights to be provided by owner)",
            "Supply and install IXL 3 in one unit in each bathroom and ensuite",
            "2 double power points allowed 35 of them",
            "Provide Smoke alarm detector as per plan",
            "2 Weather proof external power points included ",
            "2 motion sensor lights",
            "Wiring for NBN to board/hub location, main connection by Telstra/NBN to be organised by owner",
            "Provide 1x Telephone points",
            "Provide 2x Data points",
            "Provide 2x TV points",
            "Provide 1x Digital TV antenna (if required)",
            "Safety circuit breakers to sub-board",
            "Three phase aerial power connection as per requirements.",
            "Metering connected to street up to 12 meters allowed ",
          ]}
        />
        <ListWithTitle
          title="Air Conditioning"
          list={[
            "For the purpose of this tender a 13kw ducted air conditioning will be provided for a double storey home, and 10kw for a single storey home. Zircon Homes will always endeavour to install ducting at the most discreet location available; however this is governed by the location of structural and load bearing beams. Zircon Homes is unable to alter structural or load bearing beams as structural integrity of the building maybe compromised",
            "Air-conditioning design, ducts and bulkhead’s locations is at the builder’s discretion and subject to air- conditioning contractor’s specifications",
            "Actron Air with 4 Zones ",
          ]}
        />
        <ListWithTitle
          title="Stairs, Balconies, Balustrade & Scaffolding"
          list={[
            "Pine timber staircase with MDF tread and riser (builder's range)",
            "Paint finished timber railing with timber or steel balustrades from builder’s range for",
            "stairs and balconies",
            "Privacy screens with timber finish in balcony (if required)",
            "Provide scaffolding as required ",
          ]}
        />
        <ListWithTitle
          title="Doors, Skirting, Architraves"
          list={[
            "Main door –Entrance door includes 2340mm high and up to 1200mm wide doors, glass portion frosted, satin chrome finish from builder’s range",
            "Internal doors to be Hume hollow core internal doors with modern handles and paint finish from builder’s range. (2340mm high)",
            "All doors as per door schedule and drawings",
            "67 mm skirting and architraves for all doors & windows throughout the main house",
            "Chrome finished stainless steel door handles",
            "Door stops to all doors – chrome finish",
            "External door locks for all doors from builder’s range ",
          ]}
        />
        <ListWithTitle
          title="Garage Door"
          list={[
            "Automatic Colourbond standard panel lift door including 2 x Remotes (builders’ range)",
          ]}
        />
        <ListWithTitle
          title="Painting"
          list={[
            "3 coat painting 1 primer coat and 2 main coats, Taubman’s ",
            "Taubman’s paint system to internal and external areas as required",
            "Provide one colour throughout the house. Additional feature walls / colours will cost extra",
          ]}
        />
        <ListWithTitle
          title="Sydney Water"
          description='If Sydney Water "Tap in" for sewer main locations approvals require further information or
a require Sydney Water Co-ordinator this extra cost will be charged as a variation. Should
the construction necessitate building over or directly adjacent Water board sewer mains,
where the house is affected by such mains, the cost will be charged as a variation. Should
it be necessary to lodge an application to the Water Authority Board for the extension of
water or sewer mains to the allotment of land the costs will be charged as a variation.
Should subsoil or surface drains or absorption or detention basins, that we are not made
aware of be required by council they will be charged as a variation. No allowance has been
made for road opening, if required due to position of sewer/water connections, or for
boring under the road. No allowance has been made for storm water easements and/or
accessing neighbouring sites '
        />
      </PageLayout>

      <PageLayout>
        <ListWithTitle
          title="Completion Of Construction"
          list={[
            "90 days maintenance period from practical completion",
            "6 years structural guarantee",
            "Internal and External house clean",
            "Provide all relevant certificates & warranties",
          ]}
        />
        <ListWithTitle
          title="Notes"
          list={[
            "90-day warranty maintenance period is not transferred to new owner should you sell your house within 90 days of handover.",
            "Zircon Homes reserves the right to improve, alter and revise specification without prior notice",
          ]}
        />
        <ListWithTitle
          title="Excluded from all our single and double story homes Zircon Homes Has made no allowance in the Tender for the following and if required will be charged to the owner as an additional cost"
          list={[
            "Demolition, Removal of trees and undergrowth from site or any existing structures",
            "Any rubbish on site prior to commencement to be removed by owners.",
            "Establishment of easements of any sort",
            "Drop edge beams excluded unless noted in the inclusions otherwise",
            "Soil removal from excess excavation resulting from Piering, cut and fill, driveways etc (only 2 truckloads of soil removal is included throughout construction)",
            "Additional fill unless noted otherwise",
            "Council layback/gutter crossing, footpath protection/replacement or reinstatement of council assets",
            "Consultant reports such as, but not limited to, acoustic, traffic, salinity, hydraulic and bushfire reports required by local authorities",
            "On site, hydraulic detention works unless stated specifically in quotation above. Including design, construct and certification",
            "Landscape design drawings and specifications by landscape architect and DWG File",
            "Outdoor showers, pergolas & Rock excavation",
            "Bushfire requirements and acoustic insulation requirements",
            "Asbestos removal or any other contaminated soil removal",
            "Storm water detentions / retentions systems if required by council",
            "Services being outside of your boundary ",
            "Sewer encasement or building adjacent sewer (if required)",
            "Salinity treatment requirements to slab and site unless noted under provisional site cost",
            "Site access constraints",
            "Ausgrid or Jemena connection fees",
            "Traffic control if required",
            "Council fees, Long service Levy and section 73 & 94 contributions if required",
            "Sub division for land titles to be paid by owner. Any cost due to subdivision works including but not limited to linen plans, authority contributions and fees / bonds. Home warranty insurance for strata subdivisions will be quoted outside of the tender",
            "Insulation of electrical power poles to service dwellings / site",
            "Aerial cover to overhead electrical mains",
            "Shoring or underpinning and dewatering",
            "under road bore",
            "Any landscape, fencing works, retaining walls and external concrete steps unless noted otherwise",
            "Blinds",
            "Gas bottles provisions",
            "Road opening fees",
            "Bifold doors",
            "Dewatering",
            "Relocation of Bus Stop, Relocation of road storm water pit",
            "Any other items or building components not specifically outlined in the tender",
            "Any usage cost for gas, water or electricity on site during construction (owners responsibility)",
            "Relocation of power, storm water pit, bus stop, Telstra pits if within approving authority's crossover ",
          ]}
        />
        <ListWithTitle
          title="Terms And Conditions"
          list={[
            "All specifications and plans are subject to BASIX assessment",
            "This specification is subject to conditions set out in the council/private certifier approved development application and construction certificate",
            "Number of light points and fittings depends on house design",
            "Due to local statutory requirements, variations may be made to the specification on a case-by-case basis.",
            "Underground gas service connect ion is to be arranged by the owner’s selected service provider at the time specified by the job supervisor (may take up to 3 months)",
            "Please speak to us for confirmed living area floor covering areas (carpet and tile areas are as per final plans)",
            "Air-conditioning design, ducts and bulkhead’s locations is at the builder’s discretion and subject to air- conditioning contractor’s specifications ",
            "OH & S owners to get appointment to visit the site during construction, No children allowed to enter the work site at any time. $500 fine to client for unauthorized entry.",
            "Sediment control fencing to be maintained by owners after hand over until landscaping is completed.",
            "All colors and products to be selected from the builder’s standard range of colors.",
            "Builder reserves the right to change the standard inclusions to an equivalent or better product based on supply",
            "All contract documentation shall take precedence over this inclusions list",
            "Quotation is subject to reviewing the 149 (2)&(5) certificate, sewerage diagram and title search",
            "If no allowance is given for any item in the quotation, the item will be supplied from Builder’s range",
            "If the building must be constructed over a main sewer line the sewer will need to be concrete encased additional cost will apply",
            "Zircon Homes will remove any concrete obstructing the connection of sewer, stormwater and electricity services. Restoration of footpath, turfing, tree preservation and retaining walls as required by certifier / council will be client's responsibility.",
            "If we are building within the zone of influence to a sewer line a sewer peg out will be required, cost of engaging Sydney Water Coordinator plus additional piering will be applicable",
            "If we are building within the zone of influence to a sewer line a sewer pegout will be required, cost of engaging Sydney Water Coordinator plus additional piering will be applicable Access to work site is strictly restricted unless supervised by Zircon Homes site supervisor. Zircon Homes is not responsible for any injuries sustained inside the work zone, if unlawful access has taken place.",
            "No allowance has been made for any council bonds that may be required should the council request it. it will be the responsibility of the owner to cover the cost",
            "When leveling and clearing the site some of the machines used may cause minor ground disruption this is unpreventable, no allowance has been made to rectify any damages caused.",
            "When construction is over an existing concrete driveway or over an existing kerb Zircon Homes will take all care to protect the existing exterior. We cannot guarantee there will be no damages, as we do not know the structural strength. Zircon Homes will not be liable for any damages caused due to the need to gain reasonable access during the construction",
            "Any pre-existing damage to surface objects such as concrete paths/driveways etc. on the property will not be the responsibility of Zircon Homes ",
          ]}
          description={[
            "You can appreciate that, at this early stage, until a formal building agreement is entered into between ",
            "us in accordance with statutory requirements, no binding or contractual rights or liabilities arise ",
            "between us in relation to this document and the construction of your new home. ",
            "Documents required from the clients: - ",
            "I. Deposited plan if any.",
            "II. Proof of loan approval from lending authority- before signing the contract.",
            "III. Section 10.7certificate from council if required. Progress payment schedule-:",
            " ",
            " ",
            "Payment 1 - Singing of contract -deposit of 10%",
            "Payment 2 - Completion of slab - 10% payment.",
            "Payment 3 - Completion of frames & trusses - 20% payment",
            "Payment 4 - Brickwork substantially complete, 20% payment",
            "Payment 5 - Roof tiles substantially complete- 15% payment.",
            "Payment 6 - Completion of Internal linings- 15 % payment",
            "Payment 7 - Practical Completion - 10 % payment ",
            " ",
            " ",
            " ",
            " ",
            "Note- The progress payments may be subject to change as per your funding agency. Thanks for giving us the opportunity to provide a quotation for your project. I am pleased to provide the tender for the construction of your Project. ",
          ]}
        />
      </PageLayout>

      <PageLayout>
        <View style={TenderAcceptanceStyles.container}>
          <Text style={TenderAcceptanceStyles.heading}>Tender Acceptance</Text>

          <Text style={TenderAcceptanceStyles.paragraph}>
            I / We accept the above pricing, terms and conditions of the tender.
          </Text>
          <Text style={TenderAcceptanceStyles.paragraph}>
            I / We understand that to proceed further, we require to make a payment of $7,500 and that this amount forms part of the total contract price.
          </Text>
          <Text style={TenderAcceptanceStyles.paragraph}>
            I / We agree that in the event of us not proceeding to sign the building agreement, we will be responsible to reimburse Zircon Homes all of the costs incurred till the date of cancellation, plus an administration fee of $1,000.
          </Text>
          <Text style={TenderAcceptanceStyles.paragraph}>
            I / We understand this amount is non-refundable once the working drawings have been commenced.
          </Text>
          <Text style={TenderAcceptanceStyles.paragraph}>
            I / We understand this amount will form part of the total Contract price when we enter into building agreement with Zircon Homes. Working drawings will be submitted to Council for approval permit after contract signing whereby the balance of a 10% deposit will be required at this time.
          </Text>
          <Text style={TenderAcceptanceStyles.paragraph}>
            I / We agree that Zircon Homes will not take responsibility for any verbal discussions or instructions. All changes and special instructions must be in writing. Details shown on the plans are intended to be accurate- however information written into individual contracts/tenders will take precedence over plans.
          </Text>
          <Text style={TenderAcceptanceStyles.paragraph}>
            I / We understand that this tender is priced on the condition that commencement of construction will take place 6 months from the date the tender was accepted and signed. Also if there are delays on my / our part once the tender is accepted, Zircon Homes reserves the right to change the base price if an increase occurred in the interim, however this is subject to the building agreement. If the commencement of construction is delayed for reasons, which the builder is not responsible, the Builder may vary the contract price in line with current price lists.
          </Text>

          <View style={TenderAcceptanceStyles.subSection}>
            <Text style={TenderAcceptanceStyles.boldText}>Plan changes:</Text>
            <Text style={TenderAcceptanceStyles.text}> If plan revisions are requested after tender acceptance, this will incur an administration and re-draw charge of $1,100.</Text>
          </View>
          <View style={TenderAcceptanceStyles.subSection}>
            <Text style={TenderAcceptanceStyles.boldText}>If progress payment invoice is not paid within the due date (i.e. 5 business days from the issued date of invoice) then $200 penalty per day will apply.</Text>
          </View>
          <View style={TenderAcceptanceStyles.subSection}>
            <Text style={TenderAcceptanceStyles.boldText}>During construction:</Text>
            <Text style={TenderAcceptanceStyles.text}> No Structural changes are permitted once the construction starts. Any other non-structural changes will incur an administration charge of $550.</Text>
          </View>

          <View style={TenderAcceptanceStyles.signatureContainer}>
            <View style={TenderAcceptanceStyles.signatureLine}>
              <Text style={TenderAcceptanceStyles.clientText}>Client 1</Text>
              <Text style={TenderAcceptanceStyles.signatureUnderscore}>............................................................</Text>
            </View>
            <View style={TenderAcceptanceStyles.signatureLine}>
              <Text style={TenderAcceptanceStyles.clientText}>Client 2</Text>
              <Text style={TenderAcceptanceStyles.signatureUnderscore}>............................................................</Text>
            </View>
          </View>
        </View>
      </PageLayout> */}
    </Document>
  );
};

export default QuatationPdf;

const styles = StyleSheet.create({
  page: {
    paddingTop: 100, // Space for the header
    paddingBottom: 40, // Space for the footer
    paddingHorizontal: 40,
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 6,
  },
  headerLogo: { width: 250, height: 70, objectFit: "contain" },
  headerTextContainer: { flexDirection: "column", alignItems: "flex-end" },
  headerTitle: { fontSize: 12, fontWeight: "bold", color: "#2f4e75" },
  headerSlogan: { fontSize: 10, color: "#2f4e75" },
  watermarkWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.1, // Adjust for desired transparency
  },
  watermarkImage: {
    width: 300, // Adjust size as needed
    height: 300,
    objectFit: 'contain',
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 4,
  },
  footerTopText: {
    fontSize: 9,
    color: "#000",
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A8A", // blue
    borderTop: "3pt solid #E63946", // red border
    paddingVertical: 6,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  footerIconImg: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  footerText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "bold",
  },
  contentWrapper: {
    flexGrow: 1, // This is the key
  },
});

const Page1styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 30,
    fontSize: 11,
    lineHeight: 1.6,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 40,
    fontSize: 11,
  },
  colon: {
    width: 10,
    fontSize: 11,
  },
  value: {
    fontSize: 11,
  },
  body: {
    marginTop: 15,
    fontSize: 11,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 12,
    textAlign: "justify",
  },
  signature: {
    marginTop: 50,
  },
  name: {
    fontSize: 11,
    marginBottom: 3,
  },
  position: {
    fontSize: 11,
    marginBottom: 3,
  },
  phone: {
    fontSize: 11,
    marginBottom: 3,
  },
  dot: {
    fontSize: 11,
  },
});

const Page2styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20, // Add margin to separate from the next section
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 6,
    fontSize: 11,
    flexWrap: "wrap",
  },
  col25: { flex: 1 }, // 25%
  col75: { flex: 3 }, // 75%
  col50: { flex: 2 }, // 50%
  boldText: {
    fontWeight: "bold",
  },
  paragraph: {
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 1.4,
  },
});

const Page3styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  SubHeading: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryHeading: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  bullet: {
    width: 10,
    fontSize: 12,
    lineHeight: 1.5,
  },
  listText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
  description: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
  packageTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftCol: {
    flex: 1,
    marginRight: 10,
  },
  rightCol: {
    width: 300,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: "10px",
    objectFit: "contain",
  },
});

const TenderAcceptanceStyles = StyleSheet.create({
  container: {
    padding: 30,
    fontSize: 11,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  paragraph: {
    lineHeight: 0.8
  },
  subSection: {
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    lineHeight: 1,
  },
  boldText: {
    fontWeight: "bold",
  },
  text: {
    flex: 1,
  },
  signatureContainer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  signatureLine: {
    width: "45%",
    flexDirection: "column",
    alignItems: "center",
  },
  signatureUnderscore: {
    fontSize: 12,
    marginTop: 20,
    color: "#000",
  },
  clientText: {
    fontSize: 11,
    marginTop: 5,
  },
});

const ItemTable = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  headerRow: {
    backgroundColor: "#f1f1f1",
  },
  totalRow: {
    backgroundColor: "#e6f0ff",
  },
  cell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  centerText: {
    textAlign: 'center',
  },
  col40: { flex: 4 },
  col15: { flex: 1.5, textAlign: "right" },
});

const finalTotalStyles = StyleSheet.create({
  container: {
    padding: 3,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {},
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 5,
  },
});