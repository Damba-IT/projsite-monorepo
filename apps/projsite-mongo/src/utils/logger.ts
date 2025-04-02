// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  // foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

export const customPrintFunc = (str: string, ...rest: string[]) => {
  const timestamp = new Date().toISOString();
  //TODO:: use hono request id middleware?? https://hono.dev/docs/middleware/builtin/request-id.... is there big difference in size?? if yes then just use my custom solution below
  const requestId = crypto.randomUUID().slice(0, 8);

  // Color the timestamp cyan and requestId magenta
  console.log(
    `${colors.cyan}[${timestamp}]${colors.reset} ${colors.magenta}[${requestId}]${colors.reset} ${str}`,
    ...rest
  );
};

export const log = {
  info: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.log(
      `${colors.cyan}[${timestamp}]${colors.reset} ${colors.green}[INFO]${colors.reset} ${message}`,
      ...args
    );
  },

  warn: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.warn(
      `${colors.cyan}[${timestamp}]${colors.reset} ${colors.yellow}[WARN]${colors.reset} ${message}`,
      ...args
    );
  },

  error: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.error(
      `${colors.cyan}[${timestamp}]${colors.reset} ${colors.red}[ERROR]${colors.reset} ${message}`,
      ...args
    );
  },

  debug: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.debug(
      `${colors.cyan}[${timestamp}]${colors.reset} ${colors.dim}[DEBUG]${colors.reset} ${message}`,
      ...args
    );
  },
};
