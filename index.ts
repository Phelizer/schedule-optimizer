import { beesAlgorithm, BeesOptions } from "./beesAlgorithm";
import { geneticAlgorith, GeneticOptions } from "./geneticAlgorithm";
import { greedyAlgorithm } from "./greedyAlgorithm";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import fs from "fs";
import { Task } from "./models/Task.model";
import { prop } from "ramda";
import { fitnessOfTasks } from "./utils";

const geneticOptions: GeneticOptions = {
  crossoverChance: 0.7,
  populationMaxSize: 70,
  mutationChance: 0.3,
  iterationAllowed: 100,
};

const beesOptions: BeesOptions = {
  beesToBestSchedulesNumber: 15,
  beesToOtherSchedulesNumber: 10,
  bestSchedulesNumber: 20,
  totalPickedSchedulesNumber: 40,
  iterationAllowed: 10,
};

const rl = readline.createInterface({ input, output });
rl.question("Input path to the file with input data ", (path) => {
  const rawData = fs.readFileSync(path);
  const inputData = JSON.parse(rawData.toString()).map(parseISODateFields);

  displayResult("Greedy Algorithm", greedyAlgorithm(inputData));

  displayResult(
    "Genetic Algorithm",
    geneticAlgorith(inputData, geneticOptions)
  );

  displayResult("Bees Colony Algorithm", beesAlgorithm(inputData, beesOptions));
});

function displayResult(algorithmName: string, result: Task[]) {
  console.log("=====================");
  console.log(
    `${algorithmName}: ${result.map(
      prop("executor")
    )}; total weight: ${fitnessOfTasks(result)}`
  );
  console.log("=====================");
}

function parseISODateFields(obj: Task) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      key === "startTime" || key === "endTime"
        ? [key, new Date(value)]
        : [key, value]
    )
  );
}
