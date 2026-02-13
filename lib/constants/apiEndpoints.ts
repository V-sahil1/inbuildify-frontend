class API_ENDPOINTS {
  //dashboard
  public static DASHBOARD_BASE = '/dashboard';

  //auth
  public static AUTH_BASE = '/auth';
  public static LOGIN = `${this.AUTH_BASE}/login`;
  public static REFRESH_TOKEN = `${this.AUTH_BASE}/refresh-token`;
  public static REGISTER_BASE = `${this.AUTH_BASE}/register`;
  public static VERIFY_EMAIL = `${this.AUTH_BASE}/verify-email`;
  public static RESEND_OTP = `${this.AUTH_BASE}/resend-otp`;
  public static FORGOT_PASSWORD = `${this.AUTH_BASE}/forgot-password`;
  public static RESET_PASSWORD = `${this.AUTH_BASE}/reset-password`;
  public static UPDATE_PASSWORD = `${this.AUTH_BASE}/update-password`;
  public static LOGOUT = `${this.AUTH_BASE}/logout`;

  // user
  public static USER_BASE = '/user';
  public static PROFILE = `${this.USER_BASE}/profile`;
  public static GET_USERS = `${this.USER_BASE}`;
  public static INVITE_USER = `${this.USER_BASE}/invite-user`;
  public static INVITED_USERS = `${this.USER_BASE}/invited-user`;
  public static ACCEPT_INVITE = `${this.USER_BASE}/accept-invite`;
  // users
  public static USER_GROUP = '/user-group';

  // contractors
  public static CONTRACTOR_BASE = '/contractor';
  public static CREATE_CONTRACTOR = `${this.CONTRACTOR_BASE}`;
  public static GET_CONTRACTORS = `${this.CONTRACTOR_BASE}`;
  // services
  public static SERVICE_BASE = '/service';

  //customers
  public static CUSTOMER_BASE = '/customer';
  public static CREATE_CUSTOMER = `${this.CUSTOMER_BASE}`;
  public static GET_CUSTOMERS = `${this.CUSTOMER_BASE}`;

  //leads
  public static LEAD_BASE = '/leads';
  public static CREATE_LEAD = `${this.LEAD_BASE}`;
  public static GET_LEAD_BY_ID = (id: string) => `${this.LEAD_BASE}/${id}`;
  public static LEAD_TRANSFER = `${this.LEAD_BASE}/transfer`;
  public static LEAD_CONVERT = `${this.LEAD_BASE}/convert`;
  public static CONVERT_LEAD_TO_OPPORTUNITY = '/opportunities';
  public static CONVERT_LEAD_TO_JOB = `/job`;
  public static LEAD_CONTACT = `/leads-contact`;
  public static LEAD_SOURCE = `/lead-source`;

  //  Master PricingList
  public static MASTER_PRICE_LIST_CATEGORY = '/category';
  public static CREATE_MASTER_PRICE_LIST_ITEM = '/category-item';
  public static GET_MASTER_PRICE_LIST_ITEM = (id: string) => `/category-item/${id}`;
  public static MASTER_CATEGORY_ORDER = `${this.MASTER_PRICE_LIST_CATEGORY}/order/display-order`;
  public static MASTER_PRICE_LIST_CONDITION_BASE = '/condition';
  public static GET_MASTER_PRICE_LIST_CONDITIONS = `${this.MASTER_PRICE_LIST_CONDITION_BASE}/conditions`;

  //PiceList
  public static PRICELIST_MASTER = '/price-list';
  public static SUGGESTED_PRICELIST_MASTER = `${this.PRICELIST_MASTER}/suggested`;
  public static PRICELIST_ITEM = '/price-list-item';

  // floor plans
  public static FLOOR_PLAN_BASE = '/floor-plan';
  public static FLOOR_PLAN_FILTERS = `${this.FLOOR_PLAN_BASE}/filters`;
  public static FLOOR_PLAN_PRICELIST = '/floor-plan-pricelist-item-map';

  //range and dwelling type
  public static RANGE = `/range`;
  public static DWELLING_TYPE = `/dwelling-type`;

  //packages
  public static PACKAGE_BASE = '/package';
  public static PACKAGE_GROUP = `/package-group`;
  public static GET_PACKAGE_BY_ID = (id: string) => `${this.PACKAGE_BASE}/${id}`;
  public static GET_PACKAGE_ITEMS = `${this.PACKAGE_BASE}/category/items`;
  public static FACADE_BASE = '/facade';

  //  Workflow Process
  public static WORKFLOW_PROCESS_BASE = '/workflow-process';
  public static WORKFLOW_PROCESS_TASK = `${this.WORKFLOW_PROCESS_BASE}/task`;
  public static WORKFLOW_PROCESS_ORDER = `${this.WORKFLOW_PROCESS_BASE}/display/order`;
  public static WORKFLOW_PROCESS_TASK_FOR_JOB = `/workflow-process-task`;

  //  Colour
  public static COLOUR = '/color';
  public static COLOR_COPY = id => `${this.COLOUR}/copy/${id}`;
  public static COLOUR_CATEGORY_BASE = '/color-category';
  public static COLOUR_CATEGORY_COPY = id => `${this.COLOUR_CATEGORY_BASE}/copy/${id}`;
  public static COLOUR_SUB_CATEGORY_BASE = '/color-sub-category';
  public static COLOUR_SUB_CATEGORY_ITEM = `/color-item`;
  public static COLOUR_SUB_CATEGORY_ITEM_COPY = id => `${this.COLOUR_SUB_CATEGORY_ITEM}/copy/${id}`;
  public static COLOR_ITEM_MOVE = (id: string) => `${this.COLOUR_SUB_CATEGORY_ITEM}/move/${id}`;
  public static COLOUR_GROUP = `/color-group`;
  public static COLOUR_TYPE = `/color-type`;
  public static COLOR_ITEM_CUSTOM_FIELD = `/color-item-custom-field`;

  // Property
  public static PROPERTY_BASE = '/property';

  // builder
  public static BUILDER_BASE = '/builder';

  //quotation
  public static QUOTATION_BASE = '/quotation';
  public static QUOTATION_VERSION = '/quotation/version';

  public static GET_QUOTATIONS_BY_LEAD_ID = (leadId: string, page: number, limit: number) =>
    `${this.QUOTATION_BASE}?leadId=${leadId}&page=${page}&limit=${limit}`;

  // location
  public static COUNTRY_BASE = '/country';
  public static STATE_BASE = '/state';

  // action
  public static ACTION_BASE = '/actions';

  // tags
  public static TAGS_BASE = '/tags';

  //admin general
  public static GENERAL_SETTING = '/general-setting';
  public static GET_GENERAL_SETTING = `${this.GENERAL_SETTING}/user`;
  public static COMPANY_BASE = '/company';
  // public static BUILDER_BASE = '/builder';
  public static SURVEYOR_BASE = '/surveyor';
  public static CUSTOMFIELD_BASE = '/custom-field';
  public static CUSTOMFIELD_LIST_OPTION_BASE = `${this.CUSTOMFIELD_BASE}/option`;
  public static CUSTOMFIELD_MODULE_BASE = '/custom-field-module';
  public static NOTE_TAG_BASE = '/note-tag';
  public static CHECKLIST_BASE = '/checklist';
  public static CHECKLIST_ITEM = '/checklist-item';
  public static SCREEN_BASE = '/screen';
  public static PASSWORD_POLICY_BASE = '/password-policy';
  public static ROLE_AND_USER_MAPPING_TYPE = '/role-type';
  public static ROLE_AND_USER_MAPPING = '/user-role-mapping';

  //admin sales
  public static SALES_SETTING = '/sales-module-setting';
  public static GET_SALES_SETTING = `${this.SALES_SETTING}/fetch `;
  public static SALES_PROCESS = '/sales-proccess';
  public static SALES_STAGE_BASE = '/sales-stage';
  public static GET_SALES_STAGE_BY_PROCCESSID = `${this.SALES_STAGE_BASE}/process`;
  public static SALES_STAGE_FUNCTIONALITY = '/sales-proccess-stage-functionality';
  public static SALES_LEAD_SOURCE = '/sales/lead-source';
  public static UPDATE_LEAD_SOURCE_STATUS = `${this.SALES_LEAD_SOURCE}/is-active`;
  public static LEAD_LOST_REASON = '/lead-lost-reason';
  public static UPDATE_LEAD_LOST_REASON = `${this.LEAD_LOST_REASON}/is-active`;
  public static CLIENT_TYPE = '/client-type';
  public static UPDATE_CLIENT_TYPE = `${this.CLIENT_TYPE}/is-active`;
  public static QUOTATION_SETTING = '/quotation-setting';
  public static GET_QUOTATION_SETTING = `${this.QUOTATION_SETTING}/fetch`;
  public static HL_PACKAGE_SETTING = '/house-land-package-setting';
  public static GET_HL_PACKAGE_SETTING = `${this.HL_PACKAGE_SETTING}/fetch`;
  public static RANGE_BASE = '/range';
  public static UPDATE_RANGE = `${this.RANGE_BASE}/is-active`;
  public static DWELLING_TYPE_BASE = '/dwelling-type';
  public static UPDATE_DWELLING_TYPE = `${this.DWELLING_TYPE_BASE}/is-active`;
  public static PRICELIST_BASE = '/price-list';

  // admin job
  public static JOB_SETTING = '/job-setting';
  public static JOB_COLOR = '/job-color-setting';
  public static JOB_COLOR_COLUMN = '/job-color-column';
  public static JOB_COLOR_SECTION = '/job-color-column-section';
  public static JOB_WORKFLOW = '/job-workflow-setting';
  public static JOB_INVOICE = '/job-invoice-setting';
  public static JOB_INVOICE_STAGE = '/job-invoice-stage-payment';
  public static JOB_INVOICE_STAGE_ACTIVE = `${this.JOB_INVOICE_STAGE}/is-active`;
  public static JOB_VARIATION = '/job-variation-setting';
  public static JOB_VARIATION_APPROVAL = '/job-variation-approval';
  public static JOB_COMMISSION_SETTING = '/job-commission-setting';
  public static JOB_COMMISSION = '/job-commission';
  public static JOB_COMMISSION_SUB_STAGE = '/job-commission-sub-stage';

  // job process
  public static JOB_PROCESS_BASE = '/job-process';
  public static JOB_PROCESS_FUNTIONALITY = '/job-process-stage-functionality';
  public static JOB_PROCESS_STAGE = `${this.JOB_PROCESS_BASE}/stages`;
  public static JOB_PROCESS_SUB_STAGE_BASE = `${this.JOB_PROCESS_BASE}/sub-stages`;
  public static JOB_PROCESS_SUB_STAGE = (stageId: string) => {
    return `${this.JOB_PROCESS_STAGE}/${stageId}/sub-stages`;
  };
  public static JOB_TASK_BASE = `${this.JOB_PROCESS_BASE}/tasks`;
  public static JOB_PROCESS_TASK = (subStageId: string) => {
    return `${this.JOB_PROCESS_SUB_STAGE_BASE}/${subStageId}/tasks`;
  };
  public static JOB_SUB_TASK_BASE = `${this.JOB_PROCESS_BASE}/sub-tasks`;
  public static JOB_PROCESS_SUB_TASK = (taskId: string) => {
    return `${this.JOB_TASK_BASE}/${taskId}/sub-tasks`;
  };

  // admin maintenance
  public static MAINTENANCE_SETTING = '/maintenance-setting';
  public static MAINTENANCE_AREA = '/maintenance-area';

  // admin portal
  public static CUSTOMER_PORTAL_BASE = '/portal-setting';

  // admin schedule
  public static SCHEDULE_BASE = '/scheduler-setting';
  public static SCHEDULER_EMAIL = '/scheduler-email';
  public static SCHEDULER_EMAIL_ACTIVE = '/scheduler-email/is-active';

  //construction
  public static CONSTRUCTION_SETTING = '/construction-setting';
  public static CONSTRUCTION_OPTION = '/construction-option';
  public static CONSTRUCTION_TYPE = '/construction-type';
  public static CONSTRUCTION_STAGE = '/construction-stage';
  public static CONSTRUCTION_CHECKLIST = '/construction-checklist';
  public static CONSTRUCTION_SUB_CHECKLIST = '/construction-sub-checklist';
  public static CONSTRUCTION_CHECKLIST_PREDECESSOR = '/construction-checklist-predecessor';
  public static INSPECTION_CHECKLIST = '/construction-inspection-checklist';
  public static OHS_LIST = '/construction-ohs';
  public static OHS_SETTING = `${this.OHS_LIST}/settings`;
  public static OHS_ITEM = `${this.OHS_LIST}/list`;
  public static ETS_RECHARGE_SETTING = '/construction-ets-recharge';
  public static ETS_RECHARGE_APPROVAL = '/construction-ets-recharge-approval';

  //document
  public static DOCUMENT_AREA = '/document-common-folder';
  public static DOCUMENT_SUB_FOLDER = '/document-common-subfolder';
  public static DOCUMENT_FILE_NAMING = '/document-file-naming-rule';
  public static DOCUMENT_FILE_NAMING_FORMAT = `${this.DOCUMENT_FILE_NAMING}/naming-format`;
  public static DOCUMENT_FOLDER_MAPPING = '/document-folder-mapping';

  // integration
  public static INTEGRATION_SETTING = '/integration-setting';
  public static INTEGRATION_CUSTOM_FIELD = '/integration-custom-field-header';
  public static INTEGRATION_CUSTOM_FIELD_ITEM = '/integration-custom-field-item';

  // Template
  public static EMAIL_TEMPLATE = '/template-email';
  public static EMAIL_SIGNATURE = '/template-email-signature';
  public static NOTES_TEMPLATE = '/template-note';
  public static ACTIVATE_NOTES_TEMPLATE = `${this.NOTES_TEMPLATE}/is-active`;
  public static PDF_TEMPLATE = '/template-pdf';

  public static ROLE_BASE = '/role';
  public static DRIVE_BASE = '/drive';
  public static COMPLIANCE_TYPE = '/compliance-type';

  //supplier
  public static SUPPLIER = '/supplier';
  public static SUPPLIER_TYPE = '/supplier-type';

  //cost center
  public static COST_CENTER = '/cost-center';
  public static COST_CENTER_CHECKLIST = `${this.COST_CENTER}/checklist-map`;

  //survey template
  public static SURVEY_TEMPLATE = '/survey-template';
  public static SURVEY_QUESTION = '/survey-template-question';

  //holiday
  public static HOLIDAY = '/holiday';
  public static HOLIDAY_RECALCULATE_DATE = `/recalculate-date`;
  // common
  public static FUNCTIONALITY_BASE = '/functionality';
  public static TIMEZONE_BASE = '/timezone';
  public static BUILDER_ALL = `${this.BUILDER_BASE}/all`;
  public static LOCATION_BASE = '/location';
}
export default API_ENDPOINTS;
