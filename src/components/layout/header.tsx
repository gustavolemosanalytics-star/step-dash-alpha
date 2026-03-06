"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "@/hooks/use-date-range";

interface HeaderProps {
  title: string;
  subtitle?: string;
  dateRange: DateRange;
  onDateChange: (from: Date, to: Date) => void;
}

export function Header({ title, subtitle, dateRange, onDateChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ from?: Date; to?: Date }>({
    from: dateRange.from,
    to: dateRange.to,
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-primary mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary min-w-[240px] justify-start"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.from, "dd MMM yyyy", { locale: ptBR })} -{" "}
            {format(dateRange.to, "dd MMM yyyy", { locale: ptBR })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-card border-border" align="end">
          <Calendar
            mode="range"
            selected={{ from: tempRange.from, to: tempRange.to }}
            onSelect={(range) => {
              setTempRange({ from: range?.from, to: range?.to });
              if (range?.from && range?.to) {
                onDateChange(range.from, range.to);
                setOpen(false);
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
            className="bg-card text-foreground"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
