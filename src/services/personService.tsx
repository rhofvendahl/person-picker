import datasetInfo from "../data/dataset-info.json";

const BASE_URL = "src/assets/datasets";

export type Person = {
  id: string;
  imagePaths: string[];
  ethnicity?: string;
  gender?: string;
  age?: string;
  starred?: boolean;
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

export const getImagePath = (person: Person): string => {
  return `${BASE_URL}/${person.imagePaths[0]}`;
};

export const getDatasetByName = (
  datasets: Dataset[],
  name: DatasetName
): Dataset => {
  return datasets.filter((dataset) => dataset.name === name)[0];
};
