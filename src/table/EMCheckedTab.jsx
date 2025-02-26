import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCsvFilesbyEMChecked } from '../redux/reducer/rpf/getEmCheckData';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import baseUrl from '../constant/ConstantApi';
import Hourglass from "../assets/Hourglass.gif";

const EMCheckedTab = () => {
    const dispatch = useDispatch();
    const { csvFiles, loading, error } = useSelector((state) => state.csvFileCheckedbyEMChecked);
    const token = localStorage.getItem('authToken');
    const [fileRecordCounts, setFileRecordCounts] = useState({});

    useEffect(() => {
        dispatch(fetchCsvFilesbyEMChecked());
    }, [dispatch]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    const countCsvRows = async (fileId) => {
        if (fileRecordCounts[fileId] !== undefined) return;
        try {
            const response = await axios.get(`${baseUrl}user/getEMCheckedCsvFileById/${fileId}`, {
                responseType: 'arraybuffer',
                headers: { Authorization: `Bearer ${token}` },
            });
            const workbook = XLSX.read(new Uint8Array(response.data), { type: 'array' });
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            setFileRecordCounts((prevCounts) => ({ ...prevCounts, [fileId]: worksheet.length }));
        } catch (error) {
            console.error('Error counting CSV rows:', error);
            toast.error('Failed to count file records');
        }
    };

    const handleDownload = async (file) => {
        const { _id, originalname } = file;
        try {
            const response = await axios.get(`${baseUrl}user/getEMCheckedCsvFileById/${_id}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalname);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error during file download:', error);
            toast.error('Failed to download file');
        }
    };

    const handleDelete = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await axios.delete(`${baseUrl}user/deleteEMCheckedCsvFileById/${fileId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch(fetchCsvFilesbyEMChecked());
                toast.success('File deleted successfully');
            } catch (error) {
                toast.error(`Failed to delete file: ${error.message}`);
            }
        }
    };

    const columns = useMemo(() => [
        { accessorKey: '_id', header: 'S.No', size: 100, Cell: ({ row }) => row.index + 1 },
        { accessorKey: 'originalname', header: 'Filename', size: 200 },
        { accessorKey: 'campaignName', header: 'Campaign Name', size: 200 },
        { accessorKey: 'campaignCode', header: 'Campaign Code', size: 150 },
        { accessorKey: 'createdAt', header: 'Date', size: 150, Cell: ({ cell }) => formatDate(cell.getValue()) },
        {
            accessorKey: 'recordCount',
            header: 'Count',
            size: 100,
            Cell: ({ row }) => {
                const fileId = row.original._id;
                useEffect(() => { countCsvRows(fileId); }, [fileId]);
                return fileRecordCounts[fileId] !== undefined ? fileRecordCounts[fileId] : 'Loading...';
            }
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
    ], [fileRecordCounts, countCsvRows]);

    if (loading) return <div className='text-center mt-5'><img src={Hourglass} alt="Loading..." height={40} width={40} /></div>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!csvFiles.length) return <p>No data available</p>;

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

export default EMCheckedTab;

// Let me know if you’d like any more tweaks or enhancements! 🚀