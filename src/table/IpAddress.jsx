import React, { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const initialData = [
  { ip: '192.168.1.1', user: 'John Doe', status: 'Blocked' },
  { ip: '192.168.1.2', user: 'Jane Smith', status: 'Allow' },
  { ip: '192.168.1.3', user: 'Alice Johnson', status: 'Allow' },
  // Add other data entries as needed...
];

const IpAddress = () => {
  // State to manage the table data
  const [data, setData] = useState(initialData);

  // Handler to block an IP
  const handleBlockIp = (ip) => {
    setData((prevData) =>
      prevData.map((entry) =>
        entry.ip === ip ? { ...entry, status: 'Blocked' } : entry
      )
    );
    alert(`IP ${ip} has been blocked.`);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'Sr.No',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'ip',
        header: 'IP',
        size: 150,
      },
      {
        accessorKey: 'user',
        header: 'User',
        size: 200,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button
              className='btn btn-info btn-sm me-1'
              onClick={() => alert(`Viewing ${row.original.user}`)}
            >
              View
            </button>
            <button
              className='btn btn-primary btn-sm me-1'
              onClick={() => alert(`Editing ${row.original.user}`)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm me-1"
              onClick={() => handleBlockIp(row.original.ip)}
              disabled={row.original.status === 'Blocked'}
            >
              {row.original.status === 'Blocked' ? 'Blocked' : 'Block IP'}
            </button>
          </div>
        ),
        size: 200,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default IpAddress;
