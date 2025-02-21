import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

// updated data structure with new fields
const data = [
  {
    serialNumber: 1,
    enterpriseName: 'Enterprise A',
    companyType: 'Type A',
    email: 'enterpriseA@example.com',
    phoneNumber: '123-456-7890',
  },
  {
    serialNumber: 2,
    enterpriseName: 'Enterprise B',
    companyType: 'Type B',
    email: 'enterpriseB@example.com',
    phoneNumber: '098-765-4321',
  },
  {
    serialNumber: 3,
    enterpriseName: 'Enterprise C',
    companyType: 'Type C',
    email: 'enterpriseC@example.com',
    phoneNumber: '111-222-3333',
  },
  // Add other data entries as needed...
];

const EnterpriseMyEnterprise = () => {
  // Memoize the columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'Sr.No',
        size: 50,
      },
      {
        accessorKey: 'enterpriseName',
        header: 'Enterprise Name',
        size: 200,
      },
      {
        accessorKey: 'companyType',
        header: 'Company Type',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        size: 150,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button className='btn btn-info btn-sm me-1' onClick={() => alert(`Viewing ${row.original.enterpriseName}`)}>View</button>
            <button className='btn btn-primary btn-sm me-1' onClick={() => alert(`Editing ${row.original.enterpriseName}`)}>Edit</button>
            <button className="btn btn-danger btn-sm me-1" onClick={() => alert(`Deleting ${row.original.enterpriseName}`)}>Delete</button>
          </div>
        ),
        size: 200,
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

export default EnterpriseMyEnterprise;
