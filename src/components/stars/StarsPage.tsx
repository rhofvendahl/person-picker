import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";

import {
  Dataset,
  getImagesFromPicks,
  getPeopleFromStars,
  getPrimaryImagePath,
  Person,
} from "../../services/personService";
import PersonImage from "../common/PersonImage";
import ExportImage from "./ExportImage";

// The picks are full or the first is london
const noAdditionalPicks = (picks: Person[]): boolean => {
  return (
    picks.length > 1 ||
    (picks.length === 1 && picks[0].datasetName === "london")
  );
};

const getImageBorder = (picks: Person[], person: Person): string => {
  if (picks.includes(person)) {
    let color = "border-green-500";
    // Only two picks max; If first pick is london no addnl pick needed
    if (noAdditionalPicks(picks)) {
      color = "border-red-500";
    }
    return `rounded p-1 border-2 ${color}`;
  } else {
    return "";
  }
};

const StarsPage = ({
  datasets,
  stars,
}: {
  datasets: Dataset[];
  stars: string[];
}) => {
  const [picking, setPicking] = useState(false);
  const [picks, setPicks] = useState<Person[]>([]);
  const [showSmiling, setShowSmiling] = useState(false);

  const navigate = useNavigate();

  const people = getPeopleFromStars(datasets, stars);

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto flex flex-col justify-center">
          <div className="overflow-auto flex gap-5 px-5">
            {people.length > 0 ? (
              people.map((person, i) => (
                <div
                  key={i}
                  className={`flex-1 relative ${getImageBorder(picks, person)}`}
                  onClick={() => {
                    if (picking) {
                      // If the person isn't picked
                      if (!picks.includes(person)) {
                        // If there's room for another
                        if (!noAdditionalPicks(picks)) {
                          setPicks([...picks, person]);
                        }
                      } else {
                        // If the person is already picked, un-pick them
                        console.log("UN PICKING", person, picks);
                        setPicks(
                          picks.filter((pickPerson) => pickPerson != person)
                        );
                      }
                    } else {
                      navigate(`/people/${person.datasetName}/${person.id}`, {
                        state: {
                          datasetName: person.datasetName,
                          people: people.map((person) => person.id),
                          person: person.id,
                        },
                      });
                    }
                  }}
                >
                  {picks.includes(person) &&
                    picks[0].datasetName === "london" && (
                      <div className="absolute bottom-full text-white w-full text-center">
                        Sufficient
                      </div>
                    )}

                  <PersonImage
                    imagePath={getPrimaryImagePath(person, showSmiling)}
                    reverse={true}
                    openModal={false}
                  />
                </div>
              ))
            ) : (
              <div className="text-white w-full text-center">
                No stars found
              </div>
            )}
          </div>
          <div className="px-5 mt-5 max-h-80">
            <ExportImage pickImages={getImagesFromPicks(picks, showSmiling)} />
          </div>
        </div>
        <div className="h-14 bg-gray-800 flex items-center justify-center gap-6">
          <button
            className={`rounded px-2 py-1 flex items-center ${
              picking ? "bg-gray-900 text-gray-200" : "bg-blue-500"
            }`}
            onClick={() => {
              if (picking) {
                setPicks([]);
                setPicking(false);
              } else {
                setPicking(true);
              }
            }}
          >
            <FontAwesomeIcon icon={faArrowUpFromBracket} className="mr-2" />
            {picking ? "Show smili" : "Pick images to export"}
          </button>
          <button
            className={`rounded px-2 py-1 flex items-center ${
              showSmiling ? "bg-gray-900 text-gray-200" : "bg-gray-500"
            }`}
            onClick={() => setShowSmiling(!showSmiling)}
          >
            {showSmiling ? "Show neutral" : "Show smiling"}
          </button>
        </div>
      </div>
    </>
  );
};

export default StarsPage;
