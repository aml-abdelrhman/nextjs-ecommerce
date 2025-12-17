const attempts: Record<string, { count: number; last: number }> = {};

export const limiter = {
  check(key: string, limit = 5, window = 15 * 60 * 1000) {
    const now = Date.now();
    const record = attempts[key] || { count: 0, last: now };

    if (now - record.last > window) {
      record.count = 1;
      record.last = now;
      attempts[key] = record;
      return true;
    }

    if (record.count >= limit) throw new Error("Too many requests");

    record.count += 1;
    record.last = now;
    attempts[key] = record;
    return true;
  },
};
