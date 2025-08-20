class API_ENDPOINTS {
  // user
  public static USER_BASE = "/user";

  
  //auth
  public static AUTH_BASE = "/auth";
  public static LOGIN = `${this.AUTH_BASE}/login`;
  public static PROFILE = `${this.AUTH_BASE}/profile`;
  public static REFRESH_TOKEN = `${this.AUTH_BASE}/refresh-token`;
  public static REGISTER_BASE = `${this.AUTH_BASE}/register`;
  public static MANAGER_REGISTER = `${this.REGISTER_BASE}/manager`;
  public static EMPLOYEE_REGISTER = `${this.REGISTER_BASE}/employee`;
  public static VERIFY_EMAIL = `${this.AUTH_BASE}/verify-email-otp`;
  public static RESEND_OTP = `${this.AUTH_BASE}/resend-email-otp`;
  public static FORGOT_PASSWORD = `${this.AUTH_BASE}/forgot-password`;
  public static RESET_PASSWORD = `${this.AUTH_BASE}/reset-password`;
  public static UPDATE_PASSWORD = `${this.AUTH_BASE}/update-password`;
  public static LOGOUT = `${this.AUTH_BASE}/logout`;

 // contractors
 public static CONTRACTOR_BASE = "/contractor";
 public static CREATE_CONTRACTOR = `${this.CONTRACTOR_BASE}`;
 public static GET_CONTRACTORS = `${this.CONTRACTOR_BASE}`;

}

export default API_ENDPOINTS;
