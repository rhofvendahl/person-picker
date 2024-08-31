import { Link } from "react-router-dom";
import {
  Dataset,
  getPeopleFromStars,
  getPrimaryImagePath,
} from "../../services/personService";

const StarsPage = ({
  datasets,
  stars,
}: {
  datasets: Dataset[];
  stars: string[];
}) => {
  const people = getPeopleFromStars(datasets, stars);

  return (
    <div className="h-full flex flex-col">
      {" "}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-stretch gap-10 px-10">
          {people.length > 0 ? (
            people.map((person, i) => (
              <div key={i} className="flex-1">
                <Link
                  to={`/people/${person.datasetName}/${person.id}`}
                  state={{
                    datasetName: person.datasetName,
                    people: people.map((person) => person.id),
                    person: person.id,
                  }}
                >
                  <img
                    src={getPrimaryImagePath(person)}
                    className="rounded object-cover aspect-square max-h-96 m-auto"
                  />
                </Link>
              </div>
            ))
          ) : (
            <div className="text-white w-full text-center">No stars found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarsPage;
