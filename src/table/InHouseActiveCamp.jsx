import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { fetchCampaigns } from '../redux/reducer/createcampaign/GetCampaignData';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Hourglass from "../assets/Hourglass.gif";



const InHouseActiveCamp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { campaigns, status, error } = useSelector((state) => state.campaigns);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Filter campaigns to show only active ones
  const activeCampaigns = campaigns.filter((campaign) => campaign.campaignStatus === 'Active');
  // const handleViewCampaign = (campaignId) => {
  //   navigate(`/campaigns/inhousecampaigns/campaigndetail/${campaignId}`);

  // }

  // Memoize the columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'S.No',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'campaignName',
        header: 'Campaign Name',
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
            {/* <button
              className='btn btn-info btn-sm me-1'
              onClick={() => alert(`Viewing ${row.original._id}`)}
            >
              View
            </button> */}
            <RemoveRedEyeIcon onClick={() => navigate(`/campaigns/inhousecampaigns/campaigndetail/${row.original._id}`)}
              style={{ cursor: 'pointer', color: 'Dark', marginRight: '15px' }}
            />
            {/* <button
              className='btn btn-primary btn-sm me-1'
              onClick={() => alert(`Editing ${row.original._id}`)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm me-1"
              onClick={() => alert(`Deleting ${row.original._id}`)}
            >
              Delete
            </button> */}
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
    data: activeCampaigns,
  });

  // Render loading, error, or the table
  if (status === " loading") return (
    <>
        <div className='text-center mt-5'><img src={Hourglass} alt="" height={40} width={40} /></div>
    </>
)
  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return <MaterialReactTable table={table} />;
};

export default InHouseActiveCamp;
