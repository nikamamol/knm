import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInvoices } from '../redux/reducer/billing/GetInvoice'; // Import the delete thunk
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteInvoiceById } from '../redux/reducer/billing/GetInvoiceFromId';
import Hourglass from "../assets/Hourglass.gif";


const BillingViewInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoiceData = useSelector((state) => state.invoices.invoices);
  const invoiceStatus = useSelector((state) => state.invoices.status);
  const error = useSelector((state) => state.invoices.error);
  // console.log(invoiceData)

  useEffect(() => {
    if (invoiceStatus === 'idle') {
      dispatch(fetchInvoices());
    }
  }, [invoiceStatus, dispatch]);

  const handleDelete = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch(deleteInvoiceById(invoiceId));
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'Sr.no',
        size: 100,
      },
      {
        accessorKey: 'invoiceDate',
        header: 'Invoice Date',
        size: 150,
      },
      {
        accessorKey: 'vendorName',
        header: 'Vendor Name',
        size: 200,
      },
      {
        accessorKey: 'amount',
        header: 'Amount ($)',
        size: 100,
      },
      {
        accessorKey: 'totalLead',
        header: 'Total Lead',
        size: 100,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div className='d-flex gap-3'>
            <RemoveRedEyeIcon
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/billing/ViewInvoiceById/${row.original.actions}`)}
            />
            <DeleteIcon
              style={{ cursor: 'pointer' }}
              onClick={() => handleDelete(row.original.actions)} 
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
    data: invoiceData,
  });

  if (invoiceStatus === "loading") return (
    <>
        <div className='text-center mt-5'><img src={Hourglass} alt="" height={40} width={40} /></div>
    </>
)
  if (error) {
    return <div>Error: {error}</div>;
  }

  return <MaterialReactTable table={table} />;
};

export default BillingViewInvoice;
