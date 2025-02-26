import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row, Button, Modal, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import BackupIcon from '@mui/icons-material/Backup';
import { useDispatch, useSelector } from 'react-redux';
import RfpReceived from '../../table/RfpReceived';
import { fetchCampaigns } from '../../redux/reducer/createcampaign/GetCampaignData';
import { uploadFile } from '../../redux/reducer/rpf/uploadcsvbyemploy';
import { fetchFileData } from '../../redux/reducer/rpf/getcsvfiledata';  // Import fetchFileData action
import { uploadRatLFile } from '../../redux/reducer/rpf/uploadratl';
import Preqatl from '../../table/Preqatl';

function Preqatlview() {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedCampaignCode, setSelectedCampaignCode] = useState('');

  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns.campaigns);
  const uploadStatus = useSelector((state) => state.fileUpload.status);
  const uploadMessage = useSelector((state) => state.fileUpload.message);
  const fileData = useSelector((state) => state.fileData.files);  // Fetch file data from Redux store

  // Fetch campaigns and file data on component mount
  useEffect(() => {
    dispatch(fetchCampaigns());
    dispatch(fetchFileData());  // Fetch the file data when component mounts
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

  const userRole = localStorage.getItem('role');

  const handleFileUpload = async () => {
    if (!file || !selectedCampaign || !selectedCampaignCode) {
      alert('Please select a file and a campaign!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaignName', selectedCampaign);
    formData.append('campaignCode', selectedCampaignCode);

    try {
      await dispatch(uploadRatLFile(formData)).unwrap();
      alert(uploadMessage || 'File uploaded successfully!');
      dispatch(fetchFileData());  // Fetch the updated file data after upload
      setShow(false);
    } catch (error) {
      console.error('There was an error uploading the file!', error);
      alert('Failed to upload the file.');
    }
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);  // Set the first dropped file
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <Container fluid className='my-5'>
        <Row>
          <Col lg={3}></Col>
          <Col lg={8}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-5 text_color'>PreQA TL Files</h4>
            </div>
            {(userRole === "user" || userRole === "reasercher" || userRole === "admin") && (
              <div className='my-3 d-flex justify-content-end'>
                <Button variant="primary" className='p-2' onClick={handleShow}>
                  <CloudUploadIcon /> Upload  or Drag 'n' drop RPF File
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Upload Your RPF File (.csv format)</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="formFile">
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

                      {/* Drag and Drop Area */}
                      <div
                        {...getRootProps()}
                        className={`dropzone mt-3 p-3 border border-dashed rounded-3 ${isDragActive ? 'active' : ''}`}
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

                      {/* Show the selected file name */}
                      {file && (
                        <div className="mt-3">
                          <strong>Selected File:</strong> {file.name}
                        </div>
                      )}

                      {/* Fallback file input */}
                      <Form.Group controlId="formFile" className="mt-3">
                        <Form.Label>Or upload a file manually</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                      </Form.Group>

                      <div className='mt-3'>
                        <Button variant="success" onClick={handleFileUpload} disabled={uploadStatus === 'loading'}>
                          <SendIcon /> Send
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
            )}

            {/* Pass the updated file data to RfpReceived component */}
            <Preqatl fileData={fileData} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Preqatlview;
