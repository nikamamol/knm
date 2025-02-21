import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row, Button, Modal, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import BackupIcon from '@mui/icons-material/Backup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaigns } from '../../redux/reducer/createcampaign/GetCampaignData';
import { fetchFileData } from '../../redux/reducer/rpf/getcsvfiledata';
import SuppressionorTalFilestable from '../../table/SuppressionorTalFilestable';
import { uploadSuppression } from '../../redux/reducer/rpf/uploadSuppression';
import { fetchSuppressionFiles } from '../../redux/reducer/rpf/getsepparation';
import { toast } from 'react-toastify';

function TalSuppressionFile() {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [selectedCampaignCode, setSelectedCampaignCode] = useState('');
    const [suppressionType, setSuppressionType] = useState('');

    const dispatch = useDispatch();
    const campaigns = useSelector((state) => state.campaigns.campaigns);
    const uploadStatus = useSelector((state) => state.fileUpload.status);
    const uploadMessage = useSelector((state) => state.fileUpload.message);
    const fileData = useSelector((state) => state.fileData.files); // Fetch file data from Redux store

    useEffect(() => {
        dispatch(fetchSuppressionFiles());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCampaigns());
        dispatch(fetchFileData());
    }, [dispatch]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleCampaignChange = (e) => {
        const selectedCampaignId = e.target.value;
        const campaign = campaigns.find((campaign) => campaign._id === selectedCampaignId);
        if (campaign) {
            setSelectedCampaign(campaign.campaignName);
            setSelectedCampaignCode(campaign.campaignCode);
        }
    };

    const handleSuppressionTypeChange = (e) => {
        setSuppressionType(e.target.value);
    };

    const userRole = localStorage.getItem('role');

    const handleFileUpload = async () => {
        if (!file || !selectedCampaign || !selectedCampaignCode || !suppressionType) {
            alert('Please select a file, a campaign, and a suppression type!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('campaignName', selectedCampaign);
        formData.append('campaignCode', selectedCampaignCode);
        formData.append('suppressionType', suppressionType);

        try {
            await dispatch(uploadSuppression(formData)).unwrap();
            toast.success('File uploaded successfully!');
            dispatch(fetchSuppressionFiles()); // Fetch the updated file data after upload
            setShow(false);
        } catch (error) {
            toast.error('Failed to upload the file: ' + (uploadMessage || error.message));
        }
    };

    // Dropzone configuration
    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div>
            <Container fluid className='my-5'>
                <Row>
                    <Col lg={2}></Col>
                    <Col lg={10}>
                        <div className='bgColor rounded-3 shadow'>
                            <h4 className='fw-bold py-3 ms-3 text_color'>Suppression or Tal Files</h4>
                        </div>
                        {(userRole === "oxmanager" ||  userRole === "admin" || userRole === "teamleader") && (
                            <div className='my-3 d-flex justify-content-end'>
                                <Button variant="primary" className='p-2' onClick={handleShow}>
                                    <CloudUploadIcon /> Upload or Drag 'n' drop RPF File
                                </Button>
                                <Modal show={show} onHide={handleClose} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Upload Your RPF File (.csv format)</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <Form.Group controlId="formCampaign">
                                                <Form.Label>Select Campaign</Form.Label>
                                                <Form.Control as="select" onChange={handleCampaignChange}>
                                                    <option value="">Select Campaign</option>
                                                    {campaigns.map((campaign) => (
                                                        <option key={campaign._id} value={campaign._id}>
                                                            {campaign.campaignName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="formSuppressionType" className='mt-1'>
                                                <Form.Label>Select Suppression Type</Form.Label>
                                                <Form.Control as="select" onChange={handleSuppressionTypeChange} value={suppressionType}>
                                                    <option value="">Select Type</option>
                                                    <option value="Suppression">Suppression</option>
                                                    <option value="Tal">Tal</option>
                                                </Form.Control>
                                            </Form.Group>
                                            {/* Drag and Drop Area */}
                                            <div
                                                {...getRootProps()}
                                                className={`dropzone mt-2 p-3 border border-dashed rounded-3 ${isDragActive ? 'active' : ''}`}
                                                style={{ textAlign: 'center' }}
                                            >
                                                <input {...getInputProps()} />
                                                {isDragActive ? (
                                                    <BackupIcon style={{ fontSize: 50 }} />
                                                ) : (
                                                    <BackupIcon style={{ fontSize: 50 }} />
                                                )}
                                                <br />
                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                            </div>

                                            {/* Show the selected file name */}
                                            {file && (
                                                <div className="mt-2">
                                                    <strong>Selected File:</strong> {file.name}
                                                </div>
                                            )}

                                            {/* Fallback file input */}
                                            <Form.Group controlId="formFile" className="mt-2">
                                                <Form.Label>Or upload a file manually</Form.Label>
                                                <Form.Control type="file" onChange={handleFileChange} />
                                            </Form.Group>

                                            <div className='mt-2'>
                                                <Button variant="success" onClick={handleFileUpload} disabled={uploadStatus === 'loading'}>
                                                    <SendIcon /> Send
                                                </Button>
                                            </div>
                                        </Form>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        )}

                        {/* Pass the updated file data to SuppressionorTalFilestable component */}
                        <SuppressionorTalFilestable fileData={fileData} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default TalSuppressionFile;
