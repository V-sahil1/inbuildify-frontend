class SystemRoutes {
  public static BASE = "";
  public static AUTH = `${this.BASE}/auth`;
  public static LOGIN = `${this.AUTH}/sign-in`;
  public static SIGNUP = `${this.AUTH}/sign-up`;
  public static INVITE = `${this.AUTH}/accept-invite`;
  public static RESET_PASSWORD = `${this.AUTH}/reset-password`;
  public static FORGOT_PASSWORD = `${this.AUTH}/forgot-password`;
  public static TWO_FACTOR_AUTH = `${this.AUTH}/two-step`;
  
  public static MY_PROFILE = `/my-profile`;
  public static QUOTATION = `/quotation`;
  public static QUOTATION_CREATE = (leadId: string | number) => `${this.QUOTATION}/create/${leadId}`;
  public static SETTING = `/setting`;

  public static LEADS = `/leads`;
  public static JOB = `/job`;
}

export default SystemRoutes;
