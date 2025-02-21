import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRatLCsvFiles, updateFileStatusQuality } from '../redux/reducer/rpf/uploadratl'; // Import your Redux actions
import { MaterialReactTable } from 'material-react-table';
import { Checkbox, IconButton, Tooltip } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Hourglass from "../assets/Hourglass.gif";
import Unauthorised from "../assets/401Unauthorised.png";
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import baseUrl from '../constant/ConstantApi';
import axios from 'axios';

const RfpQualityCheck = () => {
    const dispatch = useDispatch();
    const { ratlFiles, status, error } = useSelector((state) => state.fileUploadtl || []);

    console.log(ratlFiles);
    const [checkboxes, setCheckboxes] = useState({});
    const [excelData, setExcelData] = useState([]);
    const [currentFileName, setCurrentFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [updatedData, setUpdatedData] = useState([]);

    // Fetch files on initial render or status changes
    useEffect(() => {
        if (status === 'idle') {
            dispatch(getRatLCsvFiles());
        }
    }, [status, dispatch]);

    // Log and verify file IDs when ratlFiles change
    useEffect(() => {
        console.log('Ratl Files:', ratlFiles);
        ratlFiles.forEach((file) => {
            console.log('File ID:', file._id);  // Log the file ID to ensure it's correct
        });
    }, [ratlFiles]);

    useEffect(() => {
        const updatedCheckboxes = {};
        ratlFiles.forEach(file => {
            file.status.forEach(statusItem => {
                if (statusItem.userType === 'Quality') {
                    updatedCheckboxes[statusItem._id] = statusItem.checked;
                }
            });
        });
        setCheckboxes(updatedCheckboxes);
    }, [ratlFiles]);

    // Handle checkbox change
    const handleCheckboxChange = async (fileId, statusId, checked) => {
        try {
            console.log("File ID:", fileId, "Status ID:", statusId, "Checked:", checked);

            const fileToUpdate = ratlFiles.find(file => file._id === fileId);
            if (!fileToUpdate) return;

            const updatedStatus = fileToUpdate.status.map(statusItem =>
                statusItem._id === statusId ? { ...statusItem, checked } : statusItem
            );

            await axios.put(`${baseUrl}user/updateStatus_rl_tl/${fileId}`, { status: updatedStatus });

            setCheckboxes(prev => ({ ...prev, [statusId]: checked }));
            toast.success('Status updated successfully!');
        } catch (error) {
            toast.error('Error updating status. Please try again.');
        }
    };


    // Handle file read and Excel file parsing
    const handleRead = (fileId) => {
        const file = ratlFiles.find(file => file._id === fileId); // Use _id here to match the file
        if (file) {
            setCurrentFileName(file.filename);
            setSelectedFile(file); // Set selected file for update
        }
        dispatch(readFile({ fileId }))
            .unwrap()
            .then(({ arrayBuffer }) => {
                const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                setExcelData(data);
            })
            .catch((error) => {
                toast.error('Error reading file');
            });
    };

    // Handle checkbox change for file status (Quality or Email)

    

    // Handle downloading file
    const handleDownload = (fileId, filename) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error("You must be logged in to download files.");
            return;
        }

        const downloadUrl = `${baseUrl}user/downloadCsvFileByIdRa/${fileId}`; // Correct URL
        fetch(downloadUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('Error downloading file');
            }
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        })
        .catch(error => {
            toast.error("Error downloading file: " + error.message);
        });
    };

    // Save Excel row edits
    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        try {
            const updatedExcelData = [...excelData];
            const rowIndex = row.index + 2; // Adjust for header row
            updatedExcelData[rowIndex] = Object.values(values);

            setExcelData(updatedExcelData);
            const worksheet = XLSX.utils.aoa_to_sheet(updatedExcelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            const binaryString = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
            const buffer = new ArrayBuffer(binaryString.length);
            const view = new Uint8Array(buffer);
            for (let i = 0; i < binaryString.length; i++) {
                view[i] = binaryString.charCodeAt(i) & 0xFF;
            }

            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            let newFile;
            const formData = new FormData();
            if (selectedFile && selectedFile.filename && selectedFile._id) { // Use _id here instead of fileId
                newFile = new File([blob], selectedFile.filename, { type: blob.type });
                formData.append('file', newFile);
                if (selectedFile.path) formData.append('path', selectedFile.path);
            } else {
                throw new Error("No valid file selected.");
            }

            formData.append('updatedData', JSON.stringify(updatedExcelData));
            await dispatch(updateFileStatusQuality({
                fileId: selectedFile._id, // Use _id here for correct file reference
                fileData: { file: newFile, path: selectedFile.path },
                updatedData: updatedExcelData,
            })).unwrap();

            toast.success('File updated successfully!');
        } catch (error) {
            toast.error('Error updating file');
        } finally {
            exitEditingMode();
        }
    };

    // Filter files based on role
    const role = localStorage.getItem('role');
    const filteredFiles = useMemo(() => {
        if (!Array.isArray(ratlFiles) || !ratlFiles.length) {
            return [];
        }

        if (role !== 'quality' && role !== 'oxmanager' && role !== 'admin') {
            return [];
        }

        return ratlFiles.filter(file => {
            return Array.isArray(file?.status) &&
                file.status.some(statusItem => statusItem?.userType === 'Quality');
        });
    }, [ratlFiles, role]);

    // Define table columns for Excel and RAT L Files
    const excelColumns = useMemo(() => {
        if (excelData.length > 0) {
            const headers = excelData[1];
            return headers.map((header, index) => ({
                accessorKey: `${index}`,
                header,
                enableEditing: true,
            }));
        }
        return [];
    }, [excelData]);

    const excelTableData = useMemo(() => {
        if (excelData.length > 1) {
            return excelData.slice(2).map((row, rowIndex) => {
                const rowData = {};
                row.forEach((cell, cellIndex) => {
                    rowData[cellIndex] = cell;
                });
                return rowData;
            });
        }
        return [];
    }, [excelData]);

    const numberedFiles = useMemo(() => {
        return filteredFiles.map((file, index) => ({
            ...file,
            serialNumber: index + 1,
            formattedDate: new Date(file.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }),
        }));
    }, [filteredFiles]);

    const columns = useMemo(
        () => [
            { accessorKey: 'serialNumber', header: 'S.No', size: 50 },
            { accessorKey: 'originalname', header: 'Filename', size: 200 },
            { accessorKey: 'campaignName', header: 'Campaign Name', size: 200 },
            { accessorKey: 'campaignCode', header: 'Campaign Code', size: 100 },
            { accessorKey: 'formattedDate', header: 'Date', size: 150 },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 100,
                Cell: ({ row }) => (
                    <div>
                        {row.original.status
                            .filter(statusItem => statusItem.userType === 'Quality')
                            .map((statusItem) => (
                                <div key={statusItem._id} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Checkbox
                                        color="success"
                                        checked={checkboxes[statusItem._id] || false}
                                        onChange={(e) => handleCheckboxChange(row.original._id, statusItem._id, e.target.checked)}
                                    />
                                    {statusItem.userType}
                                </div>
                            ))}
                    </div>
                ),
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                Cell: ({ row }) => (
                    <div className="d-flex gap-3">
                        <Tooltip title="Download File">
                            <IconButton >
                                <CloudDownloadIcon
                                    style={{ color: "black", width: '30px', height: '30px' }}
                                    onClick={() => handleDownload(row.original._id, row.original.filename)} // Use _id here
                                />
                            </IconButton>
                        </Tooltip>
                    </div>
                ),
                size: 150,
            },
        ],
        [handleRead, handleCheckboxChange, checkboxes]
    );

    if (status === "loading") return (
        <div className='text-center mt-5'>
            <img src={Hourglass} alt="" height={40} width={40} />
        </div>
    );
    if (status === 'failed') return <div>Error: {error}</div>;

    if (role !== 'quality' && role !== 'admin' && role !== 'oxmanager') {
        return <div className='text-center mt-2'>
            <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
            <p className='text-danger'>You do not have permission to view this content.</p>
        </div>;
    }

    return (
        <div>
            {excelData.length === 0 ? (
                <MaterialReactTable columns={columns} data={numberedFiles} />
            ) : (
                <MaterialReactTable
                    columns={excelColumns}
                    data={excelTableData}
                    editingMode="row"
                    enableEditing
                    onEditingRowSave={handleSaveRowEdits}
                />
            )}
        </div>
    );
};

export default RfpQualityCheck;
