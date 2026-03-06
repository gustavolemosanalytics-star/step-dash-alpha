"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  data,
  pageSize = 10,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const pageData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="p-5 pb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs w-10">#</TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-muted-foreground text-xs ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((row, i) => (
              <TableRow key={i} className="border-border hover:bg-secondary/50">
                <TableCell className="text-muted-foreground text-xs">
                  {page * pageSize + i + 1}.
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={`text-sm ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                  >
                    {col.render ? col.render(row, i) : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {page * pageSize + 1} - {Math.min((page + 1) * pageSize, data.length)} / {data.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="h-7 w-7 p-0 text-muted-foreground"
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="h-7 w-7 p-0 text-muted-foreground"
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
