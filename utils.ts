import { compose, curry } from "ramda";
import { BinarySchedule, Executor, Task } from "./models/Task.model";

function fitnessOfTasks(tasksInSchedule: Task[]): number {
  return tasksInSchedule.reduce((acc, task) => acc + task.weight, 0);
}

export const fitness = compose(fitnessOfTasks, binaryScheduleToTasks);

export function isOverlap(schedule: Task[], task: Task): boolean {
  return schedule.reduce(
    (acc: boolean, x) =>
      task.endTime.getTime() <= x.startTime.getTime() ||
      task.startTime.getTime() >= x.endTime.getTime()
        ? acc || false
        : acc || true,
    false
  );
}

export function checkIfScheduleHasOverlaps(
  allExistingTasks: Task[],
  schedule: BinarySchedule
): boolean {
  const tasksInSchedule = binaryScheduleToTasks(allExistingTasks, schedule);

  return tasksInSchedule.some((task) => {
    return isOverlap(otherTasks(tasksInSchedule, task), task);
  });
}

export const initSchedulesFactory = (
  adapter: (tasks: Task[]) => BinarySchedule
) => compose((schedules) => schedules.map(adapter), formInitialSchedules);

function formInitialSchedules(tasks: Task[]): Task[][] {
  return tasks.map((task) => [task]);
}

function otherTasks(tasks: Task[], task: Task): Task[] {
  return tasks.filter((t) => t.executor !== task.executor);
}

export interface TasksToBinarySchedule {
  (allExistingTasks: Task[], tasks: Task[]): BinarySchedule;
}

export const tasksToBinarySchedule: TasksToBinarySchedule = (
  allExistingTasks: Task[],
  tasks: Task[]
) => {
  return allExistingTasks.map(({ executor }) =>
    tasks.some((task) => task.executor === executor)
  );
};

export interface BinaryScheduleToTasks {
  (allExistinTasks: Task[], schedule: BinarySchedule): Task[];
}

export function binaryScheduleToTasks(
  allExistinTasks: Task[],
  schedule: BinarySchedule
) {
  return schedule
    .map((isPresent, index) =>
      isPresent
        ? findTaskByExecutor(allExistinTasks, numberToExecutor(index + 1))
        : undefined
    )
    .filter((elem): elem is Task => !!elem);
}

function findTaskByExecutor(allExistinTasks: Task[], executor: Executor): Task {
  const task = allExistinTasks.find((task) => task.executor === executor);
  if (!task) {
    throw new Error(`No task with executor ${executor}`);
  }

  return task;
}

function numberToExecutor(num: number): Executor {
  return `M${num}`;
}

export function probability(x: number) {
  return Math.random() <= x;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function isUndefined(value: unknown): value is undefined {
  if (value === undefined) {
    return true;
  }

  return false;
}
