import { beesAlgorithm } from "./beesAlgorithm";
import { geneticAlgorith } from "./geneticAlgorithm";
import { greedyAlgorithm } from "./greedyAlgorithm";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import fs from "fs";
import { Task } from "./models/Task.model";
import { prop } from "ramda";
import { fitnessOfTasks } from "./utils";
import { beesOptions, geneticOptions } from "./consts";

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

  process.exit();
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
