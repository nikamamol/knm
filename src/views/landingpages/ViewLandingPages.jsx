import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { fetchTemplates } from '../../redux/reducer/createteplate/GetTemplate';
import Unauthorised from "../../assets/401Unauthorised.png"


function ViewLandingPages() {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.templates?.templates || []);
  const templateStatus = useSelector((state) => state.templates?.status || 'idle');
  const error = useSelector((state) => state.templates?.error || null);

  useEffect(() => {
    if (templateStatus === 'idle') {
      dispatch(fetchTemplates());
    }
  }, [templateStatus, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // Formats date as "24 Jun 2024"
  };

  const userRole = localStorage.getItem('role');

  return (
    <div>
      <Container fluid className="my-5">
        <Row>
          <Col lg={2}>
            {/* Add content here if needed */}
          </Col>
          <Col lg={10}>
            <div className="bgColor rounded-3 shadow">
              <h4 className="fw-bold py-3 ms-3 text_color">View All Landing Pages</h4>
            </div>
            {userRole === 'admin' || userRole === "oxmanager" || userRole === "email_marketing" ? (
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card border-0 rounded-4 shadow">
                  <div className="table-responsive text-nowrap">
                    {templateStatus === 'loading' && <p>Loading...</p>}
                    {templateStatus === 'failed' && <p>Error: {error}</p>}
                    {templateStatus === 'succeeded' && (
                      <table className="table table-hover" id="myTable">
                        <thead>
                          <tr className="p-4">
                            <th>Sr No</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                          {templates.map((template, index) => (
                            <tr key={template._id}>
                              <td>
                                <i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>{index + 1}</strong>
                              </td>
                              <td>
                                <p>{template.template_title}</p>
                              </td>
                              <td>{formatDate(template.date)}</td>
                              <td>
                                <a className="dropdown-item delete" href={`/viewpage/${template._id}`}>
                                  <RemoveRedEyeIcon />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
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
  );
}

export default ViewLandingPages;
