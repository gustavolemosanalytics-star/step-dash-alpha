"use client";

import { useState, useCallback } from "react";
import { subDays, format } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

export function useDateRange(defaultDays: number = 30) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), defaultDays),
    to: new Date(),
  });

  const startDate = format(dateRange.from, "yyyy-MM-dd");
  const endDate = format(dateRange.to, "yyyy-MM-dd");

  const setRange = useCallback((from: Date, to: Date) => {
    setDateRange({ from, to });
  }, []);

  return { dateRange, setRange, startDate, endDate };
}
