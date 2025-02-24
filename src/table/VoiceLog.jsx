import React, { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

// Updated data structure with new fields
const data = [
  {
    leadName: 'John Doe',
    profile: 'Sales',
    campaignName: 'Campaign 1',
    download: 'Download Link 1',
    leadStatus: 'Active',
    date: '2023-01-01',
  },
  {
    leadName: 'Jane Smith',
    profile: 'Marketing',
    campaignName: 'Campaign 2',
    download: 'Download Link 2',
    leadStatus: 'Completed',
    date: '2023-02-15',
  },
  {
    leadName: 'Alice Johnson',
    profile: 'IT',
    campaignName: 'Campaign 3',
    download: 'Download Link 3',
    leadStatus: 'Paused',
    date: '2023-03-10',
  },
  // Add other data entries as needed...
];

const VoiceLog = () => {
  // Memoize the columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'Sr.No',
        size: 100,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'leadName',
        header: 'Lead Name',
        size: 200,
      },
      {
        accessorKey: 'profile',
        header: 'Profile',
        size: 150,
      },
      {
        accessorKey: 'campaignName',
        header: 'Campaign Name',
        size: 200,
      },
      {
        accessorKey: 'download',
        header: 'Download',
        size: 150,
        Cell: ({ row }) => <a href="#">{row.original.download}</a>,
      },
      {
        accessorKey: 'leadStatus',
        header: 'Lead Status',
        size: 150,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
      },
    ],
    [],
  );

  // Initialize the table using the hook
  const table = useMaterialReactTable({
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default VoiceLog;
