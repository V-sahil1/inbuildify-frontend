class SystemRoutes {
  public static BASE = '';
  public static AUTH = `${this.BASE}/auth`;
  public static LOGIN = `${this.AUTH}/sign-in`;
  public static SIGNUP = `${this.AUTH}/sign-up`;
  public static INVITE = `${this.AUTH}/accept-invite`;
  public static RESET_PASSWORD = `${this.AUTH}/reset-password`;
  public static FORGOT_PASSWORD = `${this.AUTH}/forgot-password`;
  public static TWO_FACTOR_AUTH = `${this.AUTH}/two-step`;
  public static USERS = `/users`;
  public static MY_PROFILE = `/my-profile`;
  public static QUOTATION = `/quotation`;
  public static QUOTATION_CREATE = (leadId: string | number) =>
    `${this.QUOTATION}/create/${leadId}`;
  public static SETTINGS = `/settings`;
  public static SETTINGS_COLOUR = `${this.SETTINGS}/?tab=colour`;
  public static DWELLING_AND_RANGE = `${this.SETTINGS}/?tab=range-dwelling`;
  public static LEADS = `/leads`;
  public static JOB = `/job`;
  public static BUILDING_CONTRACT = `${this.JOB}/buildingContract`;
  public static CALENDAR = `/calendar`;
  public static JOB_WORKFLOW = `${this.JOB}/workflow`;
  public static JOB_PRECONSTRUCTION = `${this.JOB}/preconstruction`;
  public static COLOR = `${this.BASE}/color`;
  public static COLOR_GROUP = `${this.BASE}/colorgroup`;
  // public static JOB_CONSTRUCTION = `/construction`
  public static CONSTRUCTION = `/construction`;
  public static MAINTENANCE = `/maintenance`;
  public static ACTION = `/action`;
  public static TASKS = `/tasks`;
  public static APPOINTMENT = `/appointments`;
  public static TODO = `/todo`;
  public static HLPACKAGE = `/hlpackage`;
  public static CAMPAIGN = `/campaigns`;
  public static ADMIN = `/admin`;
  public static EMAIL_ACTIVITIES = `/activities`;
  public static CONTACTS = `/contacts`;
  public static AGENT_REFERRAL = `/agent-referral`;
  public static COST_CENTER = `/cost-center`;
  public static FLOORPLAN = `/floorplan`;
  public static FACADE = `/facade`;
  public static CONTRACT = `/contract`;
  public static HOLIDAY_MASTER = `/holiday-master`;
  public static PACKAGE = `/package`;
  public static MASTER_COLLECTION = `/master-collection`;
  public static PRICELIST = `/pricelist`;
  public static ESTATE = `/estate`;
  public static SUPPLIER = `/supplier`;
  public static SURVEY_TEMPLATE = `/survey_template`;
  public static USER = `/user`;
  public static USER_GROUP = `/user-group`;
}

export default SystemRoutes;
