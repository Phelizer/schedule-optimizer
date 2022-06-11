export type Executor = `M${number}`;
export interface Task {
  executor: Executor;
  startTime: Date;
  endTime: Date;
  weight: number;
}

export type BinarySchedule = boolean[];
