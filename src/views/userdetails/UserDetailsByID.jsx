import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import baseUrl from '../../constant/ConstantApi';

function UserDetailsByID() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    mobile: '',
    email: '',
    password: '',
    date_of_hiring: '',
    designation: '',
    supervisor: '',
    salary: '',
    shift: '',
    other_designation: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}user/viewuserbyid/${id}`);
        const userData = response.data.user;

        setFormData({
          fullname: userData.fullname || '',
          mobile: userData.mobile || '',
          email: userData.email || '',
          password: userData.password || '',  // Decrypted password
          date_of_hiring: userData.date_of_hiring ? userData.date_of_hiring.slice(0, 10) : '',
          designation: userData.designation || '',
          supervisor: userData.supervisor || '', // Fetch supervisor dynamically
          salary: userData.salary || '',
          shift: userData.shift || '',
          other_designation: userData.other_designation ? userData.other_designation.join(',') : '',
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const otherDesignations = formData.other_designation.split(',').filter(Boolean);

    if (checked) {
      setFormData({
        ...formData,
        other_designation: [...otherDesignations, value].join(','),
      });
    } else {
      setFormData({
        ...formData,
        other_designation: otherDesignations.filter(d => d !== value).join(','),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}user/updateuser/${id}`, formData);
      toast.success("User Update Successfully !")
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user !")
    }
  };

  return (
    <Container fluid className='my-5'>
      <Row>
        <Col lg={2}></Col>
        <Col lg={10}>
          <div className='bgColor rounded-3 shadow'>
            <h4 className='fw-bold py-3 ms-3 text_color'>User Details</h4>
          </div>
          <div className="row">
            <div className="col-xxl">
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <small className="text-muted float-end">Fields marked <span className="text-danger">*</span> are mandatory</small>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="fullname">Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullname"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="mobile">Phone No <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          className="form-control"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="658 799 8941"
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="email">Email <span className="text-danger">*</span></label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john.doe@domain.com"
                          required
                        />
                        <div className="form-text">You can use letters, numbers & periods</div>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="password">Password </label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="············"
                          disabled
                        />
                        <div className="form-text">Enter password if you want to update it or else leave it blank</div>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="date_of_hiring">Date of hiring <span className="text-danger">*</span></label>
                        <input
                          type="date"
                          className="form-control"
                          id="date_of_hiring"
                          name="date_of_hiring"
                          value={formData.date_of_hiring}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="designation">Designation <span className="text-danger">*</span></label>
                        <select
                          id="designation"
                          name="designation"
                          className="form-select"
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
                        </select>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="supervisor">Supervisor <span className="text-danger">*</span></label>
                        <select
                          id="supervisor"
                          name="supervisor"
                          className="form-select"
                          value={formData.supervisor}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--Select Supervisor--</option>
                          <option value="ankush surywanshi">Ankush Surywanshi </option>
                        </select>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="salary">Monthly Salary (in Rs.) <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          className="form-control"
                          id="salary"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          maxLength="7"
                          placeholder="45000"
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="shift">Primary Shift <span className="text-danger">*</span></label>
                        <select
                          id="shift"
                          name="shift"
                          className="form-select"
                          value={formData.shift}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--Select Primary Shift--</option>
                          <option value="1">APAC Shift-4 am to 1 pm</option>
                          <option value="2">APAC Shift-6 am to 3 pm</option>
                          <option value="3">Europe Shift-12 noon to 9 pm</option>
                          <option value="4">Europe Shift-1 pm to 10 pm</option>
                          <option value="5">Europe Shift-2 pm to 11 pm</option>
                          <option value="6">Europe Shift-3 pm to 12 am</option>
                          <option value="7">US Shift-6 pm to 3 am</option>
                          <option value="8">US Shift-9 pm to 6 am</option>
                        </select>
                      </div>
                      <div className="mb-3 col-md-12">
                        <label htmlFor="other_designation" className="form-label">Other Designation<span className="text-danger">*</span></label>
                        <div className="list-group">
                          {['1', '2', '3', '4', '5', '6','7','8','9','10'].map(value => (
                            <label key={value} className="list-group-item">
                              <input
                                className="form-check-input me-1 checkbox_designation"
                                type="checkbox"
                                name="other_designation"
                                value={value}
                                checked={formData.other_designation.split(',').includes(value)}
                                onChange={handleCheckboxChange}
                              />
                              {value === '1' && 'Supervisor'}
                              {value === '2' && 'Agent'}
                              {value === '3' && 'Quality'}
                              {value === '4' && 'Delivery'}
                              {value === '5' && 'Client'}
                              {value === '6' && 'Guest'}
                              {value === '7' && 'Developer'}
                              {value === '8' && 'HR'}
                              {value === '9' && 'Reasercher'}
                              {value === '10' && 'Email Marketing'}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDetailsByID;
