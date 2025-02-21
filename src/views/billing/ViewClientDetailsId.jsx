import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip, Checkbox } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchFiles } from '../../redux/reducer/rpf/operatilallfile';
import axios from 'axios';
import baseUrl from '../../constant/ConstantApi';
import Unauthorised from "../../assets/401Unauthorised.png";
import Hourglass from "../../assets/Hourglass.gif";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import {fetchClientDetails} from "../../redux/reducer/billing/ViewClientDetails"

const RfpOperationAll = ({ clientName }) => {
    const dispatch = useDispatch();
    const { files } = useSelector((state) => state.rfp);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await dispatch(fetchFiles());
            setIsLoading(false);
        };
        fetchData();
    }, [dispatch]);

    // Filter files where clientSelect matches clientName
    const filteredFiles = files.filter(file => file.clientSelect === clientName);

    const handleDownload = async (file) => {
        const { _id, originalname } = file;
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get(`${baseUrl}user/getCsvFileByIdOperation/${_id}`, {
                responseType: "blob",
                headers: { Authorization: `Bearer ${token}` },
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
            toast.error("Failed to download file");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    const columns = useMemo(() => [
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
                        <DownloadIcon style={{ cursor: 'pointer', color: 'blue', width: '30px', height: '30px' }} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ], []);

    const userType = localStorage.getItem('role');
    const allowedRoles = ['oxmanager', 'delivery', 'admin'];

    if (!allowedRoles.includes(userType)) {
        return (
            <div className='text-center mt-2 '>
                <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                <p className='text-danger'>You do not have permission to view this content.</p>
            </div>
        );
    }

    return (
        <div>
            {isLoading ? (
                <div className="text-center">
                    <img src={Hourglass} alt="Loading..." width={50} height={50} />
                    <p>Loading...</p>
                </div>
            ) : (
                <MaterialReactTable columns={columns} data={filteredFiles} />
            )}
        </div>
    );
};



const countries = [
    { value: '95', label: 'Albania' },
    { value: '96', label: 'Algeria' },
    { value: '86', label: 'American Samoa' },
    { value: '97', label: 'Andorra' },
    { value: '98', label: 'Angola' },
    { value: '45', label: 'APAC' },
    { value: '61', label: 'Australia' },
    { value: '99', label: 'Austria' },
    { value: '100', label: 'Bahrain' },
    { value: '50', label: 'Bangladesh' },
    { value: '101', label: 'Belarus' },
    { value: '102', label: 'Belgium' },
    { value: '103', label: 'Benin' },
    { value: '72', label: 'Bhutan' },
    { value: '104', label: 'Bosnia and Herzegovina' },
    { value: '105', label: 'Botswana' },
    { value: '214', label: 'Brazil' },
    { value: '75', label: 'Brunei' },
    { value: '106', label: 'Bulgaria' },
    { value: '107', label: 'Burkina Faso' },
    { value: '108', label: 'Burundi' },
    { value: '64', label: 'Cambodia' },
    { value: '109', label: 'Cameroon' },
    { value: '212', label: 'Canada' },
    { value: '110', label: 'Cape Verde' },
    { value: '111', label: 'Central African Republic' },
    { value: '112', label: 'Chad' },
    { value: '46', label: 'China' },
    { value: '113', label: 'Comoros' },
    { value: '88', label: 'Cook Islands' },
    { value: '114', label: 'Croatia' },
    { value: '115', label: 'Cyprus' },
    { value: '116', label: 'Czech Republic' },
    { value: '117', label: 'Democratic Republic of the Congo' },
    { value: '118', label: 'Denmark' },
    { value: '119', label: 'Djibouti' },
    { value: '120', label: 'Egypt' },
    { value: '94', label: 'EMEA' },
    { value: '121', label: 'Equatorial Guinea' },
    { value: '122', label: 'Eritrea' },
    { value: '123', label: 'Estonia' },
    { value: '124', label: 'Ethiopia' },
    { value: '1', label: 'Europe' },
    { value: '125', label: 'Faroe Islands' },
    { value: '71', label: 'Fiji' },
    { value: '126', label: 'Finland' },
    { value: '127', label: 'France' },
    { value: '78', label: 'French Polynesia' },
    { value: '128', label: 'Gabon' },
    { value: '129', label: 'Gambia' },
    { value: '130', label: 'Georgia' },
    { value: '131', label: 'Germany' },
    { value: '132', label: 'Ghana' },
    { value: '133', label: 'Gibraltar' },
    { value: '134', label: 'Greece' },
    { value: '80', label: 'Guam' },
    { value: '135', label: 'Guernsey' },
    { value: '136', label: 'Guinea' },
    { value: '137', label: 'Guinea-Bissau' },
    { value: '44', label: 'Holy See' },
    { value: '215', label: 'Hong Kong' },
    { value: '138', label: 'Hungary' },
    { value: '139', label: 'Iceland' },
    { value: '47', label: 'India' },
    { value: '48', label: 'Indonesia' },
    { value: '140', label: 'Iran' },
    { value: '141', label: 'Iraq' },
    { value: '142', label: 'Ireland' },
    { value: '143', label: 'Isle Of Man' },
    { value: '144', label: 'Israel' },
    { value: '145', label: 'Italy' },
    { value: '146', label: 'Ivory Coast' },
    { value: '52', label: 'Japan' },
    { value: '147', label: 'Jersey' },
    { value: '148', label: 'Jordan' },
    { value: '149', label: 'Kenya' },
    { value: '81', label: 'Kiribati' },
    { value: '150', label: 'Kuwait' },
    { value: '66', label: 'Laos' },
    { value: '151', label: 'Latvia' },
    { value: '152', label: 'Lebanon' },
    { value: '153', label: 'Lesotho' },
    { value: '154', label: 'Liberia' },
    { value: '155', label: 'Libya' },
    { value: '156', label: 'Liechtenstein' },
    { value: '157', label: 'Lithuania' },
    { value: '158', label: 'Luxembourg' },
    { value: '159', label: 'Macedonia' },
    { value: '160', label: 'Madagascar' },
    { value: '161', label: 'Malawi' },
    { value: '58', label: 'Malaysia' },
    { value: '74', label: 'Maldives' },
    { value: '162', label: 'Mali' },
    { value: '163', label: 'Malta' },
    { value: '84', label: 'Marshall Islands' },
    { value: '164', label: 'Mauritania' },
    { value: '165', label: 'Mauritius' },
    { value: '213', label: 'Mexico' },
    { value: '82', label: 'Micronesia' },
    { value: '166', label: 'Moldova' },
    { value: '167', label: 'Monaco' },
    { value: '69', label: 'Mongolia' },
    { value: '168', label: 'Montenegro' },
    { value: '169', label: 'Morocco' },
    { value: '170', label: 'Mozambique' },
    { value: '56', label: 'Myanmar' },
    { value: '171', label: 'Namibia' },
    { value: '91', label: 'Nauru' },
    { value: '59', label: 'Nepal' },
    { value: '172', label: 'Netherlands' },
    { value: '77', label: 'New Caledonia' },
    { value: '68', label: 'New Zealand' },
    { value: '173', label: 'Niger' },
    { value: '174', label: 'Nigeria' },
    { value: '92', label: 'Niue' },
    { value: '60', label: 'North Korea' },
    { value: '32', label: 'North Macedonia' },
    { value: '85', label: 'Northern Mariana Islands' },
    { value: '175', label: 'Norway' },
    { value: '176', label: 'Oman' },
    { value: '49', label: 'Pakistan' },
    { value: '87', label: 'Palau' },
    { value: '177', label: 'Palestine' },
    { value: '65', label: 'Papua New Guinea' },
    { value: '53', label: 'Philippines' },
    { value: '178', label: 'Poland' },
    { value: '179', label: 'Portugal' },
    { value: '180', label: 'Qatar' },
    { value: '181', label: 'Romania' },
    { value: '51', label: 'Russia' },
    { value: '182', label: 'Rwanda' },
    { value: '79', label: 'Samoa' },
    { value: '183', label: 'San Marino' },
    { value: '184', label: 'Sao Tome & Principe' },
    { value: '185', label: 'Saudi Arabia' },
    { value: '186', label: 'Senegal' },
    { value: '187', label: 'Serbia' },
    { value: '67', label: 'Singapore' },
    { value: '188', label: 'Slovakia' },
    { value: '189', label: 'Slovenia' },
    { value: '73', label: 'Solomon Islands' },
    { value: '190', label: 'Somalia' },
    { value: '191', label: 'South Africa' },
    { value: '57', label: 'South Korea' },
    { value: '192', label: 'Spain' },
    { value: '63', label: 'Sri Lanka' },
    { value: '193', label: 'Sudan' },
    { value: '194', label: 'Swaziland' },
    { value: '195', label: 'Sweden' },
    { value: '196', label: 'Switzerland' },
    { value: '197', label: 'Syria' },
    { value: '62', label: 'Taiwan' },
    { value: '198', label: 'Tanzania' },
    { value: '55', label: 'Thailand' },
    { value: '70', label: 'Timor Leste' },
    { value: '199', label: 'Togo' },
    { value: '93', label: 'Tokelau' },
    { value: '83', label: 'Tonga' },
    { value: '200', label: 'Tunisia' },
    { value: '201', label: 'Turkey' },
    { value: '89', label: 'Tuvalu' },
    { value: '202', label: 'Uganda' },
    { value: '203', label: 'Ukraine' },
    { value: '204', label: 'United Arab Emirates' },
    { value: '3', label: 'United Kingdom' },
    { value: '211', label: 'United States' },
    { value: '76', label: 'Vanuatu' },
    { value: '206', label: 'Vatican City' },
    { value: '54', label: 'Vietnam' },
    { value: '90', label: 'Wallis And Futuna' },
    { value: '207', label: 'Western Sahara' },
    { value: '208', label: 'Yemen' },
    { value: '209', label: 'Zambia' },
    { value: '210', label: 'Zimbabwe' }
];

function ViewClientDetailsId() {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clientDetails = useSelector((state) => state.clientDetails.details);
    const clientStatus = useSelector((state) => state.clientDetails.status);
    const userType = localStorage.getItem('role');
    const allowedRoles = ['oxmanager', 'delivery', 'admin'];
    // Assuming countries are in Redux state
    if (!allowedRoles.includes(userType)) {
        return <div className='text-center mt-5 '>
            <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
            <p className='text-danger'>You do not have permission to view this content.</p>
        </div>;
    }
    useEffect(() => {
        dispatch(fetchClientDetails(id));
    }, [id, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateClientDetails({ id, details: { ...clientDetails, [name]: value } }));
    };

    const handleUpdateClient = async () => {
        try {
            await dispatch(updateClientDetails({ id, details: clientDetails }));
            toast.success('Client details updated successfully.');
            navigate("/billing/viewClient");
        } catch (error) {
            toast.error('Error updating client details.');
        }
    };

    return (
        <Container fluid className='my-5'>
            <Row>
                <Col lg={3}></Col>
                <Col lg={8}>
                    <div className='bgColor rounded-3 shadow'>
                        <h4 className='fw-bold py-3 ms-3 text_color'>View Client Details</h4>
                    </div>
                    <div className="row">
                        <div className="col-xxl">
                            <div className="card mb-4">
                                <div className="card-header p-3 d-flex align-items-center justify-content-between">
                                    <small className="text-muted float-end">Fields marked <span className="text-danger">*</span> are mandatory</small>
                                </div>
                                <div className="card-body">
                                    <Form>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="company_name"
                                                    value={clientDetails.company_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>POC Name <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="client_name"
                                                    value={clientDetails.client_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>Phone No <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="mobile"
                                                    value={clientDetails.mobile}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={clientDetails.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="address"
                                                    value={clientDetails.address}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                                                <Form.Select
                                                    name="country"
                                                    value={clientDetails.country}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map((country) => (
                                                        <option key={country.value} value={country.value}>
                                                            {country.label}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>City <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="city"
                                                    value={clientDetails.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <Form.Label>Pincode <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="pincode"
                                                    value={clientDetails.pincode}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <Button variant="primary" onClick={handleUpdateClient} disabled={clientStatus === 'loading'}>
                                                {clientStatus === 'loading' ? 'Updating...' : 'Update'}
                                            </Button>
                                            <Link variant="danger" className="ms-2 btn btn-danger" to='/billing/vieweClient'>Back</Link>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bgColor rounded-3 shadow text-center'>
                        <h4 className='fw-bold py-2 ms-3 text_color'>All Files </h4>
                    </div>
                    <RfpOperationAll clientName={clientDetails.company_name} />

                </Col>
            </Row>

        </Container>

    );
}

export default ViewClientDetailsId;
