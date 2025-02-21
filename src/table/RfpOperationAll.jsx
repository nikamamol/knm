import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Checkbox } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles, readFile } from '../redux/reducer/rpf/operatilallfile';
import { SpreadsheetComponent, SheetDirective, SheetsDirective, ColumnsDirective, ColumnDirective, RangeDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-react-spreadsheet/styles/material.css';
import DownloadIcon from '@mui/icons-material/Download';
import Unauthorised from "../assets/401Unauthorised.png"


import axios from 'axios';
import * as XLSX from 'xlsx';
import baseUrl from '../constant/ConstantApi';
import Hourglass from "../assets/Hourglass.gif";
import { toast } from 'react-toastify';


// SpreadsheetViewer Component
const SpreadsheetViewer = ({ data }) => {
    return (
        <div style={{ width: '100%' }}>
            {data.length > 0 && (
                <SpreadsheetComponent allowOpen={true} allowSave={true} showRibbon={true}>
                    <SheetsDirective>
                        <SheetDirective>
                            <RangesDirective>
                                <RangeDirective dataSource={data} />
                            </RangesDirective>
                            <ColumnsDirective>
                                {data[0].map((_, idx) => (
                                    <ColumnDirective key={idx} width={120} />
                                ))}
                            </ColumnsDirective>
                        </SheetDirective>
                    </SheetsDirective>
                </SpreadsheetComponent>
            )}
        </div>
    );
};

const RfpOperationAll = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State to store Excel data and selected file info
    const [excelData, setExcelData] = useState([]);
    const [currentFileName, setCurrentFileName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Use Redux selectors to access the state
    const { files, status, error } = useSelector((state) => state.rfp);
    const userType = localStorage.getItem('role');
    const allowedRoles = ['oxmanager', 'delivery', 'admin'];

    useEffect(() => {

        dispatch(fetchFiles()); // Dispatch the action to fetch files
        setIsLoading(false);
    }, [dispatch, navigate]);

    const handleDownload = async (file) => {
        const { _id, originalname } = file;
        // Replace with your base URL
        const token = localStorage.getItem('authToken'); // Assume you have a token stored

        try {
            const response = await axios.get(`${baseUrl}user/getCsvFileByIdOperation/${_id}`, {
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
            // console.error("Error during file download:", error);
            toast.error("Failed to download file");
            // alert("Failed to download file");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    const handleCheckboxChange = (fileId, status, checked) => {
        // Logic to update the file status should be added here
    };

    const columns = useMemo(
        () => [
            { accessorKey: '_id', header: 'S.No', size: 50, Cell: ({ row }) => row.index + 1 },
            { accessorKey: 'originalname', header: 'Filename', size: 200 },
            { accessorKey: 'campaignName', header: 'Campaign Name', size: 200 },
            { accessorKey: 'clientSelect', header: 'Client Name', size: 200 },
            { accessorKey: 'campaignCode', header: 'Campaign Code', size: 150 },
            { accessorKey: 'createdAt', header: 'Date', size: 150, Cell: ({ cell }) => formatDate(cell.getValue()) },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 150,
                Cell: ({ row }) => (
                    <>
                        <Checkbox
                            color="success"
                            checked={row.original.status === 'Done'}
                            onChange={(e) => handleCheckboxChange(row.original._id, row.original.status, e.target.checked)}
                        />
                        {row.original.status}
                    </>
                ),
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 150,
                Cell: ({ row }) => (
                    <Tooltip title="Download File">
                        <IconButton onClick={() => handleDownload(row.original)}>
                            <DownloadIcon
                                style={{ cursor: 'pointer', color: 'blue', width: '30px', height: '30px' }}
                            />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        []
    );

    if (!allowedRoles.includes(userType)) {
        return <div className='text-center mt-2 '>
            <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
            <p className='text-danger'>You do not have permission to view this content.</p>
        </div>;
    }
    return (
        <div>
            {isLoading ? (
                <div className="text-center mt-3">
                    <img src={Hourglass} alt="Loading..." width={50} height={50} />
                </div>
            ) : (

                <MaterialReactTable columns={columns} data={files} />


            )}
        </div>
    );
};

export default RfpOperationAll;
