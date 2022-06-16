import * as winston from "winston";
import { Constants } from "./Constants";

let LOGGER: null | winston.Logger = null;

export class Logger {
  public static setupLogger(): winston.Logger {
    return (LOGGER = winston.loggers.add("logger", {
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.printf((msg) => {
          const formattedDate = new Date(msg.timestamp).toLocaleString();
          const line = `[${formattedDate}][${msg.level.toUpperCase()}] ${msg.message}`;
          return winston.format.colorize().colorize(msg.level, line);
        })
      ),
      level: Constants.DEVELOPMENT_ENV ? "debug" : "info",
      transports: [new winston.transports.Console()],
    }));
  }

  public static getLogger(): winston.Logger {
    if (LOGGER === null) {
      return this.setupLogger();
    }
    return LOGGER;
  }
}
