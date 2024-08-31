import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";

import {
  DatasetName,
  formatImagePath,
  Person,
} from "../../services/personService";
import PersonImage from "../common/PersonImage";

const PersonPage = ({
  person,
  stars,
  handleUpdateStar,
}: {
  person: Person;
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
  const navigate = useNavigate();

  const starred = stars.includes(`${person.datasetName}/${person.id}`);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto flex flex-col justify-center">
        <div className="overflow-auto flex px-10 gap-1">
          {person.datasetName === "muct" &&
            person.imagePaths
              .slice(1)
              .reverse()
              .map((imagePath, i) => (
                <div key={i} className="flex-1">
                  <PersonImage
                    imagePath={formatImagePath(imagePath)}
                    reverse={true}
                    openModal={true}
                  />
                </div>
              ))}
          {person.imagePaths.map((imagePath, i) => (
            <div key={i} className="flex-1">
              <PersonImage
                imagePath={formatImagePath(imagePath)}
                reverse={false}
                openModal={true}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="h-14 bg-gray-800 flex items-center justify-center gap-6">
        <button
          className="rounded px-2 py-1 bg-gray-500"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
          Back
        </button>
        <button
          className={`rounded px-2 py-1 ${
            starred ? "bg-gray-900 text-gray-200" : "bg-gray-500"
          }`}
          onClick={() =>
            handleUpdateStar({
              datasetName: person.datasetName,
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
// /src/assets/datasets//src/assets/datasets/muct/muct-c-jpg-v1/i228tc-mg.jpg
// /src/assets/datasets/muct/muct-c-jpg-v1/i228tc-mg.jpg
