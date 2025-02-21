import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import InHouseCompletedCampTab from '../../../table/InHouseCompletedCampTab'

function InHouseCompletedCampaign() {
    return (
        <div>
          <Container fluid className='my-5 '>
            <Row className=''>
              <Col lg={3}>
              </Col>
              <Col lg={8}>
                <div className='bgColor rounded-3 shadow'>
                  <h4 className='fw-bold py-3 ms-3 text_color'>Completed Campaign List</h4>
                </div>
                {/* <InHouseExpiredCampaign/> */}
                <InHouseCompletedCampTab/>
              </Col>
            </Row>
          </Container>
        </div>
      )
}

export default InHouseCompletedCampaign
