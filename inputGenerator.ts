import { Executor, Task } from "./models/Task.model";
import { randomInt } from "./utils";

function taskFactory(
  startHour: number,
  endHour: number,
  executor: Executor
): Task {
  const minWeight = 1;
  const maxWeight = 10;
  const halfAnHourInMilliseconds = 30 * 60 * 1000;
  const timezoneOffsetInHours = new Date().getTimezoneOffset() / 60;
  const startTimestamp = new Date(
    2022,
    5,
    14,
    randomInt(startHour, endHour) - timezoneOffsetInHours,
    randomInt(0, 2) * 30
  ).getTime();

  return {
    executor,
    weight: randomInt(minWeight, maxWeight),
    startTime: new Date(startTimestamp),
    endTime: new Date(
      startTimestamp + halfAnHourInMilliseconds * randomInt(1, 3)
    ),
  };
}

export function inputFactory(
  numberOfTasks: number,
  startHour: number,
  endHour: number
): Task[] {
  const executors = new Array(numberOfTasks)
    .fill("")
    .map<Executor>((_, index) => `M${index + 1}`);

  const appliedTaskFactory = (executor: Executor) =>
    taskFactory(startHour, endHour, executor);

  return executors.map(appliedTaskFactory);
}
