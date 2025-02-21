import React from 'react'
import VieweUserTable from '../../table/VieweUserTable'
import { Col, Container, Row } from 'react-bootstrap'
import Unauthorised from "../../assets/401Unauthorised.png"



function VieweUser() {

  const userType = localStorage.getItem('role')
  return (
    <div>
      <Container fluid className='my-5 '>
        <Row className=''>
          <Col lg={3}>
          </Col>
          <Col lg={8}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>User List</h4>
            </div>
            {userType === 'admin' || userType === "oxmanager" ? <VieweUserTable /> : <>

              <div className='text-center mt-2 '>
                <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                <p className='text-danger'>You do not have permission to view this content.</p>
              </div>
            </>}

          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default VieweUser
