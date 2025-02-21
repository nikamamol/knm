import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import IpAddress from '../../table/IpAddress'

function IpWhiteList_BlockList() {
  return (
    <div>
    <Container fluid className='my-5'>
      <Row>
        <Col lg={3}></Col>
        <Col lg={8}>
          <div className='bgColor rounded-3 shadow'>
            <h4 className='fw-bold py-3 ms-3 text_color'>IP Whitelisting</h4>
          </div>
          <div className="row">
            <div className="col-xxl">
              <div className="card mb-4">
                <div className="card-header p-3 d-flex align-items-center justify-content-between">
                  <small className="text-muted float-end">Fields marked <span className='text-danger'>*</span> are mandatory</small>
                </div>
                <div className="card-body">
                  <form action="#" method="POST" encType="multipart/form-data">
                    <div className="card border-0 mb-4">
                      <div className="card-body">
                        <div className="row"> 
                          <div className="mb-3 col-md-3">
                            <label htmlFor="ip" className="form-label">IP <span className='text-danger'>*</span><span className="text-danger"></span></label>
                            <input type="text" name="ip" className="form-control" id="ip" value="" placeholder="192.168.0.1" />
                          </div>
                       
                          <div className="mb-3 col-md-3">
                            <label htmlFor="status" className="form-label">Status <span className='text-danger'>*</span><span className="text-danger"></span></label>
                            <select id="status" className="form-select">
                              <option value="Allow">Allow</option>
                              <option value="Block">Block</option>
                              
                            </select>
                          </div>
                          <div className="mb-3 col-md-3" style={{ marginTop: '32px' }}>
                            <input type="button" className="btn btn-danger" value="Save" />
                          </div>
                          <IpAddress />
                        </div>
                      </div>
                    </div>
                  </form>
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

export default IpWhiteList_BlockList
