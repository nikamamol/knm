import React, { useState } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../../constant/ConstantApi';

function AddUser() {
  const initialFormData = {
    fullname: '',
    mobile: '',
    email: '',
    password: '',
    date_of_hiring: '',
    designation: '',
    supervisor: '',
    salary: '',
    shift: '',
    other_designation: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const userType = localStorage.getItem('role');
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => {
        const newDesignations = checked
          ? [...prevData.other_designation, value]
          : prevData.other_designation.filter((d) => d !== value);
        return { ...prevData, other_designation: newDesignations };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}user/addnewuser`, formData);
      console.log('User added successfully:', response.data);
      toast.success('User added successfully!');
      resetForm(); // Reset the form data after successful submission
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user!');
    }
  };

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col lg={3}></Col>
        <Col lg={8}>
          <div className="row">
            <div className="col-xxl">
              <div className='bgColor rounded-3 shadow'>
                <h4 className='fw-bold py-3 ms-3 text_color'>Add New User</h4>
              </div>
              <div className="card border-0 shadow mb-4">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <small className="text-muted float-end p-2">
                    Fields marked <span className="text-danger">*</span> are mandatory
                  </small>
                </div>
                <div className="card-body">
                  <Form onSubmit={handleSubmit}>
                    <input type="hidden" name="_token" value="#" />
                    <input type="hidden" name="vendor_id" id="vendor_id" value="#" />
                    <input type="hidden" name="self_user" id="self_user" value="Yes" />
                    <div className="row">
                      <Form.Group className="mb-3 col-md-6" controlId="fullname">
                        <Form.Label>
                          Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullname"
                          placeholder="John Doe"
                          value={formData.fullname}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="mobile">
                        <Form.Label>
                          Phone No <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="mobile"
                          placeholder="658 799 8941"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                          maxLength="12"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="email">
                        <Form.Label>
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="example@gmail.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="password">
                        <Form.Label>
                          Password <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="············"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="date_of_hiring">
                        <Form.Label>
                          Date of hiring <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_hiring"
                          value={formData.date_of_hiring}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="designation">
                        <Form.Label>
                          Primary Designation <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          required
                        >
                        
                          <option value="">--Select Designation--</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="oxmanager">OX Manager</option>
                          <option value="developer">Web Developer</option>
                          <option value="hr">HR Executive </option>
                          <option value="reasercher">Reaserch Analyst</option>
                          <option value="agent">Agent</option>
                          <option value="client">Client</option>
                          <option value="quality">Quality</option>
                          <option value="email_marketing">Email Marketing</option>
                          <option value="delivery">Delivery</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="supervisor">
                        <Form.Label>
                          Supervisor <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="supervisor"
                          value={formData.supervisor}
                          onChange={handleChange}
                          required
                        >
                          <option>--Select Supervisor--</option>
                          <option value="Ankush Surywanshi">Ankush Surywanshi</option>
                         
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="salary">
                        <Form.Label>
                          Monthly Salary (in Rs.) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="salary"
                          placeholder="45000"
                          value={formData.salary}
                          onChange={handleChange}
                          required
                          maxLength="7"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-6" controlId="shift">
                        <Form.Label>
                          Primary Shift <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="shift"
                          value={formData.shift}
                          onChange={handleChange}
                          required
                        >
                          <option>--Select Primary Shift--</option>
                          <option value="1">APAC Shift-4 am to 1 pm</option>
                          <option value="2">APAC Shift-6 am to 3 pm</option>
                          <option value="3">Europe Shift-12 noon to 9 pm</option>
                          <option value="4">Europe Shift-1 pm to 10 pm</option>
                          <option value="5">Europe Shift-2 pm to 11 pm</option>
                          <option value="6">Europe Shift-3 pm to 12 am</option>
                          <option value="7">US Shift-6 pm to 3 am</option>
                          <option value="8">US Shift-9 pm to 6 am</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3 col-md-12" controlId="other_designation">
                        <Form.Label>
                          Other Designation <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="list-group">
                          {['1', '2', '3', '4', '5', '6','7','8','9','10'].map((value) => (
                            <Form.Check
                              key={value}
                              type="checkbox"
                              id={`other_designation_${value}`}
                              name="other_designation"
                              value={value}
                              label={
                                {
                                  1: 'Supervisor',
                                  2: 'Agent',
                                  3: 'Quality',
                                  4: 'Delivery',
                                  5: 'Client',
                                  6: 'Guest',
                                  7: 'Developer',
                                  8: 'HR',
                                  9: 'Reasercher',
                                  10: 'Email Marketing',
                                }[value]
                              }
                           
                              checked={formData.other_designation.includes(value)}
                              onChange={handleChange}
                              className="list-group-item"
                            />
                          ))}
                        </div>
                      </Form.Group>
                      <div className="row gap-2 text-center">
                        <div className="col-12">
                          <button type="submit" className="btn btn-danger me-2" disabled={userType !== "admin" && userType !== "oxmanager"}>
                            Save
                          </button>
                          <button type="button" className="btn btn-outline-secondary" disabled={userType !== "admin" && userType !== "oxmanager"} onClick={resetForm}>
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AddUser;
