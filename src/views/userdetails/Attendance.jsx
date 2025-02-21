import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AttendanceTable from '../../table/AttendanceTable';
import Unauthorised from "../../assets/401Unauthorised.png"



function Attendance() {
  const userRole = localStorage.getItem("role");
  return (
    <div>
      <Container fluid className="mt-5">
        <Row>
          <Col lg={2}></Col>
          <Col lg={10}>
            <div className="row">
              {/* Basic Layout */}

              <div className="col-xxl">
                <div className='bgColor rounded-3 shadow'>
                  <h4 className='fw-bold py-3 ms-3 text_color'>Attendance Table</h4>
                </div>
                {/* <div className="card shadow border-0 mb-4">
                  <div className="card-body">
                    <form
                      action="#"
                      method="post"
                      encType="multipart/form-data"
                    >
                      <input type="hidden" name="_token"  />
                      <input type="hidden" name="vendor_id"  />

                      <div className="row">
                        <div className="mb-3 col-md-4">
                          <label className="col-sm-4 col-form-label" htmlFor="from_date">From Date</label>
                          <div className="col-sm-10">
                            <input type="date" className="form-control" id="from_date" name="from_date" required />
                          </div>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="col-sm-4 col-form-label" htmlFor="to_date">To Date</label>
                          <div className="col-sm-10">
                            <input type="date" className="form-control" id="to_date" name="to_date" required />
                          </div>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="col-sm-2 col-form-label" htmlFor="user_id">User</label>
                          <div className="col-sm-10">
                            <select id="user_id" name="user_id" className="form-select" required>
                              <option value="">--Select User--</option>
                              <option value="114" selected>Demo User1</option>
                              <option value="115" >Demo User2</option>
                              <option value="116" >Demo User3</option>
                             
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row ">
                        <div className="text-center">
                          <button type="submit" className="btn btn-danger">Search</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div> */}
                {userRole === 'admin' || userRole === "oxmanager" || userRole === "hr" ? <AttendanceTable /> : <>
                  <div className='text-center mt-2 '>
                    <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                    <p className='text-danger'>You do not have permission to view this content.</p>
                  </div></>
                }
                {/* <AttendanceTable/> */}
              </div>
            </div>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default Attendance;
