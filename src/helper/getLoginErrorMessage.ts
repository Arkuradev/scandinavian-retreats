export function getLoginErrorMessage(status?: number) {
  switch (status) {
    // Login Errors
    case 400:
    case 401:
      return "Incorrect email or password";
    case 429:
      return "Too many attempts. Please wait a moment.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "Login failed. Please try again.";
    // Register Errors
    // Venue render error
    // Venue post error
    // Venue edit error
    // Profile edit error
  }
}
