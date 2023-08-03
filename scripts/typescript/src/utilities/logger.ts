import { Readable, Writable } from "stream";
import date from "date-and-time";

/**
 * Log levels from low to high verbosity
 */
export enum LogLevel {
  NONE = 0,
  ERROR,
  WARNING,  
  /** Is usually the default */
  INFO,
  DEBUG,
}

export type LoggerOptions = {
  /** logs output stream (ex: a file stream or stdout) */
  outstream: Writable;
  /** Default verbosity level for the logs */
  verbosity: LogLevel;
  /** If true, timestamp will be added to the logs */
  timestamp: boolean;
};

/**
 * Simple logger with two main functionnalitites:
 * - ajustable verbosity (@see LogLevel)
 * - uses Readable stream insead of console (performance is better)
 * - output can be redirected to any writable stream (ex: logStream.pipe(<writable-stream>).
 */
export class Logger {

  /** A prefix to insert before any log */
  prefix: string | null;
  /** To adjust the verbosity (ex: set it to LogLevel.ERR to skip warnings, messages, and debug) */
  verbosity: LogLevel;
  /**
   * Readable stream to push the logs into, redirect it using pipe()
   * ex: logger.logStream.pipe(process.stdout)
   */
  readonly logStream: Readable;
  /** If true, inserts the timestamp in the logs */
  private timestamp_enabled: boolean;

  constructor(options: LoggerOptions) {
    this.verbosity = options.verbosity;
    this.logStream = new Readable({
      read: () => {},
    });
    this.logStream.pipe(options.outstream, { end: true });
    this.prefix = null;
    this.timestamp_enabled = options.timestamp;
  }

  // shorthand for _log(level, ...)

  debug(...args: string[])   {this._log(LogLevel.DEBUG, ...args);}
  info(...args: string[])    {this._log(LogLevel.INFO, ...args);}
  warning(...args: string[]) {this._log(LogLevel.WARNING, ...args);}
  error(...args: string[])   {this._log(LogLevel.ERROR, ...args);}

  /**
   * Log using a given level, message might be ignored if level is too high compare to current verbosity.
   * Message are formatted like:
   * "[timestamp] <VERBOSITY> <prefix><arg0><arg1>...<argn>""
   */
  _log(level: LogLevel, ...args: string[]) {
    if (level === LogLevel.NONE || level > this.verbosity ) return;

    if(this.timestamp_enabled) {
      const now = new Date();
      const day = date.format(now, 'YYYY/MM/DD');
      const time = date.format(now, 'HH:mm:ss A');
      const gmt = date.format(now, '[GMT]Z');
      this.logStream.push(`${day} ${time} ${gmt} `)
    }
    
    switch (level) {
      case LogLevel.ERROR:   this.logStream.push('[ERR 🚩] '); break;
      case LogLevel.WARNING: this.logStream.push('[WRN ⚠️] '); break;
      case LogLevel.INFO:    this.logStream.push('[INFO  ] '); break;
      case LogLevel.DEBUG:   this.logStream.push('[DEBUG ] '); break;
      default:
        const will_fail_at_compile_time: never = level; // for static check
        throw new Error(`Not handled case: ${will_fail_at_compile_time}`); // for runtime check
    }

    if (this.prefix !== null) {
      this.logStream.push(this.prefix);
    }
    args.forEach((v) => this.logStream.push(v));
    this.logStream.push("\n");
  }
}
