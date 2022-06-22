import Database from "../Database";
import { IArgv } from "../Utils/ArgvHelper";
import { Task } from "./Task";
import { NotifyTask } from "./NotifyTask";
import { TraktTask } from "./TraktTask";
import DeleteRecordsTask from "./DeleteRecordsTask";

export enum TaskGroup {
  TASK_GROUP_TRAKT = "trakt",
  TASK_GROUP_NOTIFY = "notify",
}

export class TaskManager {
  private static TASKS_BY_GROUP: ReadonlyMap<TaskGroup, { new (args: IArgv, database: Database): Task }[]> = new Map([
    [TaskGroup.TASK_GROUP_TRAKT, [DeleteRecordsTask, TraktTask]],
    [TaskGroup.TASK_GROUP_NOTIFY, [NotifyTask]],
  ]);

  public static async execute(taskgroup: TaskGroup, args: IArgv, database: Database): Promise<void> {
    const tasks = this.TASKS_BY_GROUP.get(taskgroup);
    if (!tasks) {
      throw new Error(`No tasks found for given task group '${taskgroup}'`);
    }

    for (const task of tasks) {
      await new task(args, database).execute();
    }
  }
}
