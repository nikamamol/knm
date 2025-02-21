import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Checkbox } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { pink } from '@mui/material/colors';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../constant/ConstantApi';
import Hourglass from "../assets/Hourglass.gif";
import Unauthorised from "../assets/401Unauthorised.png";
import { getRatLCsvFiles } from '../redux/reducer/rpf/uploadratl';

const Preqatl = () => {
    const dispatch = useDispatch();
    const { ratlFiles, status, error } = useSelector((state) => state.fileUploadtl || []);
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');
    const allowedRoles = ['oxmanager', 'teamleader', 'admin'];

    useEffect(() => {
        dispatch(getRatLCsvFiles())
            .unwrap()
            .catch((fetchError) => {
                toast.error(fetchError);
            });
    }, [dispatch]);

    const handleDownload = async (fileId, filename) => {
        try {
            const response = await axios.get(`${baseUrl}user/getCsvFileByIdtl/${fileId}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` },
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('File downloaded successfully');
        } catch (error) {
            toast.error('Failed to download file');
        }
    };

    const handleDelete = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await axios.delete(`${baseUrl}user/deleteRatlCsvFileById/${fileId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('File deleted successfully');
                dispatch(getRatLCsvFiles());
            } catch (error) {
                toast.error('Failed to delete file');
            }
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: '_id',
            header: 'S.No',
            size: 50,
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
            accessorKey: 'actions',
            header: 'Actions',
            size: 150,
            Cell: ({ row }) => (
                <div className="d-flex gap-3">
                    <Tooltip title="Download File">
                        <IconButton onClick={() => handleDownload(row.original._id, row.original.originalname)}>
                            <CloudDownloadIcon style={{ cursor: 'pointer', color: 'blue', width: '30px', height: '30px' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete File">
                        <IconButton onClick={() => handleDelete(row.original._id)}>
                            <DeleteIcon style={{ cursor: 'pointer', color: 'red', width: '30px', height: '30px' }} />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ], []);

    if (!allowedRoles.includes(userRole)) {
        return (
            <div className='text-center mt-2'>
                <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                <p className='text-danger'>You do not have permission to view this content.</p>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className='text-center mt-5'>
                <img src={Hourglass} alt="Loading..." height={40} width={40} />
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div>
                Error: {error}
                <button className='btn btn-primary ms-2' onClick={() => dispatch(getRatLCsvFiles())}>Refresh</button>
            </div>
        );
    }

    if (!ratlFiles.length) {
        return <p>No data available</p>;
    }

    return <MaterialReactTable columns={columns} data={ratlFiles} enableColumnResizing enableStickyHeader />;
};

export default Preqatl;
