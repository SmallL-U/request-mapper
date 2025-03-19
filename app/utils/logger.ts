/**
 * Logger utility to provide consistent logging with prefixes
 */

import { log, error, warn, info } from 'console';

/**
 * Log levels supported by the logger
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  prefix?: string;
  showTimestamp?: boolean;
  level?: LogLevel;
}

/**
 * Logger interface with strongly-typed methods
 */
export interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

/**
 * Default logger options
 */
const defaultOptions: LoggerOptions = {
  prefix: '',
  showTimestamp: true,
  level: LogLevel.INFO,
};

/**
 * Creates a logger with the specified options
 *
 * @param options Logger configuration options
 * @returns Logger instance with logging methods
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const opts = { ...defaultOptions, ...options };

  /**
   * Formats a date in the pattern YYYY-MM-DD HH:MM:SS
   * Uses direct date component extraction rather than format patterns
   */
  const formatDate = (date: Date): string => {
    const pad = (num: number): string => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  /**
   * Formats a message with the specified prefix and timestamp if enabled
   */
  const formatMessage = (message: string, level: LogLevel): string => {
    const parts: string[] = [];

    if (opts.showTimestamp) {
      parts.push(`[${formatDate(new Date())}]`);
    }

    if (level) {
      parts.push(`[${level}]`);
    }

    if (opts.prefix) {
      parts.push(`[${opts.prefix}]`);
    }

    parts.push(message);
    return parts.join(' ');
  };

  return {
    /**
     * Logs a debug message
     */
    debug: (message: string, ...args: any[]): void => {
      if (shouldLog(LogLevel.DEBUG, opts.level)) {
        log(formatMessage(message, LogLevel.DEBUG), ...args);
      }
    },

    /**
     * Logs an info message
     */
    info: (message: string, ...args: any[]): void => {
      if (shouldLog(LogLevel.INFO, opts.level)) {
        info(formatMessage(message, LogLevel.INFO), ...args);
      }
    },

    /**
     * Logs a warning message
     */
    warn: (message: string, ...args: any[]): void => {
      if (shouldLog(LogLevel.WARN, opts.level)) {
        warn(formatMessage(message, LogLevel.WARN), ...args);
      }
    },

    /**
     * Logs an error message
     */
    error: (message: string, ...args: any[]): void => {
      if (shouldLog(LogLevel.ERROR, opts.level)) {
        error(formatMessage(message, LogLevel.ERROR), ...args);
      }
    },
  };
}

/**
 * Determines if a message with the given level should be logged
 * based on the configured minimum log level
 */
function shouldLog(
  messageLevel: LogLevel,
  configuredLevel: LogLevel = LogLevel.INFO
): boolean {
  const levels = Object.values(LogLevel);
  const messageLevelIndex = levels.indexOf(messageLevel);
  const configuredLevelIndex = levels.indexOf(configuredLevel);

  return messageLevelIndex >= configuredLevelIndex;
}
