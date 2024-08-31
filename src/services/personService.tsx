import datasetInfo from "../assets/json/dataset-info.json";

const BASE_URL = "src/assets/datasets";

export type Person = {
  id: string;
  datasetName: DatasetName;
  imagePaths: string[];
  ethnicity?: string;
  gender?: string;
  age?: string;
};

export type DatasetName = "chicago" | "london" | "muct" | "tpdne";

export type Dataset = {
  name: DatasetName;
  fullName: string;
  link: string;
  termsOfUse: string;
  collectionMethod: string;
  consentStatement: string;
  citation: string;
  people: Person[];
};

export const getDatasets = (): Dataset[] => {
  return datasetInfo as Dataset[];
};

export const sampleDataset = (dataset: Dataset, n: number): Person[] => {
  const shuffled = dataset.people.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

export const formatImagePath = (imagePath: string): string => {
  return `/${BASE_URL}/${imagePath}`;
};

export const getPrimaryImagePath = (person: Person): string => {
  if (person.imagePaths.length === 0) {
    return "";
  }

  switch (person.datasetName) {
    case "chicago":
      return formatImagePath(person.imagePaths[0]);
    case "london":
      return formatImagePath(person.imagePaths[2]);
    case "muct":
      return formatImagePath(person.imagePaths[0]);
    case "tpdne":
      return formatImagePath(person.imagePaths[0]);
    default:
      return "";
  }
};

export const getDatasetByName = (
  datasets: Dataset[],
  name: DatasetName
): Dataset => {
  return datasets.filter((dataset) => dataset.name === name)[0];
};

export const getPerson = ({
  datasets,
  datasetName,
  personId,
}: {
  datasets: Dataset[];
  datasetName: DatasetName;
  personId: string;
}): Person | null => {
  const dataset = getDatasetByName(datasets, datasetName);
  const matches = dataset.people.filter((person) => person.id === personId);
  if (matches.length === 0) {
    return null;
  }
  return matches[0];
};

export const parseDatasetName = (value: string): DatasetName | null => {
  const names: DatasetName[] = ["chicago", "london", "muct", "tpdne"];
  const datasetName = value as DatasetName;
  if (names.includes(datasetName)) {
    return datasetName;
  }
  return null;
};

export type StartingState = {
  people: Person[] | null;
  person: Person | null;
  datasetName: DatasetName | null;
};

export const parseStartingState = (
  datasets: Dataset[],
  state: Record<string, unknown> | null
): StartingState => {
  const startingState: StartingState = {
    people: null,
    person: null,
    datasetName: null,
  };

  if (state === null) {
    return startingState;
  }

  if (typeof state.datasetName === "string") {
    startingState.datasetName = parseDatasetName(state.datasetName);
  }

  if (startingState.datasetName !== null && typeof state.person === "string") {
    startingState.person = getPerson({
      datasets,
      datasetName: startingState.datasetName,
      personId: state.person,
    });
  }

  // Filters out any invalid IDs
  const people: Person[] = [];
  if (
    startingState.datasetName !== null &&
    Array.isArray(state.people) &&
    state.people.length > 0
  ) {
    for (const personId of state.people) {
      if (typeof personId !== "string") {
        continue;
      }
      const person = getPerson({
        datasets,
        datasetName: startingState.datasetName,
        personId,
      });
      if (person === null) {
        continue;
      }
      people.push(person);
    }
  }
  if (people.length > 0) {
    startingState.people = people;
  }

  return startingState;
};

export const getStars = (): string[] => {
  const starsStr = localStorage.getItem("stars");
  if (starsStr === null) {
    return [];
  }
  const stars = JSON.parse(starsStr);
  if (!Array.isArray(stars)) {
    throw Error("Could not get stars: improperly formed cache");
  }
  return stars;
};

export const updateStar = ({
  datasetName,
  id,
  shouldStar,
}: {
  datasetName: DatasetName;
  id: string;
  shouldStar: boolean;
}): string[] => {
  let stars = getStars();

  const newStar = `${datasetName}/${id}`;

  if (shouldStar && !stars.includes(newStar)) {
    stars.push(newStar);
    localStorage.setItem("stars", JSON.stringify(stars));
  }
  if (!shouldStar && stars.includes(newStar)) {
    stars = stars.filter((star) => star !== newStar);
    localStorage.setItem("stars", JSON.stringify(stars));
  }
  return stars;
};

export const getPeopleFromStars = (
  datasets: Dataset[],
  stars: string[]
): Person[] => {
  const people = [];
  for (const star of stars) {
    const datasetNameId = star.split("/");
    if (datasetNameId.length !== 2) {
      continue;
    }
    const datasetName = parseDatasetName(datasetNameId[0]);
    if (datasetName === null) {
      continue;
    }
    const person = getPerson({
      datasets,
      datasetName,
      personId: datasetNameId[1],
    });
    if (person !== null) {
      people.push(person);
    }
  }
  return people;
};
export const sufficientDatasetNames: DatasetName[] = ["london", "muct"];

export type PickImage = {
  path: string;
  reverse: boolean;
};

const getPickImage = (imagePath: string, reverse: boolean): PickImage => {
  return { path: formatImagePath(imagePath), reverse };
};

const getLondonImages = (person: Person): PickImage[] => {
  return person.imagePaths.map((imagePath) => getPickImage(imagePath, false));
};
const getMuctImages = (person: Person): PickImage[] => {
  const reversed = person.imagePaths
    .slice(1)
    .map((imagePath) => getPickImage(imagePath, true))
    .reverse();
  return [
    ...reversed,
    ...person.imagePaths.map((imagePath) => getPickImage(imagePath, false)),
  ];
};

export const getImagesFromPicks = (picks: Person[]): PickImage[] => {
  if (picks.length === 0) {
    return [];
  }

  switch (picks[0].datasetName) {
    // London has a great set of images - discard second pick
    case "london": {
      return getLondonImages(picks[0]);
    }
    case "muct": {
      const muctImages = getMuctImages(picks[0]);
      // If secondpick is london, that should replace the non-front views
      if (picks.length > 1 && picks[1].datasetName === "london") {
        const newSet = [...getLondonImages(picks[1])];
        newSet[2] = muctImages[2];
        return newSet;
      }
      // If there's just one pick or other picks aren't london, just return
      // muct images - they're still fairly complete
      return getMuctImages(picks[0]);
    }
    // That leaves chicago and tpdne - both single-image datasets
    default: {
      // If there's just one pick or the second is also a single, just return that
      const singleImage: PickImage = {
        path: formatImagePath(picks[0].imagePaths[0]),
        reverse: false,
      };
      if (
        picks.length === 1 ||
        picks[1].datasetName === "chicago" ||
        picks[1].datasetName === "tpdne"
      ) {
        return [singleImage];
      }
      // The second pick should then be london or muct
      let newSet: PickImage[] = [];
      if (picks[1].datasetName === "london") {
        newSet = [...getLondonImages(picks[1])];
      }
      if (picks[1].datasetName === "muct") {
        newSet = [...getMuctImages(picks[1])];
      }
      newSet[2] = singleImage;
      return newSet;
    }
  }
};
