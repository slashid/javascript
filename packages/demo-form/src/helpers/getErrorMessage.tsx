const getErrorMessage = (error: string) => {
  switch (error) {
    case "malformed phone number":
      return "The phone number you inserted is not valid";
    case "maformed email address":
      return "The email address you inserted is not valid";
    default:
      return error;
  }
};

export default getErrorMessage;
