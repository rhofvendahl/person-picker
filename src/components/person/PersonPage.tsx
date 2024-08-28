import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";

import {
  DatasetName,
  formatImagePath,
  Person,
  StartingState,
} from "../../services/personService";

const PersonPage = ({
  datasetName,
  person,
  nextStartingState,
  stars,
  handleUpdateStar,
}: {
  datasetName: DatasetName;
  person: Person;
  nextStartingState: StartingState;
  stars: string[];
  handleUpdateStar: ({
    datasetName,
    id,
    shouldStar,
  }: {
    datasetName: DatasetName;
    id: string;
    shouldStar: boolean;
  }) => void;
}) => {
  const starred = stars.includes(`${datasetName}/${person.id}`);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-stretch px-10 gap-1">
          {person.imagePaths.map((imagePath, i) => (
            <div key={i} className="flex-1">
              <img
                src={formatImagePath(imagePath)}
                className="rounded object-cover aspect-square max-h-96 m-auto"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="h-14 bg-gray-800 flex items-center justify-center gap-6">
        <Link to="/people" state={nextStartingState}>
          <button className="rounded px-2 py-1 bg-gray-500">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            Back
          </button>
        </Link>
        <button
          className="rounded px-2 py-1 bg-gray-500"
          onClick={() =>
            handleUpdateStar({
              datasetName,
              id: person.id,
              shouldStar: !starred,
            })
          }
        >
          <FontAwesomeIcon icon={faStar} className="mr-1" />
          {starred ? "Unstar" : "Star"}
        </button>
      </div>
    </div>
  );
};

export default PersonPage;
