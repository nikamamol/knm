import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { fetchFiles } from '../redux/reducer/rpf/operationcsvupload';
import Hourglass from "../assets/Hourglass.gif";
import Unauthorised from "../assets/401Unauthorised.png";
import baseUrl from '../constant/ConstantApi';
import axios from 'axios';
import { toast } from 'react-toastify';

const RfpActive = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { files, status, error } = useSelector((state) => state.files);

  const [checkboxes, setCheckboxes] = useState({});
  const [localFiles, setLocalFiles] = useState([]);
  const userType = localStorage.getItem('role');
  const allowedRoles = ['oxmanager', 'admin'];

  useEffect(() => {
    // Fetch files if the user is authorized
    dispatch(fetchFiles());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      setLocalFiles(files); // Sync local state with fetched files
    }
  }, [status, files]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("No token found");

      await axios.delete(`${baseUrl}user/deleteOperationCsvFileById/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLocalFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId)); // Update state immediately
      toast.success('File deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete file');
    }
  };

  const handleCheckboxChange = (fileId, status, checked) => {
    setCheckboxes((prev) => ({
      ...prev,
      [fileId]: checked,
    }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'S.No',
        size: 100,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'originalname',
        header: 'Filename',
        size: 200,
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
        accessorKey: 'clientSelect',
        header: 'Client Name',
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
        size: 200,
        Cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div>
              <Checkbox
                color="success"
                checked={status === "Done"}
                onChange={(e) => handleCheckboxChange(row.original._id, status, e.target.checked)}
              />
              {status}
            </div>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
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
    [checkboxes]
  );

  if (!allowedRoles.includes(userType)) {
    return (
      <div className='text-center mt-2'>
        <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
        <p className='text-danger'>You do not have permission to view this content.</p>
      </div>
    );
  }

  return (
    <div>
      {status === 'loading' && (
        <div className='text-center mt-5'>
          <img src={Hourglass} alt="" height={40} width={40} />
        </div>
      )}

      {status === 'succeeded' && localFiles.length > 0 ? (
        <MaterialReactTable
          columns={columns}
          data={localFiles}
        />
      ) : status === 'succeeded' && localFiles.length === 0 ? (
        <p>No files available</p>
      ) : status === 'failed' ? (
        <p>Error fetching files: {error}</p> // Display error if fetch fails
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default RfpActive;
