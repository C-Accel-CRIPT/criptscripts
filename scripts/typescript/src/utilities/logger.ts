import { Readable, Writable } from "stream";

export enum LogLevel {
  ERR = 0,
  WRN,
  MSG,
  DBG,
}

export type LoggerOptions = {
  outstream: Writable;
  verbosity: LogLevel;
};

/**
 * Simple logger with two main functionnalitites:
 * - ajustable verbosity
 * - uses Readable stream insead of console (performance is better)
 * - can be redirected to any writable stream using logStream.pipe(<writable-stream>).
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

  constructor(options: LoggerOptions) {
    this.verbosity = options.verbosity;
    this.logStream = new Readable({
      read: () => {},
    });
    this.logStream.pipe(options.outstream);
    this.prefix = null;
  }

  debug(...args: string[]) {
    this._log(LogLevel.DBG, ...args);
  }
  message(...args: string[]) {
    this._log(LogLevel.MSG, ...args);
  }
  warning(...args: string[]) {
    this._log(LogLevel.WRN, ...args);
  }
  error(...args: string[]) {
    this._log(LogLevel.ERR, ...args);
  }

  /**
   * Log using a given level, message might be ignored if level is too high compare to current verbosity.
   * Message are formatted like:
   * "[<VERBOSITY>] <prefix><arg0><arg1>...<argn>""
   */
  _log(level: LogLevel, ...args: string[]) {
    if (level > this.verbosity) return;

    switch (level) {
      case LogLevel.ERR:
        this.logStream.push(`[ERR] `);
        break;
      case LogLevel.WRN:
        this.logStream.push(`[WRN] `);
        break;
      case LogLevel.MSG:
        this.logStream.push(`[MSG] `);
        break;
      case LogLevel.DBG:
        this.logStream.push(`[DBG] `);
        break;
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
