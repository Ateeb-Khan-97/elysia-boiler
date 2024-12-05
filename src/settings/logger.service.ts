import colors from 'colors';

function createLogger(serviceName = 'ElysiaApplication') {
	function messageParser(message: unknown) {
		if (typeof message !== 'string') return JSON.stringify(message);
		return message;
	}

	function logToConsole(level: string, message: unknown) {
		let result = '';
		const currentDate = new Date();
		const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
		const parsedMessage = messageParser(message);

		switch (level) {
			case 'log':
				result = `[${colors.green('LOG')}] ${colors.dim.yellow.bold.underline(
					time,
				)} [${colors.green(serviceName)}] ${parsedMessage}`;
				break;
			case 'error':
				result = `[${colors.red('ERR')}] ${colors.dim.yellow.bold.underline(
					time,
				)} [${colors.red(serviceName)}] ${parsedMessage}`;
				break;
			case 'info':
				result = `[${colors.yellow('INFO')}] ${colors.dim.yellow.bold.underline(
					time,
				)} [${colors.yellow(serviceName)}] ${parsedMessage}`;
				break;
		}
		console.log(result);
	}

	function log(message: unknown) {
		logToConsole('log', message);
	}
	function error(message: unknown) {
		logToConsole('error', message);
	}
	function debug(message: unknown) {
		logToConsole('info', message);
	}

	return { log, error, debug };
}

const singletonLogger = createLogger();

function LoggerService(serviceName?: string) {
	if (serviceName) {
		return createLogger(serviceName);
	}
	return singletonLogger;
}

LoggerService.log = singletonLogger.log;
LoggerService.error = singletonLogger.error;
LoggerService.debug = singletonLogger.debug;

export { LoggerService };
