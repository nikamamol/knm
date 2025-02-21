import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import InHouseAllCamp from '../../../table/InHouseAllCamp'

function AllCampaignsIn() {
  return (
    <div>
     <Container fluid className='my-5 '>
        <Row className=''>
          <Col lg={3}>
          </Col>
          <Col lg={8}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'> All Campaign List</h4>
            </div>
            <InHouseAllCamp />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AllCampaignsIn
