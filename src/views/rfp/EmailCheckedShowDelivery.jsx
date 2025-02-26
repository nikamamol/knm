import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import EmailCheckedShowDeliveryTab from '../../table/EmailCheckedShowDeliveryTab'

function EmailCheckedShowDelivery() {
    return (
        <div>
            <Container fluid className='my-5 '>
                <Row className=''>
                    <Col lg={3}>
                    </Col>
                    <Col lg={8}>
                        <div className='bgColor rounded-3 shadow'>
                            <h4 className='fw-bold py-3 ms-3 text_color'>Email Marketing Done RPF Files</h4>
                        </div>
                        <EmailCheckedShowDeliveryTab/>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default EmailCheckedShowDelivery
