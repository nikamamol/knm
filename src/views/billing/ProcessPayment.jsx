import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

function ProcessPayment() {
  return (
    <div>

      <Container fluid className='my-5 '>
        <Row>
          <Col lg={2}>
          </Col>
          <Col lg={10}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>Pricing Plan</h4>
            </div>
            <div className="card-group gap-2 mt-3 ">
              <div className="card border-0 rounded-2 shadow mt-5 bg-light">
                {/* <img src="..." className="card-img-top" alt="..."> */}
                <div className="card-body">
                  <h4 className="card-title bg-warning rounded-5 p-2 text-center text-white">Free</h4>
                  <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                </div>

              </div>
              <div className="card border-0 rounded-5 shadow">
                {/* <img src="..." className="card-img-top" alt="..."> */}
                <div className="card-body">
                  <h5 className="card-title bg-primary rounded-5 p-2 text-center text-white">Pro</h5>
                  <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                </div>

              </div>
              <div className="card border-0 rounded-2 shadow mt-5 bg-light ">
                {/* <img src="..." className="card-img-top" alt="..."> */}
                <div className="card-body">
                  <h5 className="card-title bg-danger rounded-5 p-2 text-center text-white">Enterprise</h5>
                  <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                </div>

              </div>
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ProcessPayment
