import { formatImagePath, Person } from "../../services/personService";

const PersonPage = ({ person }: { person: Person }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-stretch px-10">
          {person.imagePaths.map((imagePath, i) => (
            <div key={i} className="flex-1">
              <img
                src={formatImagePath(imagePath)}
                className="rounded object-cover aspect-square"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
