import { Logo as TLogo } from "../../../context/config-context";

type Props = {
  logo?: TLogo;
};

export const Logo: React.FC<Props> = ({ logo }) => {
  if (typeof logo === "string") {
    return (
      <img className="sid-logo sid-logo--image" src={logo} alt="Company logo" />
    );
  }

  return <div className="sid-logo sid-logo--component">{logo}</div>;
};
