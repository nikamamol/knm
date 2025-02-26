import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Button, Modal, Form } from 'react-bootstrap';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import BackupIcon from '@mui/icons-material/Backup';
import { useDropzone } from 'react-dropzone';
import { fetchCampaigns } from '../../redux/reducer/createcampaign/GetCampaignData';
import { uploadEMMaster } from '../../redux/reducer/rpf/uploadEmailmasterfile'; // Adjust the import path as needed
import EMasterTab from '../../table/EMasterTab';
import { fetchCsvFilesbyEMMaster } from '../../redux/reducer/rpf/getEmMasterFileData';

function EMMasterFile() {
  const [show, setShow] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  // Fetch data from Redux store
  const { campaigns, status } = useSelector((state) => state.campaigns);
  const { loading, error } = useSelector((state) => state.emmasterFileUpload || {});
  const { csvFiles, loading: csvLoading, error: csvError } = useSelector((state) => state.csvFileCheckedbyEMMaster);

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCampaigns());
    }
  }, [dispatch, status]);

  // Fetch CSV files on component load
  useEffect(() => {
    dispatch(fetchCsvFilesbyEMMaster());
  }, [dispatch]);

  const handleShow = () => {
    if (userRole !== 'oxmanager' && userRole !== 'admin' && userRole !== 'email_marketing') {
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

  // Drag and drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = () => {
    if (!selectedCampaign || !selectedFile) {
      alert('Please select a campaign and a file.');
      return;
    }

    const formData = new FormData();
    const selectedCampaignData = campaigns.find((c) => c._id === selectedCampaign);

    formData.append('campaignName', selectedCampaignData?.campaignName || '');
    formData.append('campaignCode', selectedCampaignData?.campaignCode || '');
    formData.append('file', selectedFile);

    dispatch(uploadEMMaster(formData))
      .unwrap()
      .then(() => {
        alert('File uploaded successfully!');
        handleClose();
        // Fetch the updated file list after successful upload
        dispatch(fetchCsvFilesbyEMMaster());
      })
      .catch((err) => {
        alert(`File upload failed: ${err}`);
      });
  };

  return (
    <div>
      <Container fluid className="my-5">
        <Row>
          <Col lg={3}></Col>
          <Col lg={8}>
            <div className="bgColor rounded-3 shadow">
              <h4 className="fw-bold py-3 ms-3 text_color">Email Master Files</h4>
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
                        {status === 'succeeded' &&
                          campaigns.length > 0 ? campaigns.map((campaign) => (
                            <option key={campaign._id} value={campaign._id}>
                              {campaign.campaignName}
                            </option>
                          )) : (
                            status === 'succeeded' && <option>No campaigns found</option>
                          )}
                      </Form.Control>
                    </Form.Group>

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
                      <Button variant="success" onClick={handleFileUpload} disabled={loading}>
                        <SendIcon /> {loading ? 'Uploading...' : 'Send'}
                      </Button>
                    </div>
                  </Form>
                  {error && <div className="text-danger mt-3">Error: {error}</div>}
                </Modal.Body>
              </Modal>
            </div>
            <EMasterTab files={csvFiles} loading={csvLoading} error={csvError} /> {/* Pass the fetched files to EMasterTab */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EMMasterFile;
