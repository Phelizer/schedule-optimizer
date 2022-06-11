import { compose, curry, prop, reverse, sortBy, splitEvery } from "ramda";
import { BinarySchedule, Task } from "./models/Task.model";
import {
  binaryScheduleToTasks,
  checkIfScheduleHasOverlaps,
  fitness,
  isUndefined,
  probability,
  randomInt,
  tasksToBinarySchedule,
} from "./utils";

interface GeneticOptions {
  crossoverChance: number;
  mutationChance: number;
  populationMaxSize: number;
  iterationAllowed: number;
}

export function geneticAlgorith(
  tasks: Task[],
  options: GeneticOptions
): Task[] {
  // form initial population
  const appliedTasksToBinarySchedule = curry(tasksToBinarySchedule)(tasks);
  const initialPopulation = initPopulationFactory(appliedTasksToBinarySchedule)(
    tasks
  );

  const result = geneticAlgorithStep(initialPopulation, tasks, options, 1);

  if (!isUndefined(result)) {
    return binaryScheduleToTasks(tasks, result);
  }

  return [];
}

function geneticAlgorithStep(
  population: BinarySchedule[],
  listOfTasks: Task[],
  options: GeneticOptions,
  iterationNumber: number
): BinarySchedule | undefined {
  // crossover
  const pairs = splitEvery(2, population).filter(
    (chunk): chunk is [BinarySchedule, BinarySchedule] => chunk.length === 2
  );

  const appliedBreed = (parents: [BinarySchedule, BinarySchedule]) =>
    breed(listOfTasks.length, options.crossoverChance, parents);

  const children: BinarySchedule[] = pairs
    .map(appliedBreed)
    .reduce((a: BinarySchedule[], b) => [...a, ...b], []);

  // mutations
  const mutated = children.map((child) =>
    mutateByChance(options.mutationChance, child)
  );

  // allow to survive only for those schedules, which are valid (have no overlaps)
  const parentsAndChildren = [...population, ...mutated];
  const validSchedules = parentsAndChildren.filter(
    (schedule) => !checkIfScheduleHasOverlaps(listOfTasks, schedule)
  );

  // estimations
  const estimatedSchedules = validSchedules.map((schedule) => ({
    fitness: fitness(binaryScheduleToTasks(listOfTasks, schedule)),
    schedule,
  }));

  // survival
  const ascendingEstimatedSchedules = sortBy(
    prop("fitness"),
    estimatedSchedules
  );

  const descendingEstimatedSchedules = reverse(ascendingEstimatedSchedules);
  const descendingSchedules = descendingEstimatedSchedules.map(
    prop("schedule")
  );

  const nextPopulation = descendingSchedules.slice(
    0,
    options.populationMaxSize
  );

  // exit clause
  if (iterationNumber >= options.iterationAllowed) {
    return nextPopulation[0];
  }

  return geneticAlgorithStep(
    nextPopulation,
    listOfTasks,
    options,
    iterationNumber + 1
  );
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

function mutateByChance(
  mutationChance: number,
  schedule: BinarySchedule
): BinarySchedule {
  if (probability(mutationChance)) {
    return mutate(schedule);
  }

  return schedule;
}

function mutate(schedule: BinarySchedule): BinarySchedule {
  const indexes = schedule.map((_, index) => index);
  const indexesOfPresentTasks = indexes.filter((index) => schedule[index]);
  const indexesOfAbsentTasks = indexes.filter((index) => !schedule[index]);

  const [minPresentIndex, maxPresentIndex] = [0, indexesOfPresentTasks.length];
  const indexOfPresentToToggle =
    indexesOfPresentTasks[randomInt(minPresentIndex, maxPresentIndex)];

  const [minAbsentIndex, maxAbsentIndex] = [0, indexesOfAbsentTasks.length];
  const indexOfAbsentToToggle =
    indexesOfAbsentTasks[randomInt(minAbsentIndex, maxAbsentIndex)];

  const mutatedPresent = mutatePresent(schedule, indexOfPresentToToggle);
  return mutateAbsent(mutatedPresent, indexOfAbsentToToggle);
}

const curriedChangePresence = curry(changePresence);
function changePresence(
  replaceValue: boolean,
  schedule: BinarySchedule,
  index: number
): BinarySchedule {
  if (!isUndefined(index)) {
    return Object.assign([], schedule, { [index]: replaceValue });
  }

  return schedule;
}

const mutatePresent = curriedChangePresence(false);
const mutateAbsent = curriedChangePresence(true);
