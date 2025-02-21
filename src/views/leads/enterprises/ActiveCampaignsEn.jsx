import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import EnterpriseActiveCamp from '../../../table/EnterpriseActiveCamp'

function ActiveCampaignsEn() {
  return (
    <div>
    <Container fluid className='my-5 '>
      <Row className=''>
        <Col lg={2}>
        </Col>
        <Col lg={10}>
        <div className='bgColor rounded-3 shadow'>
          <h4 className='fw-bold py-3 ms-3 text_color'> Active Campaign List</h4>
        </div>
          <EnterpriseActiveCamp />
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default ActiveCampaignsEn
