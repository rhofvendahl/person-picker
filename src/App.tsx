import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faPeopleGroup,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import StarsPage from "./components/stars/StarsPage";
import PeoplePage from "./components/people/PeoplePage";
import PageButton from "./components/layout/PageButton";
import {
  DatasetName,
  getDatasetByName,
  getDatasets,
  getPerson,
  parseDatasetName,
  parseStartingState,
  Person,
  sampleDataset,
  StartingState,
} from "./services/personService";
import PersonPage from "./components/person/PersonPage";

export type Page = "people" | "person" | "stars";

const App = () => {
  const datasets = getDatasets();

  const location = useLocation();
  const startingState = parseStartingState(datasets, location.state);

  const { datasetName: datasetNameValue, personId: personIdValue } =
    useParams();
  const paramDatasetName =
    datasetNameValue !== undefined ? parseDatasetName(datasetNameValue) : null;
  const paramPerson =
    paramDatasetName !== null && personIdValue !== undefined
      ? getPerson({
          datasets,
          datasetName: paramDatasetName,
          personId: personIdValue,
        })
      : null;

  // If datasetName or personId are in URL, that takes precedence over startingState
  let initDatasetName =
    paramDatasetName !== null ? paramDatasetName : startingState.datasetName;
  let initPeople = startingState.people;
  let initPerson = paramPerson !== null ? paramPerson : startingState.person;

  // Fallback values
  if (initDatasetName === null) {
    initDatasetName = "chicago";
  }
  if (initPeople === null) {
    initPeople = sampleDataset(getDatasetByName(datasets, initDatasetName), 3);
  }
  if (initPerson === null) {
    initPerson = sampleDataset(
      getDatasetByName(datasets, initDatasetName),
      1
    )[0];
  }

  const [datasetName, setDatasetName] = useState<DatasetName>(initDatasetName);
  const person: Person = initPerson;
  const [people, setPeople] = useState<Person[]>(initPeople);

  // What will be passed to any subsequent page changes
  const nextStartingState: StartingState = {
    datasetName,
    person,
    people,
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col">
      <div className="bg-gray-850 h-10 flex gap-2 items-center justify-end px-2">
        <PageButton
          text="People"
          icon={<FontAwesomeIcon icon={faPeopleGroup} />}
          link="/people"
          nextStartingState={nextStartingState}
        />
        <PageButton
          text="Person"
          icon={<FontAwesomeIcon icon={faPerson} />}
          link={person !== null ? `/people/${datasetName}/${person.id}` : "#;"}
          nextStartingState={nextStartingState}
        />
        <PageButton
          text="Stars"
          icon={<FontAwesomeIcon icon={faStar} />}
          link="/stars"
          nextStartingState={nextStartingState}
        />
      </div>
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/people" />} />
          <Route
            path="/people"
            element={
              <PeoplePage
                datasets={datasets}
                people={people}
                setPeople={setPeople}
                datasetName={datasetName}
                setDatasetName={setDatasetName}
              />
            }
          ></Route>
          <Route
            path="/people/:datasetName/:personId"
            element={<PersonPage person={person} />}
          ></Route>
          <Route path="/stars" element={<StarsPage />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
