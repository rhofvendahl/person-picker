import { useParams } from "react-router-dom";

const PersonPage = () => {
  const { personId } = useParams();

  return <div className="h-full">Person page ({personId})</div>;
};

export default PersonPage;
