import React, { useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../constant/ConstantApi';
import { fetchCsvFilesbyEMMaster } from '../redux/reducer/rpf/getEmMasterFileData';
import Hourglass from "../assets/Hourglass.gif";
import Unauthorised from "../assets/401Unauthorised.png";

const EMasterTab = () => {
    const dispatch = useDispatch();
    const { csvFiles, loading, error } = useSelector((state) => state.csvFileCheckedbyEMMaster);
    const userRole = localStorage.getItem('role'); // Assuming user role is stored in local storage
    const allowedRoles = ['oxmanager', 'admin', 'email_marketing'];

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            dispatch(fetchCsvFilesbyEMMaster()); // Only dispatch if token is present
        } else {
            toast.error('No token available')
            console.error('No token available');
        }
    }, [dispatch]);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const columns = useMemo(() => [
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
                            <DownloadIcon style={{ cursor: 'pointer', color: 'blue', width: '30px', height: '30px' }} />
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

    const handleDownload = async (file) => {
        const token = localStorage.getItem('authToken');
        const { _id, originalname } = file;
        try {
            const response = await axios.get(`${baseUrl}user/getEMMasterCsvFileById/${_id}`, {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", originalname);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            
            console.error("Error during file download:", error);
            toast.error("Failed to download file");
        }
    };

    const handleDelete = async (fileId) => {
        const token = localStorage.getItem('authToken');
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await axios.delete(`${baseUrl}user/deleteEMMasterCsvFileById/${fileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                dispatch(fetchCsvFilesbyEMMaster()); // Fetch updated data
                toast.success('File deleted successfully');
            } catch (error) {
                console.error("Error deleting file:", error);
                toast.error('Failed to delete file');
            }
        }
    };

    if (loading) return (
        <>
            <div className='text-center mt-5'><img src={Hourglass} alt="" height={40} width={40} /></div>
        </>
    );
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    if (!allowedRoles.includes(userRole)) {
        return (
            <div className='text-center mt-2 '>
                <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                <p className='text-danger'>You do not have permission to view this content.</p>
            </div>
        );
    }

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={csvFiles}
                enableColumnResizing
                enableStickyHeader
            />
        </div>
    );
};

export default EMasterTab;
