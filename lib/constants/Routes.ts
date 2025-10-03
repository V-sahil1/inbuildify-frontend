class SystemRoutes {
  public static BASE = "";
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
  public static QUOTATION_CREATE = (leadId: string | number) => `${this.QUOTATION}/create/${leadId}`;
  public static SETTINGS = `/settings`;
  public static SETTINGS_COLOUR = `${this.SETTINGS}/?tab=colour`;
  public static DWELLING_AND_RANGE = `${this.SETTINGS}/?tab=range-dwelling`;
  public static LEADS = `/leads`;
  public static JOB = `/job`;
  public static JOB_WORKFLOW = `${this.JOB}/workflow`;
  public static CONSTRUCTION = `/construction`;
  public static MAINTENANCE = `/maintenance`;
}

export default SystemRoutes;
