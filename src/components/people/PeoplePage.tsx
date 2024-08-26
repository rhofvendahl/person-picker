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
        <button className="rounded px-2 py-1 bg-gray-600">Button 1</button>
        <select
          className="p-1 rounded border border-gray-200 w-full h-8"
          value={datasetName}
          onChange={(event) =>
            setDatasetName(event.target.value as DatasetName)
          }
        >
          <option value="chicago">Chicago</option>
          <option value="london">London</option>
          <option value="muct">MUCT</option>
          <option value="tpdne">TPDNE</option>
        </select>
        <button
          className="rounded px-2 py-1 bg-green-600"
          onClick={() =>
            setPeople(sampleDataset(getDatasetByName(datasets, datasetName), 3))
          }
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default PeoplePage;
