const stamp = (level: string, message: string) =>
  `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`;

const logger = {
  info: (message: string) => console.log(stamp("info", message)),
  error: (message: string, error?: unknown) => console.error(stamp("error", message), error),
  warn: (message: string) => console.warn(stamp("warn", message)),
};

export default logger;
