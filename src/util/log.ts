const { log } = console;

export default class Logger {
	static info(...args: any) {
		log(`[${new Date().toISOString()} INFO]`, ...args);
	}

	static error(...args: any) {
		log(`[${new Date().toISOString()} ERROR]`, ...args);
	}
}
