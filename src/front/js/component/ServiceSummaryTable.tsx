import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface ServiceSummary {
  serviceType: string;
  public: number;
  private: number;
  total: number;
}

const columnHelper = createColumnHelper<ServiceSummary>();

const columns = [
  columnHelper.accessor('serviceType', {
    header: 'Service Type',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('public', {
    header: 'Public',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('private', {
    header: 'Private',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    cell: info => info.getValue(),
  }),
];

interface ServiceSummaryTableProps {
  data: ServiceSummary[];
}

export const ServiceSummaryTable: React.FC<ServiceSummaryTableProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Service Summary</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};