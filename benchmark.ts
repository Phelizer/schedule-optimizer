import { beesAlgorithm } from "./beesAlgorithm";
import { beesOptions, geneticOptions } from "./consts";
import { geneticAlgorith } from "./geneticAlgorithm";
import { greedyAlgorithm } from "./greedyAlgorithm";
import { inputFactory } from "./inputGenerator";
import { Task } from "./models/Task.model";
import { fitnessOfTasks } from "./utils";

for (let i = 1; i < 11; i++) {
  const numberOfTasks = i * 20;
  const inputData = inputFactory(numberOfTasks, 0, 24);

  const appliedGreedyAlgorithm = () => greedyAlgorithm(inputData);
  const appliedBeesAlgorithm = () => beesAlgorithm(inputData, beesOptions);
  const appliedGeneticAlgorithm = () =>
    geneticAlgorith(inputData, geneticOptions);

  const appliedAlgorithms: [
    AppliedAlgorithm,
    AppliedAlgorithm,
    AppliedAlgorithm
  ] = [appliedGreedyAlgorithm, appliedGeneticAlgorithm, appliedBeesAlgorithm];

  console.log("============");
  console.log("Number of tasks: ", numberOfTasks);
  console.log(
    "Times: ",
    appliedAlgorithms.map((fn) => measureTime(fn))
  );

  console.log("Fitnesses: ", getFitnesses(appliedAlgorithms));
  console.log("============");
}

process.exit();

type AppliedAlgorithm = () => Task[];
function measureTime(func: AppliedAlgorithm) {
  const start = Date.now();
  func();
  return Date.now() - start;
}

function getFitnesses(
  algorithms: [AppliedAlgorithm, AppliedAlgorithm, AppliedAlgorithm]
) {
  return algorithms.map((func) => func()).map(fitnessOfTasks);
}
