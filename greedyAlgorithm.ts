import { Task } from "./models/Task.model";
import { isOverlap } from "./utils";

export function greedyAlgorithm(tasks: Task[]): Task[] {
  return greedyStep([], tasks);
}

function greedyStep(currentSchedule: Task[], remainingTasks: Task[]): Task[] {
  const mostValuableTask = maxWeightTask(remainingTasks);
  if (!mostValuableTask) {
    return currentSchedule;
  }

  const updatedRemainingTasks = remainingTasks.filter(
    ({ executor }) => executor !== mostValuableTask.executor
  );

  if (isOverlap(currentSchedule, mostValuableTask)) {
    return greedyStep(currentSchedule, updatedRemainingTasks);
  }

  const updatedCurrentSchedule = [...currentSchedule, mostValuableTask];
  return greedyStep(updatedCurrentSchedule, updatedRemainingTasks);
}

function maxWeightTask(tasks: Task[]): Task | undefined {
  return tasks.reduce(
    (currMax, task) => (task.weight > currMax.weight ? task : currMax),
    tasks[0]
  );
}
