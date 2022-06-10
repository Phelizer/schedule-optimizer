export type Minister = `M${number}`;
export interface Task {
  executor: Minister;
  startTime: Date;
  endTime: Date;
  weight: number;
}
