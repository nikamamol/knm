import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import BillingViewInvoice from '../../table/BillingViewInvoice'
import Unauthorised from "../../assets/401Unauthorised.png"


function ViewInvoice() {
  const userRole = localStorage.getItem('role');

  return (
    <div>
      
       <Container fluid className='my-5 '>
        <Row>
          <Col lg={3}>
          </Col>
          <Col lg={8}>
          <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>Invoice List</h4>
            </div>
            {(userRole === 'admin' || userRole === 'oxmanager') ? (
              <BillingViewInvoice />
            ) : (
              
              <div className='text-center mt-2 '>
              <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
              <p className='text-danger'>You do not have permission to view this content.</p>
          </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ViewInvoice
