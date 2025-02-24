import React, { useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Checkbox } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCsvFilesbyEMChecked } from '../redux/reducer/rpf/getEmCheckData'; // Adjust the path based on your structure
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../constant/ConstantApi';
import Hourglass from "../assets/Hourglass.gif";
import Unauthorised from "../assets/401Unauthorised.png"


const EMDoneShowQualityTab = () => {
    const dispatch = useDispatch();
    const { csvFiles, loading, error } = useSelector((state) => state.csvFileCheckedbyEMChecked);
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role'); // Assuming you store user role as 'userRole'

    useEffect(() => {
        // Fetch CSV files when the component mounts
        const fetchData = async () => {
            try {
                await dispatch(fetchCsvFilesbyEMChecked());
            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error("Failed to fetch data");
            }
        };
        fetchData();
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
                            <DownloadIcon
                                style={{ cursor: 'pointer', color: 'blue', width: '30px', height: '30px' }}
                            />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ], []);

    const handleDownload = async (file) => {
        const { _id, originalname } = file;
        try {
            const response = await axios.get(`${baseUrl}user/getEMCheckedCsvFileById/${_id}`, {
                responseType: "blob", // Receive the file as a Blob
                headers: {
                    Authorization: `Bearer ${token}`, // Send the token in the header
                },
            });

            // Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", originalname); // Set the filename for download

            // Append the link to the document body and trigger the download
            document.body.appendChild(link);
            link.click();

            // Clean up by removing the link and revoking the Object URL
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error during file download:", error);
            toast.error("Failed to download file");
        }
    };

    const handleDelete = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await axios.delete(`${baseUrl}user/deleteEMCheckedCsvFileById/${fileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                dispatch(fetchCsvFilesbyEMChecked()); // Refresh the file list after deletion
                toast.success('File deleted successfully');
            } catch (error) {
                alert(`Failed to delete file: ${error.message}`);
            }
        }
    };

    // Render loading spinner if loading
    if (loading) return (
        <div className='text-center mt-5'>
            <img src={Hourglass} alt="Loading..." height={40} width={40} />
        </div>
    );

    // Render error message if error exists
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    // Check if the user role is "quality"
    if (userRole !== 'quality' && userRole !== 'admin' && userRole !== 'oxmanager') {
        return <div className='text-center mt-2 '>
        <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
        <p className='text-danger'>You do not have permission to view this content.</p>
      </div>;
    }

    // Render the table if everything is fine
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

export default EMDoneShowQualityTab;
