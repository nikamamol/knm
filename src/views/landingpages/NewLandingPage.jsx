import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Unauthorised from "../../assets/401Unauthorised.png"




function NewLandingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const navigate = useNavigate();

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleNextClick = () => {
    if (selectedTemplate) {
      navigate(`/template-${selectedTemplate}`);
    }
  };
  const userRole = localStorage.getItem('role');


  return (
    <div>
      <Container fluid className="my-5">
        <Row>
          <Col lg={2}></Col>
          <Col lg={10}>
            <div className="bgColor rounded-3 shadow">
              <h4 className="fw-bold py-3 ms-3 text_color">Create Landing Page</h4>
            </div>
            {userRole === 'admin' || userRole === "email_marketing" || userRole === "admin" || userRole === "oxmanager" ?
              <div className="card mb-4">
                <div className="card-body">
                  <form id="formAccountSettings" method="POST">
                    <div className="mb-3">
                      <label htmlFor="template" className="form-label">
                        Template<span className="text-danger">*</span>
                      </label>
                      <div className="d-flex">
                        <select
                          id="template"
                          required
                          name="Category_id"
                          className="form-select"
                          value={selectedTemplate}
                          onChange={handleTemplateChange}
                        >
                          <option value="">--Select Template--</option>
                          <option value="1">Template - 1</option>
                          {/* <option value="2">Template - 2</option>
                      <option value="3">Template - 3</option> */}
                        </select>
                      </div>
                    </div>
                    <div className="row d-flex gap-2">
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleNextClick}
                        >
                          Next
                        </button>
                        {/* {selectedTemplate && (
                      <a
                        href="../assets/MacBookPro161.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-3 btn btn-outline-primary"
                        id="view_sample"
                      >
                        View Demo
                      </a>
                    )} */}
                      </div>
                    </div>
                  </form>
                </div>
              </div> : 
                <div className='text-center mt-2 '>
                    <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                    <p className='text-danger'>You do not have permission to view this content.</p>
                </div>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NewLandingPage;
