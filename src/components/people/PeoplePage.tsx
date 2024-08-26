import { Link } from "react-router-dom";

import {
  Dataset,
  DatasetName,
  getDatasetByName,
  getPrimaryImagePath,
  Person,
  sampleDataset,
} from "../../services/personService";

const PeoplePage = ({
  datasets,
  people,
  setPeople,
  datasetName,
  setDatasetName,
}: {
  datasets: Dataset[];
  people: Person[];
  setPeople: (people: Person[]) => void;
  datasetName: DatasetName;
  setDatasetName: (datasetName: DatasetName) => void;
}) => {
  console.log("DATSET NAME", datasetName);
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-stretch gap-10 px-10">
          {people.map((person, i) => (
            <div key={i} className="flex-1">
              <Link
                to={`/people/${datasetName}/${person.id}`}
                state={{
                  datasetName,
                  people: people.map((person) => person.id),
                  person: person.id,
                }}
              >
                <img
                  src={getPrimaryImagePath(datasetName, person)}
                  className="rounded object-cover aspect-square"
                />
              </Link>
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
              setPeople(
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
              setDatasetName(event.target.value as DatasetName);
              setPeople(
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
            setPeople(
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
