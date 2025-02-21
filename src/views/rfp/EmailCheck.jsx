import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import RfpEmailCheck from '../../table/RfpEmailCheck'

function EmailCheck() {
  return (
    <div>
    <Container fluid className='my-5 '>
      <Row className=''>
        <Col lg={2}>
        </Col>
        <Col lg={10}>
          <div className='bgColor rounded-3 shadow'>
            <h4 className='fw-bold py-3 ms-3 text_color'>PreQA Done Files</h4>
          </div>
          <RfpEmailCheck />
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default EmailCheck
