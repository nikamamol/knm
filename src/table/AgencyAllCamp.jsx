import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { fetchCampaigns } from '../redux/reducer/createcampaign/GetCampaignData';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from 'react-router-dom';
import Hourglass from "../assets/Hourglass.gif";



const formatDate = (dateString) => {
  if (!dateString) return 'No Date Provided';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const AgencyAllCamp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { campaigns, status, error } = useSelector((state) => state.campaigns);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCampaigns());
    }
  }, [dispatch, status]);

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'S.No',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'campaignName',
        header: 'Name',
        size: 150,
      },
      {
        accessorKey: 'campaignCode',
        header: 'Code',
        size: 100,
      },
      {
        accessorKey: 'clientSelect',
        header: 'Enterprise/Agency',
        size: 200,
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        size: 150,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        size: 150,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: 'campaignStatus',
        header: 'Campaign Status',
        size: 150,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <RemoveRedEyeIcon onClick={() => navigate(`/campaigns/inhousecampaigns/campaigndetail/${row.original._id}`)}
              style={{ cursor: 'pointer', color: 'Dark', marginRight: '15px' }}
            />
            <ModeEditIcon onClick={() => alert(`Viewing ${row.original._id}`)}
              style={{ cursor: 'pointer', color: 'Dark' }}
            />
            {/* <button className='btn btn-info btn-sm me-1' onClick={() => alert(`Viewing ${row.original.campaignCode}`)}>View</button> */}
            {/* <button className='btn btn-primary btn-sm me-1' onClick={() => alert(`Editing ${row.original.campaignCode}`)}>Edit</button> */}
            {/* <button className="btn btn-danger btn-sm me-1" onClick={() => alert(`Deleting ${row.original.campaignCode}`)}>Delete</button> */}
          </div>
        ),
        size: 200,
      },
    ],
    [],
  );

  if (status === "loading") return (
    <>
        <div className='text-center mt-5'><img src={Hourglass} alt="" height={40} width={40} /></div>
    </>
)
  if (status === 'failed') return <p>Error: {error}</p>;

  return <MaterialReactTable columns={columns} data={campaigns} />;
};

export default AgencyAllCamp;
