import React from 'react'
import RfpExpired from '../../table/RfpExpired'
import { Col, Container, Row } from 'react-bootstrap'

function Expired() {
  return (
    <div>
    <Container fluid className='my-5 '>
      <Row className=''>
        <Col lg={2}>
        </Col>
        <Col lg={10}>
          <div className='bgColor rounded-3 shadow'>
            <h4 className='fw-bold py-3 ms-3 text_color'>Expired RFP List</h4>
          </div>
          <RfpExpired />
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default Expired
