import React, { useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllraMasterFile } from '../redux/reducer/rpf/ramasterdataget'; // Adjust the import path
import { toast } from 'react-toastify';
import axios from 'axios';
import baseUrl from '../constant/ConstantApi';
import Hourglass from "../assets/Hourglass.gif";
import Unauthorised from "../assets/401Unauthorised.png"



const RAMasterTab = () => {
  const dispatch = useDispatch();
  const { files = [], loading, error } = useSelector((state) => state.raFileUpload || {});

  // Retrieve the user's role from localStorage
  const role = localStorage.getItem('role');
  const allowedRoles = ['oxmanager', 'reasercher', 'admin']; // Specify allowed roles

  useEffect(() => {
    if (allowedRoles.includes(role)) {
      dispatch(fetchAllraMasterFile());
    }
  }, [dispatch, role]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'S.No',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'originalname',
        header: 'Filename',
        size: 100,
      },
      {
        accessorKey: 'campaignName',
        header: 'Campaign Name',
        size: 200,
      },
      {
        accessorKey: 'campaignCode',
        header: 'Campaign Code',
        size: 150,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        size: 150,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.getValue();
          return <Checkbox color="success" checked={status === 'Done'} />;
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <Tooltip title="Download File">
              <IconButton onClick={() => handleDownload(row.original)}>
                <DownloadIcon
                  style={{ cursor: 'pointer', color: 'blue', width: '30px', height: '30px' }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete File">
              <IconButton onClick={() => handleDelete(row.original._id)}>
                <DeleteIcon
                  style={{ cursor: 'pointer', color: 'red', width: '30px', height: '30px' }}
                />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  // Handle file download
  const handleDownload = async (file) => {
    const { _id, originalname } = file;
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${baseUrl}user/getramasterCsvFileData/${_id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalname);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.error('Error during file download:', error);
      toast.error('Failed to download file');
    }
  };

  // Handle file deletion
  const handleDelete = async (fileId) => {
    const token = localStorage.getItem('authToken');
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete(`${baseUrl}user/deleteRaMasterCsvFileById/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllraMasterFile());
        toast.success('File deleted successfully');
      } catch (error) {
        // console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
      }
    }
  };

  if (loading) return (
    <>
        <div className='text-center mt-5'><img src={Hourglass} alt="" height={40} width={40} /></div>
    </>
)
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // Conditionally render the table only if the role is allowed
  if (!allowedRoles.includes(role)) {
    return <div className='text-center mt-2 '>
    <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
    <p className='text-danger'>You do not have permission to view this content.</p>
  </div>;
  }

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={files}
        enableColumnResizing
        enableStickyHeader
      />
    </div>
  );
};

export default RAMasterTab;
