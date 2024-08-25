import { useEffect, useState } from "react";

import {
  Dataset,
  DatasetName,
  getDatasetByName,
  getImagePath,
  Person,
  sampleDataset,
} from "../../services/personService";

const PeoplePage = ({ datasets }: { datasets: Dataset[] }) => {
  const [people, setPeople] = useState<Person[]>([]);
  // const [datasetName, setDatasetName] = useState<DatasetName>("chicago");
  const datasetName: DatasetName = "chicago";

  // Do not keep this around.
  useEffect(() => {
    if (datasets.length > 0 && people.length === 0) {
      setPeople(sampleDataset(getDatasetByName(datasets, datasetName), 3));
    }
  }, [datasets, people]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-stretch gap-10 px-10">
          {people.map((person, i) => (
            <div key={i} className="flex-1">
              <img
                src={getImagePath(person)}
                className="rounded object-cover aspect-square"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="h-14 bg-gray-800 flex items-center justify-center gap-6">
        <button className="rounded px-2 py-1 bg-gray-600">Button 1</button>
        <button className="rounded px-2 py-1 bg-gray-600">Button 2</button>
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
