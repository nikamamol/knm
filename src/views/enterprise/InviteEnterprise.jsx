import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
// import EnterpriseInviteEnt from '../../table/EnterpriseInviteEnt'

function InviteEnterprise() {
  return (
    <div>
      <Container fluid className='my-5 '>
        <Row className=''>
          <Col lg={3}>
          </Col>
          <Col lg={8}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>Invite Enterprise</h4>
            </div>
            {/* <EnterpriseInviteEnt/> */}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default InviteEnterprise
