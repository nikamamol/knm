import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import InHouseClosedCamp from '../../../table/InHouseClosedCamp'

function ClosedCampaignsIn() {
  return (
    <div>
    <Container fluid className='my-5 '>
      <Row className=''>
        <Col lg={3}>
        </Col>
        <Col lg={8}>
          <div className='bgColor rounded-3 shadow'>
            <h4 className='fw-bold py-3 ms-3 text_color'>Closed Campaign List</h4>
          </div>
          <InHouseClosedCamp />
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default ClosedCampaignsIn
