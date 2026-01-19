import winston, { format } from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determine log level based on environment
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Combine formats
const formatCombined = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf((info: winston.Logform.TransformableInfo) => 
    `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  new winston.transports.Console(),
  // Uncomment to log to files in production
  // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  // new winston.transports.File({ filename: 'logs/all.log' }),
];

// Create logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: formatCombined,
  transports,
});

export default logger;
