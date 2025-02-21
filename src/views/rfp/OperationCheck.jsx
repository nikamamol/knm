import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Button, Modal, Form } from 'react-bootstrap';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import BackupIcon from '@mui/icons-material/Backup';
import RfpOperation from '../../table/RfpOperation';
import { fetchFiles, uploadOperationFile } from '../../redux/reducer/rpf/operationcsvupload';
import { fetchCampaigns } from '../../redux/reducer/createcampaign/GetCampaignData'; // Import fetchCampaigns action
import { useDropzone } from 'react-dropzone'; // Import react-dropzone

function OperationCheck() {
  const [show, setShow] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const uploadStatus = useSelector((state) => state.operationfileUpload);
  const { campaigns, status, error } = useSelector((state) => state.campaigns);
  const { files } = useSelector((state) => state.rfp); // Get uploaded files from Redux state

  // Fetch the user role from localStorage
  const userRole = localStorage.getItem('role'); // assuming 'userRole' is stored in localStorage

  useEffect(() => {
    dispatch(fetchCampaigns());
    dispatch(fetchFiles()); // Fetch existing files on component mount
  }, [dispatch]);

  const handleShow = () => {
    if (userRole !== 'oxmanager' && userRole !== 'admin') {
      alert('You do not have permission to upload files.');
      return;
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleCampaignChange = (e) => {
    setSelectedCampaign(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle drag-and-drop functionality
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]); // Set the first dropped file
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = () => {
    if (!selectedCampaign || !selectedFile) {
      alert('Please select a campaign and a file.');
      return;
    }

    const formData = new FormData();
    const selectedCampaignData = campaigns.find(c => c._id === selectedCampaign);

    formData.append('campaignName', selectedCampaignData?.campaignName || '');
    formData.append('campaignCode', selectedCampaignData?.campaignCode || '');
    formData.append('clientSelect', selectedCampaignData?.clientSelect || '');

    formData.append('file', selectedFile);

    dispatch(uploadOperationFile(formData))
      .unwrap()
      .then(() => {
        alert('File uploaded successfully!');
        dispatch(fetchFiles()); // Fetch files after upload to update the state
        handleClose();
      })
      .catch(() => {
        alert('File upload failed. Please try again.');
      });
  };

  return (
    <div>
      <Container fluid className="my-5">
        <Row>
          <Col lg={3}></Col>
          <Col lg={8}>
            <div className="bgColor rounded-3 shadow">
              <h4 className="fw-bold py-3 ms-3 text_color">Delivery Final Check RFP List</h4>
            </div>
            <div className="my-3 d-flex justify-content-end">
              <Button variant="primary" className="p-2" onClick={handleShow}>
                <CloudUploadIcon /> Upload & Drag 'n' drop RFP File
              </Button>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Upload Your RFP File (.csv format)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formCampaign">
                      <Form.Label>Select Campaign</Form.Label>
                      <Form.Control as="select" onChange={handleCampaignChange} value={selectedCampaign}>
                        <option value="">Select Campaign</option>
                        {status === 'loading' && <option>Loading campaigns...</option>}
                        {status === 'failed' && <option>Error loading campaigns</option>}
                        {status === 'succeeded' && campaigns.length > 0 ? (
                          campaigns.map((campaign) => (
                            <option key={campaign._id} value={campaign._id}>
                              {campaign.campaignName}
                            </option>
                          ))
                        ) : (
                          status === 'succeeded' && <option>No campaigns found</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Label>Select Client</Form.Label>
                    <Form.Control as="select" onChange={handleCampaignChange} >
                      <option value="">Select Client</option>
                      {status === 'loading' && <option>Loading campaigns...</option>}
                      {status === 'failed' && <option>Error loading campaigns</option>}
                      {status === 'succeeded' && campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                          <option key={campaign._id} value={campaign._id}>
                            {campaign.clientSelect}
                          </option>
                        ))
                      ) : (
                        status === 'succeeded' && <option>No campaigns found</option>
                      )}
                    </Form.Control>


                    <div
                      {...getRootProps()}
                      className={`dropzone mt-3 p-3 border border-dashed rounded-3 bg-primary text-white ${isDragActive ? 'active' : ''}`}
                      style={{ textAlign: 'center' }}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <>
                          <BackupIcon style={{ fontSize: 50 }} />
                          <br />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </>
                      ) : (
                        <>
                          <BackupIcon style={{ fontSize: 50 }} />
                          <br />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </>
                      )}
                    </div>

                    {selectedFile && (
                      <div className="mt-3">
                        <strong>Selected File:</strong> {selectedFile.name}
                      </div>
                    )}

                    <Form.Group controlId="formFile" className="mt-3">
                      <Form.Label>Or upload a file manually</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>

                    <div className="mt-3">
                      <Button variant="success" onClick={handleFileUpload} >
                        <SendIcon /> Upload
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>

            <RfpOperation files={files} /> {/* Pass the fetched files to RfpOperation */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OperationCheck;
