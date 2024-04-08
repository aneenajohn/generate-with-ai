const specializedLoggers = (logLevel: string) => (msg: string) => {
  console.log(`${logLevel} ${msg}`);
};

export const chatLogger = specializedLoggers('CHAT: ');
export const errorLogger = specializedLoggers('ERROR: ');
