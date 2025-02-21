import  { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { deleteClient, fetchClients } from '../redux/reducer/billing/ClientSlice';
import Hourglass from "../assets/Hourglass.gif";


const BillingViewClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clients = useSelector((state) => state.clients.data);
  const clientStatus = useSelector((state) => state.clients.status);
  const error = useSelector((state) => state.clients.error);

  useEffect(() => {
    if (clientStatus === 'idle') {
      dispatch(fetchClients());
    }
  }, [clientStatus, dispatch]);

  const handleDeleteClick = (clientId) => {
    dispatch(deleteClient(clientId));
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'serialNumber', header: 'S.No', size: 50 },
      { accessorKey: 'companyName', header: 'Company Name', size: 200 },
      { accessorKey: 'pocName', header: 'POC', size: 150 },
      { accessorKey: 'mobile', header: 'Mobile', size: 150 },
      { accessorKey: 'email', header: 'Email', size: 200 },
      { accessorKey: 'city', header: 'City', size: 150 },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div className="d-flex gap-4">
            <RemoveRedEyeIcon
              style={{ cursor: 'pointer', color: 'Dark' }}
              onClick={() => navigate(`/billing/viewClient/${row.original.id}`)}
              
            />
            <AutoDeleteIcon
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleDeleteClick(row.original.id)}
            />
          </div>
        ),
        size: 200,
      },
    ],
    [navigate]
  );

  const table = useMaterialReactTable({
    columns,
    data: clients,
  });

  return (
    <div>
      {clientStatus === 'loading' &&       <div className='text-center mt-5'><img src={Hourglass} alt="" height={40} width={40} /></div>    }
      {clientStatus === 'failed' && <div>Error: {error}</div>}
      {clientStatus === 'succeeded' && <MaterialReactTable table={table} />}
    </div>
  );
};


export default BillingViewClient;
