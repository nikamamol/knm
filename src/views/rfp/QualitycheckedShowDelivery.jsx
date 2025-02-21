import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import QualitycheckedShowDeliveryTab from '../../table/QualitycheckedShowDeliveryTab'

function QualitycheckedShowDelivery() {
  return (
    <div>
    <Container fluid className='my-5'>
        <Row>
            <Col lg={2}></Col>
            <Col lg={10}>
                <div className='bgColor rounded-3 shadow  mb-3'>
                    <h4 className='fw-bold py-3 ms-3 text_color'>Quality Checked Done Files</h4>
                </div>

                <QualitycheckedShowDeliveryTab/>
            </Col>
        </Row>
    </Container>
</div>
  )
}

export default QualitycheckedShowDelivery
