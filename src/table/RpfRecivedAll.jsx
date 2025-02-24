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

  const role = localStorage.getItem('role');
  const allowedRoles = ['oxmanager', 'reasercher', 'admin'];

  useEffect(() => {
    dispatch(fetchFileDataAll())
      .unwrap()
      .then(() => {
        toast.success('File data fetched successfully');
      })
      .catch((fetchError) => {
        toast.error(fetchError);
      });
  }, [dispatch]);

  const handleDownload = (fileId, filename) => {
    dispatch(downloadFile({ fileId, filename }))
      .unwrap()
      .then(() => {
        toast.success('File downloaded successfully');
      })
      .catch((error) => {
        toast.error(error);
      });
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
        size: 150,
        Cell: ({ row }) => (
          <div className='d-flex gap-2'>
            {row.original.status.length > 0 ? (
              row.original.status
                .filter((statusItem) => statusItem.userType === "Employee")
                .map((statusItem) => (
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
                    RA
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
        Cell: ({ row }) => (
          <Tooltip title="Download File">
            <IconButton onClick={() => handleDownload(row.original.fileId, row.original.filename)}>
              <CloudDownloadIcon
                style={{
                  cursor: 'pointer',
                  color: 'black',
                  width: '30px',
                  height: '30px',
                }}
              />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [handleDownload]
  );

  if (!allowedRoles.includes(role)) {
    return (
      <div className='text-center mt-2'>
        <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
        <p className='text-danger'>You do not have permission to view this content.</p>
      </div>
    );
  }

  if (status === "loading" || !files || files.length === 0) return (
    <div className='text-center mt-5'>
      <img src={Hourglass} alt="Loading" height={40} width={40} />
    </div>
  );

  if (status === 'failed') return (
    <div>
      Error: {error}
      <button className='btn btn-primary ms-2' onClick={() => dispatch(fetchFileDataAll())}>Refresh</button>
    </div>
  );

  return <MaterialReactTable columns={columns} data={files} />;
};

export default RfpReceivedAll;
