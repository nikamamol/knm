import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import EnterpriseMyEnterprise from '../../table/EnterpriseMyEnterprise'

function MyEnterprise() {
  return (
    <div>
    <Container fluid className='my-5 '>
      <Row className=''>
        <Col lg={2}>
        </Col>
        <Col lg={10}>
        <div className='bgColor rounded-3 shadow'>
          <h4 className='fw-bold py-3 ms-3 text_color'>Enterprise</h4>
        </div>
          <EnterpriseMyEnterprise />
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default MyEnterprise
