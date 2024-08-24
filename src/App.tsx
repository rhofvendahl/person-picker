import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faPeopleGroup,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import PersonPage from "./components/person/PersonPage";
import StarsPage from "./components/stars/StarsPage";
import PeoplePage from "./components/people/PeoplePage";
import PageButton from "./components/layout/PageButton";
import { Person } from "./services/personService";

export type Page = "people" | "person" | "stars";

const App = () => {
  const [activePerson] = useState<Person | null>({ id: "some-person-id" });

  return (
    <div className="bg-gray-900 h-full text-white flex flex-col">
      <div className="bg-gray-850 h-10 flex gap-2 items-center justify-end px-2">
        <PageButton
          text="People"
          icon={<FontAwesomeIcon icon={faPeopleGroup} />}
          link="/people"
        />
        <PageButton
          text="Person"
          icon={<FontAwesomeIcon icon={faPerson} />}
          link={activePerson !== null ? `/people/${activePerson.id}` : "#;"}
        />
        <PageButton
          text="Stars"
          icon={<FontAwesomeIcon icon={faStar} />}
          link="/stars"
        />
      </div>
      <div className="flex-1">
        <Routes>
          <Route path="/people" element={<PeoplePage />}></Route>
          <Route path="/people/:personId" element={<PersonPage />}></Route>
          <Route path="/stars" element={<StarsPage />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
