import { Status } from '@lib/constants/enum';

export interface Color {
  fontColor: string | null;
  backgroundColor: string | null;
  fontSize?: number;
  title?: string;
}

export interface PageStyle {
  title?: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string | null;
}

export interface LogoSettings {
  width: number;
  height: number;
  padding: number | null;
  alignment: 'Left' | 'Center' | 'Right';
  logoImage: string | null;
  watermarkImage: string | null;
}

export interface TemplateJson {
  pageHeader: PageStyle;
  pageFooter: PageStyle;
  logoSettings: LogoSettings;

  showDetails: {
    account: string;
    address: string;
    contact: string;
    bankInformation?: string;
    useLabelInfo?: boolean;
  };
  customText?: string;

  listItems?: {
    header?: Color;
    footer?: Color;
  };

  bankDetails?: {
    headerText: string;
  };
  initialDepositDescription?: string;

  subItems?: {
    header?: Color;
    showUnitOption?: string;
  };

  totalCostCustomText?: string;

  costTypeStyles?: {
    standard: Color;
    upgrade: Color;
  };

  enableBuilderSignature?: boolean;
}

export interface PdfTemplate {
  templatePdfId: string;
  companyId: string;
  builderId: string;

  name:
  | 'Invoice Format'
  | 'Receipt Format'
  | 'Variation Format'
  | 'Color Format'
  | 'Maintenance Format';

  templateJson: TemplateJson;
}

export interface IPdfTemplateState {
  pdfTemplate: PdfTemplate[];
  status: {
    fetch: Status;
    update: Status;
  };
}
