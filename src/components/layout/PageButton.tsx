import { Link, useLocation } from "react-router-dom";

import { StartingState } from "../../services/personService";

const PageButton = ({
  text,
  icon,
  link,
  nextStartingState,
}: {
  text: string;
  icon: JSX.Element;
  link: string;
  nextStartingState: StartingState;
}) => {
  const location = useLocation();

  const active = location.pathname === link;

  const linkState: Record<string, unknown> = {
    datasetName: nextStartingState.datasetName,
  };
  if (nextStartingState.people !== null) {
    linkState.people = nextStartingState.people.map((person) => person.id);
  }
  if (nextStartingState.person !== null) {
    linkState.person = nextStartingState.person.id;
  }

  return (
    <Link
      to={link}
      className={`px-1 rounded border ${
        active
          ? "bg-gray-600 text-gray-200 border-gray-600"
          : "text-gray-500 border-gray-500"
      }`}
      state={linkState}
    >
      {icon}
      <span className="ml-1">{text}</span>
    </Link>
  );
};

export default PageButton;
