import Database from "./Database";
import { TaskGroup, TaskManager } from "./TaskManager";
import { ArgvHelper } from "./Utils/ArgvHelper";
import { Logger } from "./Utils/Logger";

const logger = Logger.setupLogger();

async function main() {
  const argv = ArgvHelper.argv;

  const database = new Database();

  try {
    await database.open();

    if (argv.group) {
      await TaskManager.execute(argv.group as TaskGroup, argv, database);
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
  } finally {
    await database.close();
  }
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
