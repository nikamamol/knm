import React, { useEffect, useMemo, useState } from 'react';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import baseUrl from '../constant/ConstantApi';

const VieweUserTable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}user/getallusers`);
        // console.log('API Response:', response.data);
        
        const users = response.data.users;

        if (Array.isArray(users)) {
          const transformedData = users.map((user, index) => ({
            id: user._id,
            serialNumber: index + 1,
            name: {
              firstName: user.fullname.split(' ')[0],
              lastName: user.fullname.split(' ').slice(1).join(' ') || '',
            },
            address: '',
            city: '',
            state: '',
            mobileNumber: user.mobile,
            email: user.email,
            vendor: 'Koinet Media',
            designation: user.designation,
            supervisor: user.supervisor,
            profileStatus: user.profileStatus === 'completed' ? 'Completed' : (user.profileStatus === 'pending' ? 'Pending' : 'Not Added'),
            status: user.status === 'active' ? 'Active' : 'Not Mentioned',
          }));
          setData(transformedData);
        } else {
          // console.error('API response is not an array:', users);
        }
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://koinetsoft-backend.onrender.com/user/deleteuser/${userId}`);
      setData(data.filter(user => user.id !== userId));
    } catch (error) {
      toast.error('Error deleting user');
      // console.error('Error deleting user:', error);
    }
  };

  const handleDeleteClick = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        // Assuming deleteUser is an async function that deletes the user
        await deleteUser(userId);
        toast.success(`User ${userName} deleted successfully!`);
      } catch (error) {
        toast.error(`Failed to delete user ${userName}.`);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'S.No',
        size: 100,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'name',
        header: 'Full Name',
        size: 200,
        Cell: ({ row }) => `${row.original.name.firstName} ${row.original.name.lastName}`,
      },
      {
        accessorKey: 'mobileNumber',
        header: 'Mobile Number',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'vendor',
        header: 'Vendor',
        size: 150,
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        size: 150,
      },
      {
        accessorKey: 'supervisor',
        header: 'Supervisor',
        size: 150,
      },
      {
        accessorKey: 'profileStatus',
        header: 'Profile Status',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div className='d-flex gap-4'>
       
            <RemoveRedEyeIcon 
              style={{ cursor: 'pointer', color: 'Dark' }} 
              onClick={() => navigate(`/user/${row.original.id}`)} 
            />
            <AutoDeleteIcon 
              style={{ cursor: 'pointer', color: 'red' }} 
              onClick={() => handleDeleteClick(row.original.id, row.original.name.firstName)} 
            />
          </div>
        ),
        size: 150,
      },
    ],
    [navigate, data], // Add navigate and data to dependencies
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default VieweUserTable;
