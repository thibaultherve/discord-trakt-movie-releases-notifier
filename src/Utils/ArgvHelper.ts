import yargs from "yargs";
import { TaskGroup } from "../TaskManager";
import { Release } from "../Utils/Constants";

const argv = yargs
  .option("config", { describe: "Specifies the path to the config file.", type: "string" })
  .option("group", {
    alias: "g",
    demandOption: true,
    choices: Object.keys(TaskGroup)
      .filter((key) => isNaN(+key))
      .map<string>((name) => (TaskGroup as any)[name]),
    describe: "The task group to execute",
    type: "string",
  })
  .option("release-type", {
    alias: "r",
    demandOption: false,
    choices: Object.keys(Release)
      .filter((key) => isNaN(+key))
      .map<string>((name) => (Release as any)[name]),
    describe: "The task group to execute",
    type: "string",
  })
  .help("help").argv;

export interface IArgv {
  config?: string;
  group: string;
  username: string;
  release: Release;
}

export class ArgvHelper {
  public static get argv(): IArgv {
    return {
      config: argv["config" as keyof typeof argv] as string,
      group: argv["group" as keyof typeof argv] as string,
      username: argv["username" as keyof typeof argv] as string,
      release: argv["release" as keyof typeof argv] as Release,
    };
  }
}
