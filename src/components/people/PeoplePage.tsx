import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import {
  Dataset,
  DatasetName,
  getDatasetByName,
  getPrimaryImagePath,
  Person,
  sampleDataset,
} from "../../services/personService";
import PersonImage from "../common/PersonImage";

const PeoplePage = ({
  datasets,
  people,
  handleSetPeople,
  datasetName,
  handleSetDatasetName,
  stars,
}: {
  datasets: Dataset[];
  people: Person[];
  handleSetPeople: (people: Person[]) => void;
  datasetName: DatasetName;
  handleSetDatasetName: (datasetName: DatasetName) => void;
  stars: string[];
}) => {
  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleSetPeople(
          sampleDataset(getDatasetByName(datasets, datasetName), people.length)
        );
      }
    };
    window.addEventListener("keydown", handleSpace);

    // Remove handler on unmount
    return () => window.removeEventListener("keydown", handleSpace);
  }, [datasets, datasetName, people.length, handleSetPeople]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto flex flex-col justify-center">
        <div className="overflow-auto flex gap-10 px-10">
          {people.map((person, i) => (
            <div key={i} className="flex-1 relative">
              <Link
                to={`/people/${datasetName}/${person.id}`}
                state={{
                  datasetName,
                  people: people.map((person) => person.id),
                  person: person.id,
                }}
              >
                <PersonImage
                  imagePath={getPrimaryImagePath(person)}
                  reverse={false}
                  openModal={false}
                />
              </Link>
              {stars.includes(`${person.datasetName}/${person.id}`) && (
                <div className="absolute top-full left-0 right-0">
                  <FontAwesomeIcon
                    className="w-full mx-auto text-yellow-500 text-lg mt-2"
                    icon={faStar}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="h-14 bg-gray-800 flex items-center justify-center gap-6">
        <label>
          <span className="text-gray-200 mr-1">Show</span>
          <input
            className="rounded bg-gray-500 pl-1 w-9"
            type="number"
            min="1"
            max="5"
            value={people.length}
            onChange={(event) =>
              handleSetPeople(
                sampleDataset(
                  getDatasetByName(datasets, datasetName),
                  parseInt(event.target.value)
                )
              )
            }
          />
        </label>
        <label>
          <span className="text-gray-200 mr-1">Set</span>
          <select
            className="p-1 rounded bg-gray-500"
            value={datasetName}
            onChange={(event) => {
              handleSetDatasetName(event.target.value as DatasetName);
              handleSetPeople(
                sampleDataset(
                  getDatasetByName(datasets, event.target.value as DatasetName),
                  people.length
                )
              );
            }}
          >
            <option value="chicago">Chicago</option>
            <option value="london">London</option>
            <option value="muct">MUCT</option>
            <option value="tpdne">TPDNE</option>
          </select>
        </label>
        <button
          className="rounded px-2 py-1 bg-green-500"
          onClick={() =>
            handleSetPeople(
              sampleDataset(
                getDatasetByName(datasets, datasetName),
                people.length
              )
            )
          }
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default PeoplePage;
