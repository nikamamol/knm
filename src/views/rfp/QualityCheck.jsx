import React, { useState } from 'react';
import RfpReceivedAll from '../../table/RpfRecivedAll';
import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send'; // Import SendIcon
import RfpQualityCheck from '../../table/RfpQualityCheck';

function QualityCheck() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <Container fluid className='my-5'>
                <Row>
                    <Col lg={3}></Col>
                    <Col lg={8}>
                        <div className='bgColor rounded-3 shadow  mb-3'>
                            <h4 className='fw-bold py-3 ms-3 text_color'>PreQA Done Files</h4>
                        </div>

                        <RfpQualityCheck />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default QualityCheck;
