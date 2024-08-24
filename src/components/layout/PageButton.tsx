import { Link, useLocation } from "react-router-dom";

const PageButton = ({
  text,
  icon,
  link,
}: {
  text: string;
  icon: JSX.Element;
  link: string;
}) => {
  const location = useLocation();

  const active = location.pathname === link;

  return (
    <Link
      to={link}
      className={`px-1 rounded border ${
        active ? "bg-gray-600 border-gray-600" : "text-gray-500 border-gray-500"
      }`}
    >
      {icon}
      <span className="ml-1">{text}</span>
    </Link>
  );
};

export default PageButton;
