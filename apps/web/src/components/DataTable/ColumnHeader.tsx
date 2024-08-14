import { Column } from '@tanstack/react-table';

import { Button } from '@/shadcn/ui/button';
import { CaretDown, CaretUp, CaretUpDown } from '@phosphor-icons/react';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({ column, title }: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div>{title}</div>;
  }

  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      {column.getIsSorted() === 'asc' ? (
        <CaretUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <CaretDown className="ml-2 h-4 w-4" />
      ) : (
        <CaretUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
