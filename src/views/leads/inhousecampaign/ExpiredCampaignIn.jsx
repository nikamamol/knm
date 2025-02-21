import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import InHouseExpiredCampaign from '../../../table/InHouseExpiredCampaign'

function ExpiredCampaignIn() {
    return (
        <div>
          <Container fluid className='my-5 '>
            <Row className=''>
              <Col lg={2}>
              </Col>
              <Col lg={10}>
                <div className='bgColor rounded-3 shadow'>
                  <h4 className='fw-bold py-3 ms-3 text_color'>Expired Campaign List</h4>
                </div>
                <InHouseExpiredCampaign/>
              </Col>
            </Row>
          </Container>
        </div>
      )
}

export default ExpiredCampaignIn
