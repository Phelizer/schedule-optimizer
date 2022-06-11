import { BinarySchedule, Task } from "./models/Task.model";

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

export interface TasksToBinarySchedule {
  (allExistinTasks: Task[], tasks: Task[]): BinarySchedule;
}

export const tasksToBinarySchedule: TasksToBinarySchedule = (
  allExistinTasks: Task[],
  tasks: Task[]
) => {
  return allExistinTasks.map(({ executor }) =>
    tasks.some((task) => task.executor === executor)
  );
};
