import { curry, prop, reverse, sortBy } from "ramda";
import { BinarySchedule, Task } from "./models/Task.model";
import {
  binaryScheduleToTasks,
  checkIfScheduleHasOverlaps,
  fitness,
  initSchedulesFactory,
  tasksToBinarySchedule,
} from "./utils";

interface BeesOptions {
  beesToBestSchedulesNumber: number;
  beesToOtherSchedulesNumber: number;
  bestSchedulesNumber: number;
  totalPickedSchedulesNumber: number;
  iterationAllowed: number;
}

export function beesAlgorithm(tasks: Task[], options: BeesOptions) {
  const appliedTasksToBinarySchedule = curry(tasksToBinarySchedule)(tasks);
  const initialSchedules = initSchedulesFactory(appliedTasksToBinarySchedule)(
    tasks
  );

  const schedule = beesAlgorithmStep(initialSchedules, tasks, options, 0);

  return binaryScheduleToTasks(tasks, schedule);
}

function beesAlgorithmStep(
  schedules: BinarySchedule[],
  listOfTasks: Task[],
  options: BeesOptions,
  iterationNumber: number
): BinarySchedule {
  const appliedFitness = (schedule: BinarySchedule) =>
    fitness(listOfTasks, schedule);

  //
  const estimatedSchedules = schedules.map((schedule) => ({
    fitness: appliedFitness(schedule),
    schedule,
  }));

  const ascendingEstimatedSchedules = sortBy(
    prop("fitness"),
    estimatedSchedules
  );

  const descendingEstimatedSchedules = reverse(ascendingEstimatedSchedules);
  //

  const pickedBestSchedules = descendingEstimatedSchedules.slice(
    0,
    options.totalPickedSchedulesNumber
  );

  const descendingSchedules = pickedBestSchedules.map(prop("schedule"));
  const bestSchedules = descendingSchedules.slice(
    0,
    options.bestSchedulesNumber
  );

  const otherSchedules = descendingSchedules.slice(options.bestSchedulesNumber);

  // mutations
  const generateMutationsForBestSchedules = (schedule: BinarySchedule) =>
    generateNMutations(options.beesToBestSchedulesNumber, schedule);

  const bestSchedulesMutations = bestSchedules
    .map(generateMutationsForBestSchedules)
    .flat();

  const generateMutationsForOtherSchedules = (schedule: BinarySchedule) =>
    generateNMutations(options.beesToOtherSchedulesNumber, schedule);

  const otherSchedulesMutations = otherSchedules
    .map(generateMutationsForOtherSchedules)
    .flat();

  // filter only valid schedules
  const allMutations = [...bestSchedulesMutations, ...otherSchedulesMutations];
  const validMutations = allMutations.filter(
    (schedule) => !checkIfScheduleHasOverlaps(listOfTasks, schedule)
  );

  const allValidSchedules = [...descendingSchedules, ...validMutations];
  if (iterationNumber >= options.iterationAllowed) {
    const bestSchedule = allValidSchedules.reduce(
      (a, b) => (appliedFitness(a) >= appliedFitness(b) ? a : b),
      []
    );

    return bestSchedule;
  }

  return beesAlgorithmStep(
    allValidSchedules,
    listOfTasks,
    options,
    iterationNumber + 1
  );
}

function generateNMutations(
  n: number,
  schedule: BinarySchedule
): BinarySchedule[] {
  if (n <= 1) {
    return [beeMutate(schedule)];
  }

  return [beeMutate(schedule), ...generateNMutations(n - 1, schedule)];
}

function beeMutate(schedule: BinarySchedule): BinarySchedule {
  const [min, max] = [0, schedule.length];
  const indexToMutate = Math.floor(Math.random() * (max - min)) + min;
  const mutatedSchedule = Object.assign([], schedule, {
    [indexToMutate]: !schedule[indexToMutate],
  });

  return mutatedSchedule;
}
