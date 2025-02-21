import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

function CreateInvoice() {
  return (
    <div>
      
      <Container fluid className='my-5 '>
        <Row>
          <Col lg={3}>
          </Col>
          <Col lg={8}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>Invoice Setting</h4>
            </div>
            <div className="row">
              <div className="col">
                <div className="card mb-4">
                  <div className="card-header d-flex align-items-center justify-content-between p-3">
                    <small className="text-muted float-end">Fields marked <span className="text-danger">*</span> are mandatory</small>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label for="fullname">Company Logo <span className="text-danger">*</span></label>
                        <input type="hidden" id="has_image" value="0" />
                        <input type="file" id="logo" className="form-control" />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label for="basic-icon-default-phone">Payment Term(in days) <span className="text-danger">*</span></label>
                        <input type="number" maxlength="3" name="payment_term" id="payment_term" value="" className="form-control" placeholder="60" />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label for="basic-icon-default-email">Invoice Format <span className="text-danger">*</span></label>
                        <input type="text" required="" name="invoice_format" id="invoice_format" className="form-control" placeholder="INV001" value="{number}" />
                        <div className="form-text text-muted">Do not remove number Add prefix or/and suffix </div>
                      </div>
                      <div className="row ">
                        <div className="text-center">
                          <button type="button" className="btn btn-danger me-2">Save</button>
                          <button type="button" id="reset" className="btn btn-outline-secondary">Clear</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CreateInvoice
