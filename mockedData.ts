import { Task } from "./models/Task.model";
const ISODateWithoutTime = "2022-06-10";

export const task1: Task = {
  executor: "M1",
  startTime: new Date(`${ISODateWithoutTime}T18:00:00`),
  endTime: new Date(`${ISODateWithoutTime}T19:00:00`),
  weight: 3,
};

export const task2: Task = {
  executor: "M2",
  startTime: new Date(`${ISODateWithoutTime}T18:30:00`),
  endTime: new Date(`${ISODateWithoutTime}T19:30:00`),
  weight: 2,
};

export const task3: Task = {
  executor: "M3",
  startTime: new Date(`${ISODateWithoutTime}T19:30:00`),
  endTime: new Date(`${ISODateWithoutTime}T20:00:00`),
  weight: 2,
};

export const task4: Task = {
  executor: "M4",
  startTime: new Date(`${ISODateWithoutTime}T18:00:00`),
  endTime: new Date(`${ISODateWithoutTime}T19:30:00`),
  weight: 1,
};

export const task5: Task = {
  executor: "M5",
  startTime: new Date(`${ISODateWithoutTime}T20:00:00`),
  endTime: new Date(`${ISODateWithoutTime}T21:00:00`),
  weight: 2,
};

export const task6: Task = {
  executor: "M6",
  startTime: new Date(`${ISODateWithoutTime}T19:00:00`),
  endTime: new Date(`${ISODateWithoutTime}T21:00:00`),
  weight: 3,
};

export const MOCKED_TASKS = [task1, task2, task3, task4, task5, task6];
