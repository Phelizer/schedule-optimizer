import { compose, curry, splitEvery } from "ramda";
import { MOCKED_TASKS } from "./mockedData";
import { BinarySchedule, Task } from "./models/Task.model";
import { probability, tasksToBinarySchedule } from "./utils";

interface GeneticOptions {
  crossoverChance: number;
  mutationChance: number;
  populationMaxSize: number;
}

export function geneticAlgorith(
  tasks: Task[],
  options: GeneticOptions
): Task[] {
  // forming initial population
  const appliedTasksToBinarySchedule = curry(tasksToBinarySchedule)(tasks); // was MOCKED_TASKS
  const initialPopulation = initPopulationFactory(appliedTasksToBinarySchedule)(
    tasks
  );

  // crossover
  const pairs = splitEvery(2, initialPopulation).filter(
    (chunk): chunk is [BinarySchedule, BinarySchedule] => chunk.length === 2
  );

  const appliedBreed = (parents: [BinarySchedule, BinarySchedule]) =>
    breed(tasks.length, options.crossoverChance, parents);

  const children: BinarySchedule[] = pairs
    .map(appliedBreed)
    .reduce((a: BinarySchedule[], b) => [...a, ...b], []);
}

function breed(
  numOfAllTasks: number,
  crossoverChance: number,
  parents: [BinarySchedule, BinarySchedule]
): [BinarySchedule, BinarySchedule] | [] {
  if (probability(crossoverChance)) {
    return crossover(...parents, randomCrossoverPoint(numOfAllTasks));
  }

  return [];
}

function formInitialPopulation(tasks: Task[]): Task[][] {
  return tasks.map((task) => [task]);
}

const initPopulationFactory = (adapter: (tasks: Task[]) => BinarySchedule) =>
  compose((schedules) => schedules.map(adapter), formInitialPopulation);

/**
 * @param  {BinaryTask} schedule1
 * @param  {BinaryTask} schedule2
 * @param  {number} crossoverPoint - start index of second part of a child
 * @returns [BinaryTask, BinaryTask]
 */
export function crossover(
  schedule1: BinarySchedule,
  schedule2: BinarySchedule,
  crossoverPoint: number
): [BinarySchedule, BinarySchedule] {
  const child1 = [
    ...schedule1.slice(0, crossoverPoint),
    ...schedule2.slice(crossoverPoint),
  ];

  const child2 = [
    ...schedule2.slice(0, crossoverPoint),
    ...schedule1.slice(crossoverPoint),
  ];

  return [child1, child2];
}

/**
 * @param  {number} length - length of BinaryTask representation of parents
 * @returns number
 */
export function randomCrossoverPoint(length: number): number {
  const min = 1;
  const max = length - 1;
  return Math.floor(Math.random() * (max - min)) + min;
}
