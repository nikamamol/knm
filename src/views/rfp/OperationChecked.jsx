import React, { useState } from 'react';
import { Col, Container, Row, Button, Modal, Form } from 'react-bootstrap';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import RfpReceived from '../../table/RfpReceived';
import RfpReceivedAll from '../../table/RpfRecivedAll';
import RfpOperationAll from '../../table/RfpOperationAll';

function OperationChecked() {
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


  };

  return (
    <div>
      <Container fluid className='my-5'>
        <Row>
          <Col lg={2}></Col>
          <Col lg={10}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>Delivery Checked All Files</h4>
            </div>

            <RfpOperationAll />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OperationChecked;
