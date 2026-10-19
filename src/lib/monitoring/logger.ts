/**
 * ARTSINLY Structured Performance & System Logger
 */

export type LogLevel = "info" | "warn" | "error" | "metric";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  durationMs?: number;
}

class SystemLogger {
  private format(entry: LogEntry): string {
    const { timestamp, level, message, context, durationMs } = entry;
    const dur = durationMs !== undefined ? ` [${durationMs.toFixed(2)}ms]` : "";
    const ctx = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}]${dur} ${message}${ctx}`;
  }

  log(level: LogLevel, message: string, context?: Record<string, any>, durationMs?: number) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      durationMs,
    };

    const formatted = this.format(entry);
    if (level === "error") {
      console.error(formatted);
    } else if (level === "warn") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log("error", message, context);
  }

  metric(name: string, durationMs: number, context?: Record<string, any>) {
    this.log("metric", `Metric: ${name}`, context, durationMs);
  }

  async measure<T>(name: string, fn: () => Promise<T>, context?: Record<string, any>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.metric(name, duration, context);
      return result;
    } catch (err: any) {
      const duration = performance.now() - start;
      this.log("error", `Failed: ${name} (${err.message})`, context, duration);
      throw err;
    }
  }
}

export const logger = new SystemLogger();
