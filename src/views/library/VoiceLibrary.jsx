import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import VoiceLog from '../../table/VoiceLog';

function VoiceLibrary() {
  return (
    <div>
      <Container fluid className='my-5'>
        <Row>
          <Col lg={2}></Col>
          <Col lg={10}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>View Client</h4>
            </div>
            <div className="row">
              <div className="col-xxl">
                <div className="card mb-4">
                  <div className="card-header p-3 d-flex align-items-center justify-content-between">
                    <small className="text-muted float-end">Search voice log by lead name and/or campaign name</small>
                  </div>
                  <div className="card-body">
                    <form action="#" method="POST" encType="multipart/form-data">
                      <input type="hidden" id="id" name="id" value="0" />
                      <input type="hidden" id="user_id" name="user_id" value="" />
                      <input type="hidden" id="vendor_id" name="vendor_id" value="" />
                      <input type="hidden" name="_token" value="" />
                      <div className="card mb-4">
                        <div className="card-body">
                          <div className="row">
                            <div className="mb-3 col-md-3">
                              <label htmlFor="lead_name" className="form-label">Lead Name<span className="text-danger"></span></label>
                              <input type="text" name="lead_name" className="form-control" id="lead_name" value="" placeholder="Savio" />
                            </div>
                            <div className="mb-3 col-md-3">
                              <label htmlFor="campaign_name" className="form-label">Campaign Name<span className="text-danger"></span></label>
                              <input type="text" name="campaign_name" className="form-control" id="campaign_name" value="" placeholder="AWS" />
                            </div>
                            <div className="mb-3 col-md-3">
                              <label htmlFor="status" className="form-label">Status<span className="text-danger"></span></label>
                              <select id="status" className="form-select">
                                <option value="All">All</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Submited To Client">Submited To Client</option>
                              </select>
                            </div>
                            <div className="mb-3 col-md-3" style={{ marginTop: '32px' }}>
                              <input type="button" className="btn btn-danger" value="Search" />
                            </div>
                            <VoiceLog />


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
  );
}

export default VoiceLibrary;
