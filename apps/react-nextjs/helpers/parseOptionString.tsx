const parseOptionString = (option: string) => {
  const stringWithSpaces = option.replace(/_/g, ' ');

  return stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1);
};

export default parseOptionString;
