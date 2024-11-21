import colors from "colors";

function createLogger(serviceName: string = "ElysiaApplication") {
  function messageParser(message: any) {
    if (typeof message !== "string") return JSON.stringify(message);
    return message;
  }

  function logToConsole(level: string, message: string) {
    let result;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    message = messageParser(message);

    switch (level) {
      default:
      case "log":
        result = `[${colors.green("LOG")}] ${colors.dim.yellow.bold.underline(
          time
        )} [${colors.green(serviceName)}] ${message}`;
        break;
      case "error":
        result = `[${colors.red("ERR")}] ${colors.dim.yellow.bold.underline(
          time
        )} [${colors.red(serviceName)}] ${message}`;
        break;
      case "info":
        result = `[${colors.yellow("INFO")}] ${colors.dim.yellow.bold.underline(
          time
        )} [${colors.yellow(serviceName)}] ${message}`;
        break;
    }
    console.log(result);
  }

  function log(message: any) {
    logToConsole("log", message);
  }
  function error(message: any) {
    logToConsole("error", message);
  }
  function debug(message: any) {
    logToConsole("info", message);
  }

  return { log, error, debug };
}

// Singleton instance
const singletonLogger = createLogger();

// Function to return a new logger instance or use singleton
export function LoggerService(serviceName?: string) {
  if (serviceName) {
    return createLogger(serviceName);
  }
  return singletonLogger;
}

// Attach the singleton methods directly for LoggerService.log()
LoggerService.log = singletonLogger.log;
LoggerService.error = singletonLogger.error;
LoggerService.debug = singletonLogger.debug;

export default LoggerService;
