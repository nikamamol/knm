import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Checkbox from '@mui/material/Checkbox';
import { downloadFile, fetchFileDataAll } from '../redux/reducer/rpf/getcsvfiledata';
import { pink } from '@mui/material/colors';
import { IconButton, Tooltip } from '@mui/material';
import Hourglass from "../assets/Hourglass.gif";
import Unauthorised from "../assets/401Unauthorised.png";
import { toast } from 'react-toastify';

const RfpReceivedAll = () => {
  const dispatch = useDispatch();
  const { files, status, error } = useSelector((state) => state.fileData);

  // Get role from localStorage
  const role = localStorage.getItem('role');
  const allowedRoles = ['oxmanager', 'reasercher', 'admin', 'quality', 'email_marketing'];

  // Fetch file data when the component mounts
  useEffect(() => {
    dispatch(fetchFileDataAll())
      .unwrap()
      .then(() => {
        // console.log('File data fetched successfully');
      })
      .catch((fetchError) => {
        // console.error('Error fetching file data:', fetchError);
        toast.error(fetchError);
      });
  }, [dispatch]);

  // Handle file download
  const handleDownload = (fileId, filename) => {
    dispatch(downloadFile({ fileId, filename }))
      .unwrap()
      .then(() => {
        // console.log('File downloaded successfully');
        toast.success('File downloaded successfully');
      })
      .catch((error) => {
        // console.error('Error downloading file:', error);
        toast.error(error);
      });
  };

  // Define table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'S.No',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'filename',
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
        size: 200,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 400,
        Cell: ({ row }) => (
          <div className='d-flex gap-2'>
            {row.original.status.length > 0 ? (
              row.original.status.map((statusItem) => (
                <p key={statusItem._id}>
                  <Checkbox
                    defaultChecked={statusItem.checked}
                    checked={statusItem.checked}
                    disabled
                    sx={{
                      color: pink[800],
                      '&.Mui-checked': {
                        color: pink[600],
                      },
                    }}
                  />
                  {statusItem.userType === "Employee" ? "RA" : statusItem.userType}
                </p>
              ))
            ) : (
              <p>No status available</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Action',
        Cell: ({ row }) => {
          const allChecked = row.original.status.every((statusItem) => statusItem.checked);

          return (
            <Tooltip title="Download File">
              <IconButton disabled={!allChecked}>
                <CloudDownloadIcon
                  className={allChecked ? 'enabled' : 'disabled'}
                  style={{
                    cursor: allChecked ? 'pointer' : 'not-allowed',
                    color: allChecked ? 'black' : 'secondary',
                    width: '30px',
                    height: '30px',
                  }}
                  onClick={() => allChecked && handleDownload(row.original.fileId, row.original.filename)}
                />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],
    [handleDownload]
  );

  // Check if the user role is allowed
  if (!allowedRoles.includes(role)) {
    return (
      <div className='text-center mt-2'>
        <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
        <p className='text-danger'>You do not have permission to view this content.</p>
      </div>
    );
  }

  // Show loading spinner while data is being fetched
  if (status === "loading" || !files || files.length === 0) return (
    <div className='text-center mt-5'>
      <img src={Hourglass} alt="Loading" height={40} width={40} />
    </div>
  );

  // Show error if data fetching fails
  if (status === 'failed') return (
    <div>
      Error: {error}
      <button className='btn btn-primary ms-2' onClick={() => dispatch(fetchFileDataAll())}>Refresh</button>
    </div>
  );

  // If data is available, render the table
  return <MaterialReactTable columns={columns} data={files} />;
};

export default RfpReceivedAll;
