import { MOCKED_TASKS, task1, task3, task5, task6 } from "./mockedData";
import { Task } from "./models/Task.model";

function GreedyAlgorithm(tasks: Task[]): Task[] {
  const mostValuableTask = getTaskWithMaxWeight(tasks);
}

function getTaskWithMaxWeight(tasks: Task[]): Task | undefined {
  return tasks.reduce(
    (currMax, task) => (task.weight > currMax.weight ? task : currMax),
    tasks[0]
  );
}

function isOverlap(schedule: Task[], task: Task): boolean {
  return schedule.reduce(
    (acc: boolean, x) =>
      task.endTime.getTime() <= x.startTime.getTime() ||
      task.startTime.getTime() >= x.endTime.getTime()
        ? acc || false
        : acc || true,
    false
  );
}
