// src/components/SuppressionorTalFilestable.js
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';
import Unauthorised from "../assets/401Unauthorised.png";
import Hourglass from "../assets/Hourglass.gif"; // Import hourglass loading animation
import { fetchSuppressionFiles, downloadFile, deleteFile } from '../redux/reducer/rpf/getsepparation';
import { toast } from 'react-toastify';

function SuppressionorTalFilestable() {
    const dispatch = useDispatch();
    const { files, loading, error } = useSelector((state) => state.suppressions);
    const userRole = localStorage.getItem('role');
    const [isDownloading, setIsDownloading] = useState(false); // State to track download status

    useEffect(() => {
        dispatch(fetchSuppressionFiles());
    }, [dispatch]);

    const handleDownload = async (fileId, originalName) => {
        if (isDownloading) return; // Prevent further downloads if one is already in progress
        setIsDownloading(true); // Set downloading state

        try {
            // Dispatch the download action
            await dispatch(downloadFile({ fileId, filename: originalName })).unwrap();
        } catch (error) {
            toast.error("Error downloading file");
        } finally {
            setIsDownloading(false); // Reset downloading state after operation
        }
    };

    const handleDelete = async (fileId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (confirmDelete) {
            try {
                await dispatch(deleteFile(fileId)).unwrap();
                toast.success("File deleted successfully");
            } catch (error) {
                toast.error("Error deleting file", error.message);
            }
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'srNumber',
            header: 'S.No',
            size: 100,
            Cell: ({ row }) => row.index + 1,
        },
        { accessorKey: 'originalname', header: 'Filename', size: 200 },
        { accessorKey: 'campaignName', header: 'Campaign Name', size: 200 },
        { accessorKey: 'campaignCode', header: 'Campaign Code', size: 150 },
        { accessorKey: 'suppressionType', header: 'File Type', size: 150 },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            size: 150,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex gap-3">
                    <Tooltip title="Download File">
                        <IconButton onClick={() => handleDownload(row.original._id, row.original.originalname)}>
                            <CloudDownloadIcon style={{ color: 'black', width: '30px', height: '30px' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete File">
                        <IconButton onClick={() => handleDelete(row.original._id)} disabled={userRole !== 'admin' && userRole !== 'oxmanager'}>
                            <DeleteIcon style={{ color: 'red', width: '30px', height: '30px' }} />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
            size: 150,
        },
    ], [isDownloading]); // Add isDownloading as a dependency

    // Render loading state with hourglass animation
    if (loading || !files || files.length === 0) {
        return (
            <div className='text-center mt-5'>
                <img src={Hourglass} alt="Loading" height={40} width={40} />
            </div>
        );
    }

    // Render error message
    if (error) {
        return <div>Error fetching data: {error}</div>;
    }

    // Render unauthorized message
    if (userRole !== 'teamleader' && userRole !== 'admin' && userRole !== 'oxmanager' && userRole !== 'reasercher') {
        return (
            <div className='text-center mt-2'>
                <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                <p className='text-danger'>You do not have permission to view this content.</p>
            </div>
        );
    }

    return <MaterialReactTable columns={columns} data={files} />;
}

export default SuppressionorTalFilestable;
