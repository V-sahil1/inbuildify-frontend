class API_ENDPOINTS {
  //dashboard
  public static DASHBOARD_BASE = "/dashboard";

  //auth
  public static AUTH_BASE = "/auth";
  public static LOGIN = `${this.AUTH_BASE}/login`;
  public static REFRESH_TOKEN = `${this.AUTH_BASE}/refresh-token`;
  public static REGISTER_BASE = `${this.AUTH_BASE}/register`;
  public static VERIFY_EMAIL = `${this.AUTH_BASE}/verify-email-otp`;
  public static RESEND_OTP = `${this.AUTH_BASE}/resend-email-otp`;
  public static FORGOT_PASSWORD = `${this.AUTH_BASE}/forgot-password`;
  public static RESET_PASSWORD = `${this.AUTH_BASE}/reset-password`;
  public static UPDATE_PASSWORD = `${this.AUTH_BASE}/update-password`;
  public static LOGOUT = `${this.AUTH_BASE}/logout`;

  // user
  public static USER_BASE = "/user";
  public static PROFILE = `${this.USER_BASE}/profile`;
  public static GET_USERS = `${this.USER_BASE}/users`;
  public static INVITE_USER = `${this.USER_BASE}/invite-user`;
  public static INVITED_USERS = `${this.USER_BASE}/invited-user`;
  public static ACCEPT_INVITE = `${this.USER_BASE}/accept-invite`;
  // users

  // contractors
  public static CONTRACTOR_BASE = "/contractor";
  public static CREATE_CONTRACTOR = `${this.CONTRACTOR_BASE}`;
  public static GET_CONTRACTORS = `${this.CONTRACTOR_BASE}`;
  // services
  public static SERVICE_BASE = "/service";

  //customers
  public static CUSTOMER_BASE = "/customer";
  public static CREATE_CUSTOMER = `${this.CUSTOMER_BASE}`;
  public static GET_CUSTOMERS = `${this.CUSTOMER_BASE}`;

  //leads
  public static LEAD_BASE = "/leads";
  public static CREATE_LEAD = `${this.LEAD_BASE}`;
  public static GET_LEAD_BY_ID = (id: string) => `${this.LEAD_BASE}/${id}`;
  public static LEAD_TRANSFER = `${this.LEAD_BASE}/transfer`;
  public static LEAD_CONVERT = `${this.LEAD_BASE}/convert`;
  public static CONVERT_LEAD_TO_OPPORTUNITY = "/opportunities";
  public static CONVERT_LEAD_TO_JOB = `/job`;
  public static LEAD_CONTACT = `/leads-contact`;
  public static LEAD_SOURCE = `/lead-source`;

  //  Master PricingList
  public static MASTER_PRICE_LIST_CATEGORY = "/category";
  public static CREATE_MASTER_PRICE_LIST_ITEM = "/category-item";
  public static GET_MASTER_PRICE_LIST_ITEM = (id: string) =>
    `/category-item/${id}`;
  public static MASTER_CATEGORY_ORDER = `${this.MASTER_PRICE_LIST_CATEGORY}/order/display-order`;
  public static MASTER_PRICE_LIST_CONDITION_BASE = "/condition";
  public static GET_MASTER_PRICE_LIST_CONDITIONS = `${this.MASTER_PRICE_LIST_CONDITION_BASE}/conditions`;

  // floor plans
  public static FLOOR_PLAN_BASE = "/floor-plan";
  public static FLOOR_PLAN_FILTERS = `${this.FLOOR_PLAN_BASE}/filters`;

  //range and dwelling type
  public static RANGE = `/range`; 
  public static DWELLING_TYPE = `/dwelling-type`;

  //packages
  public static PACKAGE_BASE = "/package";
  public static GET_PACKAGES = `${this.PACKAGE_BASE}`;
  public static GET_PACKAGE_BY_ID = (id: string) =>
    `${this.PACKAGE_BASE}/${id}`;
  public static CREATE_PACKAGE = `${this.PACKAGE_BASE}`;
  public static GET_PACKAGE_ITEMS = `${this.PACKAGE_BASE}/category/items`;
  public static FACADE_BASE = "/facade";

  //  Workflow Process
  public static WORKFLOW_PROCESS_BASE = "/workflow-process";
  public static WORKFLOW_PROCESS_TASK = `${this.WORKFLOW_PROCESS_BASE}/task`;
  public static WORKFLOW_PROCESS_ORDER = `${this.WORKFLOW_PROCESS_BASE}/display/order`;
  public static WORKFLOW_PROCESS_TASK_FOR_JOB = `/workflow-process-task`;

  //  Colour
  public static COLOUR_CATEGORY_BASE = "/color-category";
  public static COLOUR_SUB_CATEGORY_BASE = "/color-sub-category";
  public static COLOUR_SUB_CATEGORY_ITEM = `/color-item`;

  // Property
  public static PROPERTY_BASE = "/property";

  // builder
  public static BUILDER_BASE = "/builder";

  //quotation
  public static QUOTATION_BASE = "/quotation";
  public static QUOTATION_VERSION = "/quotation/version";

  public static GET_QUOTATIONS_BY_LEAD_ID = (
    leadId: string,
    page: number,
    limit: number
  ) => `${this.QUOTATION_BASE}?leadId=${leadId}&page=${page}&limit=${limit}`;

  // location
  public static COUNTRY_BASE = "/country";
  public static STATE_BASE = "/state";

  // action
  public static ACTION_BASE = "/actions";

  // tags
  public static TAGS_BASE = "/tags";
}
export default API_ENDPOINTS;
