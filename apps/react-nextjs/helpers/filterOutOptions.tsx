const filterOutOptions = (
  identifier: string | undefined,
  options: string[] | undefined, 
  excludeList: string[] | undefined, 
) => {
  if (!options) {
    return;
  }
  if (excludeList)
    options = options.filter(option => excludeList?.includes(option) == false)

  if (identifier === 'email_address') {
    return options.filter(
      (option) => option !== 'webauthn_via_email'
    );
  }

  if (identifier === 'phone_number') {
    return options.filter(
      (option) => option !== 'webauthn_via_sms'
    );
  }
};

export default filterOutOptions;
