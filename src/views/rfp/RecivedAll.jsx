import React, { useState } from 'react';
import { Col, Container, Row, Button, Modal, Form } from 'react-bootstrap';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import RfpReceived from '../../table/RfpReceived';
import RfpReceivedAll from '../../table/RpfRecivedAll';
import baseUrl from '../../constant/ConstantApi';

function RecivedAll() {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${baseUrl}user/uplaodcsv`, formData, {
      });

      if (response.data.message) {
        alert(response.data.message);
      }
      setShow(false);
    } catch (error) {
      console.error('There was an error uploading the file!', error);
      alert('Failed to upload the file.');
    }
  };

  return (
    <div>
      <Container fluid className='my-5'>
        <Row>
          <Col lg={3}></Col>
          <Col lg={8}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>RFP All List</h4>
            </div>
            {/* <div className='my-3 d-flex justify-content-end'>
              <Button variant="primary" className='p-2' onClick={handleShow}>
                <CloudUploadIcon /> Upload RPF File
              </Button>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Upload Your RPF File (.csv format)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formFile">
                      <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                    <div className='mt-3'>
                      <Button variant="success" onClick={handleFileUpload}>
                        <SendIcon /> Send
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </div> */}
            <RfpReceivedAll />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RecivedAll;
