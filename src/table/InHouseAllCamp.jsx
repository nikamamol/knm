import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { fetchCampaigns, updateCampaignStatus } from '../redux/reducer/createcampaign/GetCampaignData';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Box } from '@mui/material';
import { toast } from 'react-toastify';
import Hourglass from "../assets/Hourglass.gif";
import EditIcon from '@mui/icons-material/Edit';


const formatDate = (dateString) => {
  if (!dateString) return 'No Date Provided';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const InHouseAllCamp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaigns, status, error } = useSelector((state) => state.campaigns);
  const userRole = localStorage.getItem('role'); // Assuming you have a user state
  const [checkboxState, setCheckboxState] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCampaigns());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const initialCheckboxState = {};
    campaigns.forEach((campaign) => {
      initialCheckboxState[campaign._id] = {
        checkbox1: campaign.campaignStatus === 'Completed',
        checkbox2: campaign.campaignStatus === 'Active',
        checkbox3: campaign.campaignStatus === 'New',
        checkbox4: campaign.campaignStatus === 'Expired',
      };
    });
    setCheckboxState(initialCheckboxState);
  }, [campaigns]);

  const handleCheckboxChange = async (event, campaignId) => {
    const { name, checked } = event.target;

    let newStatus = '';
    if (name === 'checkbox1' && checked) newStatus = 'Completed';
    else if (name === 'checkbox2' && checked) newStatus = 'Active';
    else if (name === 'checkbox3' && checked) newStatus = 'New';
    else if (name === 'checkbox4' && checked) newStatus = 'Expired';

    if (newStatus) {
      try {
        await dispatch(updateCampaignStatus({ id: campaignId, status: newStatus }));
        toast.success('Campaign status updated successfully');
      } catch (error) {
        toast.error('Error updating campaign status:', error);
        // console.error('Error updating campaign status:', error);
      }
    }

    setCheckboxState((prev) => ({
      ...prev,
      [campaignId]: {
        ...prev[campaignId],
        [name]: checked,
      },
    }));
  };

  const userAuthentication = userRole === "admin" || userRole === "oxmanager"
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
        accessorKey: 'checkboxes',
        header: 'Update Status',
        size: 150,
        Cell: ({ row }) => (
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Checkbox
              name="checkbox1"
              checked={checkboxState[row.original._id]?.checkbox1 || false}
              onChange={(e) => handleCheckboxChange(e, row.original._id)}
              disabled={userRole !== 'oxmanager' && userRole !== 'admin'}
              color="primary"
            />
            Completed
            <Checkbox
              name="checkbox2"
              checked={checkboxState[row.original._id]?.checkbox2 || false}
              onChange={(e) => handleCheckboxChange(e, row.original._id)}
              disabled={userRole !== 'oxmanager' && userRole !== 'admin'}
              color="secondary"
            />
            Active
            <Checkbox
              name="checkbox3"
              checked={checkboxState[row.original._id]?.checkbox3 || false}
              onChange={(e) => handleCheckboxChange(e, row.original._id)}
              disabled={userRole !== 'oxmanager' && userRole !== 'admin'}
              color="success"
            />
            New
            <Checkbox
              name="checkbox4"
              checked={checkboxState[row.original._id]?.checkbox4 || false}
              onChange={(e) => handleCheckboxChange(e, row.original._id)}
              disabled={userRole !== 'oxmanager' && userRole !== 'admin'}
              color="error"
            />
            Expired
          </Box>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <RemoveRedEyeIcon
              onClick={userAuthentication ? () => navigate(`/campaigns/inhousecampaigns/campaigndetail/${row.original._id}`) : undefined}
              style={{
                cursor: userAuthentication ? 'pointer' : 'not-allowed',
                color: userAuthentication ? 'dark' : 'gray', // Change color when disabled
                marginRight: '15px'
              }}
            />
             <EditIcon
              onClick={userAuthentication ? () => navigate(`/campaigns/inhousecampaigns/updateCampaignById/${row.original._id}`) : undefined}
              style={{
                cursor: userAuthentication ? 'pointer' : 'not-allowed',
                color: userAuthentication ? 'dark' : 'gray', // Change color when disabled
                marginRight: '15px'
              }}
            />
          </div>
        ),
        size: 150,
      },
    ],
    [checkboxState, navigate, userRole]
  );

  if (status === "loading") return (
    <>
        <div className='text-center mt-5'><img src={Hourglass} alt="" height={40} width={40} /></div>
    </>
)
  if (status === 'failed') return <p>Error: {error}</p>;

  return <MaterialReactTable columns={columns} data={campaigns} />;
};

export default InHouseAllCamp;
