import { BeesOptions } from "./beesAlgorithm";
import { GeneticOptions } from "./geneticAlgorithm";

export const geneticOptions: GeneticOptions = {
  crossoverChance: 0.7,
  populationMaxSize: 200,
  mutationChance: 0.3,
  iterationAllowed: 100,
};

export const beesOptions: BeesOptions = {
  beesToBestSchedulesNumber: 15,
  beesToOtherSchedulesNumber: 10,
  bestSchedulesNumber: 9,
  totalPickedSchedulesNumber: 18,
  iterationAllowed: 100,
};
