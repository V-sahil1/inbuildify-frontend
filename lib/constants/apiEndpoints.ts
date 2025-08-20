class API_ENDPOINTS {
  // // user
  // public static USER_BASE = "/users";
  // public static CREATE_USER = `${this.USER_BASE}`;
  // public static GET_USERS = `${this.USER_BASE}`;
  
  //auth
  public static AUTH_BASE = "/auth";
  public static LOGIN = `${this.AUTH_BASE}/login`;
  public static PROFILE = `${this.AUTH_BASE}/profile`;
  public static REFRESH_TOKEN = `${this.AUTH_BASE}/refresh-token`;
  public static REGISTER_BASE = `${this.AUTH_BASE}/register`;
  public static VERIFY_EMAIL = `${this.AUTH_BASE}/verify-email-otp`;
  public static RESEND_OTP = `${this.AUTH_BASE}/resend-email-otp`;
  public static FORGOT_PASSWORD = `${this.AUTH_BASE}/forgot-password`;
  public static RESET_PASSWORD = `${this.AUTH_BASE}/reset-password`;
  public static UPDATE_PASSWORD = `${this.AUTH_BASE}/update-password`;
  public static ACCEPT_INVITE = `${this.AUTH_BASE}/accept-invite`;
  public static LOGOUT = `${this.AUTH_BASE}/logout`;

  // users
  public static INVITE_USER = `${this.AUTH_BASE}/invite-user`;
  public static GET_USERS = `${this.AUTH_BASE}/users`;

 // contractors
 public static CONTRACTOR_BASE = "/contractor";
 public static CREATE_CONTRACTOR = `${this.CONTRACTOR_BASE}`;
 public static GET_CONTRACTORS = `${this.CONTRACTOR_BASE}`;

 //customers
 public static CUSTOMER_BASE = "/customer"
  public static CREATE_CUSTOMER = `${this.CUSTOMER_BASE}`;
 public static GET_CUSTOMERS = `${this.CUSTOMER_BASE}`;

 //leads
 public static LEAD_BASE = "/leads"
 public static CREATE_LEAD = `${this.LEAD_BASE}`;
 public static GET_LEAD_BY_ID = (id: string) => `${this.LEAD_BASE}/${id}`;

}

export default API_ENDPOINTS;
