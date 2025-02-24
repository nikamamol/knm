import { useEffect, useMemo, useState } from 'react';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify';
import baseUrl from '../constant/ConstantApi';
import Hourglass from "../assets/Hourglass.gif";


const AgencyMyAgency = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch data from the API
    axios.get(`${baseUrl}user/myagencies`)
      .then(response => {
        // Map the response data to the desired structure
        const fetchedData = response.data.map((item, index) => ({
          id: item._id, // Add the ID to the data structure
          serialNumber: index + 1,
          agencyName: item.company_name,
          companyType: item.company_type,
          email: item.primary_email,
          phoneNumber: item.primary_phone_no,
        }));
        setData(fetchedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`${baseUrl}user/deletevendor/${id}`)
      .then(() => {
        // Filter out the deleted item from the data
        setData((prevData) => prevData.filter(item => item.id !== id));
        toast.success("Agency Delete Succsessfully")
      })
      .catch((error) => {
        // console.error('Error deleting item:', error);
        toast.error("Getting Error Delete Agency")
      });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'Sr. Number',
        size: 100,
      },
      {
        accessorKey: 'agencyName',
        header: 'Agency Name',
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
          <div className='d-flex gap-4'>
            <RemoveRedEyeIcon
              style={{ cursor: 'pointer', color: 'darkblue' }} 
              onClick={() => navigate(`/agency/viewAgencyDetails/${row.original.id}`)} // Navigate on click
            />
            <AutoDeleteIcon 
              style={{ cursor: 'pointer', color: 'red' }} 
              onClick={() => handleDelete(row.original.id)} // Call handleDelete on click
            />
          </div>
        ),
        size: 200,
      },
    ],
    [navigate],
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default AgencyMyAgency;
