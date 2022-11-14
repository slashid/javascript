export const email = (email: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (String(email).toLowerCase().match(emailRegex)) {
    return true;
  } else {
    return false;
  }
};

export const phoneNumber = (number: string) => {
  const numberRegex = /^[+](?=.*\d).{6,20}$/im;

  if (String(number).toLowerCase().match(numberRegex)) {
    return true;
  } else {
    return false;
  }
};
