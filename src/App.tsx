import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
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
  Dataset,
  DatasetName,
  getDatasetByName,
  getDatasets,
  getPerson,
  getStars,
  parseDatasetName,
  parseStartingState,
  Person,
  sampleDataset,
  StartingState,
  updateStar,
} from "./services/personService";
import PersonPage from "./components/person/PersonPage";

const parsePersonParams = (
  datasets: Dataset[],
  datasetNameValue: string | undefined,
  personIdValue: string | undefined
): { paramDatasetName: DatasetName | null; paramPerson: Person | null } => {
  const nullReturn = { paramDatasetName: null, paramPerson: null };

  if (datasetNameValue === undefined || personIdValue === undefined) {
    return nullReturn;
  }
  const paramDatasetName = parseDatasetName(datasetNameValue);
  if (paramDatasetName === null) {
    return nullReturn;
  }
  const paramPerson = getPerson({
    datasets,
    datasetName: paramDatasetName,
    personId: personIdValue,
  });
  if (paramPerson === null) {
    return nullReturn;
  }
  return { paramDatasetName, paramPerson };
};

const App = () => {
  const datasets = getDatasets();

  const location = useLocation();
  const startingState = parseStartingState(datasets, location.state);

  // useParams can only be called in component within Route, hence useMatch here
  const match = useMatch("/people/:datasetName/:personId");
  const { paramDatasetName, paramPerson } = parsePersonParams(
    datasets,
    match?.params.datasetName,
    match?.params.personId
  );

  // If datasetName or personId are in URL, that takes precedence over startingState
  let initDatasetName =
    paramDatasetName !== null ? paramDatasetName : startingState.datasetName;
  let initPerson = paramPerson !== null ? paramPerson : startingState.person;
  let initPeople = startingState.people;

  // Fallback values
  if (initDatasetName === null) {
    initDatasetName = "london";
  }
  if (initPerson === null) {
    initPerson = sampleDataset(
      getDatasetByName(datasets, initDatasetName),
      1
    )[0];
  }
  if (initPeople === null) {
    initPeople = sampleDataset(getDatasetByName(datasets, initDatasetName), 3);
  }

  const [datasetName, setDatasetName] = useState<DatasetName>(initDatasetName);
  const person: Person = initPerson;
  const [people, setPeople] = useState<Person[]>(initPeople);

  // What will be passed to any subsequent page changes
  const nextStartingState: StartingState = {
    datasetName,
    person: initPerson,
    people,
  };

  const [stars, setStars] = useState(getStars());
  const handleUpdateStar = ({
    datasetName,
    id,
    shouldStar,
  }: {
    datasetName: DatasetName;
    id: string;
    shouldStar: boolean;
  }) => {
    const newStars = updateStar({ datasetName, id, shouldStar });
    setStars(newStars);
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
          <Route
            path="/people/:datasetName/:personId"
            element={
              <PersonPage
                datasetName={datasetName}
                person={person}
                nextStartingState={nextStartingState}
                stars={stars}
                handleUpdateStar={handleUpdateStar}
              />
            }
          ></Route>
          <Route
            path="/people"
            element={
              <PeoplePage
                datasets={datasets}
                people={people}
                handleSetPeople={setPeople}
                datasetName={datasetName}
                handleSetDatasetName={setDatasetName}
                stars={stars}
              />
            }
          ></Route>
          <Route
            path="/stars"
            element={<StarsPage datasets={datasets} stars={stars} />}
          ></Route>
          <Route path="/" element={<Navigate to="/people" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
