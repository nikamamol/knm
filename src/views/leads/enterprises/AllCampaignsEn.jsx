import React from 'react'
import EnterpriseAllCampaign from '../../../table/EnterpriseAllCapaign'
import { Col, Container, Row } from 'react-bootstrap'

function AllCampaignsEn() {
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
            <EnterpriseAllCampaign />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AllCampaignsEn
