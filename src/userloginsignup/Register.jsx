import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/reducer/registeruser/Register';
import Hourglass from "../assets/Hourglass.gif";


import LogoImge1 from "../assets/koinetlogo.png";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo, status, error } = useSelector((state) => state.userRegister);// Ensure 'state.user' points to the correct part of the state

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const submitForm = (event) => {
        event.preventDefault();
        dispatch(registerUser(formData)).unwrap()
            .then(() => {
                navigate('/'); // Redirect on successful registration
            })
            .catch((err) => {
                console.error("Error during signup:", err);
            });
    };

    return (
        <Container fluid className='bgGradinet'>
            <Row>
                <Col lg={12} className="d-flex justify-content-center align-items-center vh-100">
                    <Col lg={6}>
                        <Card className="border-0 shadow p-2" style={{ backgroundColor: '#F8F4E1' }}>
                            <div className='text-center'>
                                <img src={LogoImge1} alt="" width={200} height={100} />
                                <p>Koinet Media Ites Pvt Ltd.</p>
                                <h4>Welcome to Koinet-Media! 👋</h4>
                                <p>Sign-up to your account and roll up your sleeves to work on the campaign!</p>
                            </div>
                            <Form id="registrationForm" onSubmit={submitForm}>
                                <Form.Group className="mb-2">
                                    <Row className="mb-2">
                                        <Col md={6}>
                                            <Form.Label htmlFor="firstName">First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label htmlFor="lastName">Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Form.Label htmlFor="email">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label htmlFor="password">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label htmlFor="phone">Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label htmlFor="role">Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="admin">Admin</option>
<option value="user">User</option>
<option value="teamleader">Team Lead</option>
<option value="supervisor">Supervisor</option>
<option value="oxmanager">OX Manager</option>
<option value="developer">Web Developer</option>
<option value="hr">HR Executive</option>
<option value="reasercher">Research Analyst</option>
<option value="agent">Agent</option>
<option value="client">Client</option>
<option value="quality">Quality</option>
<option value="email_marketing">Email Marketing</option>
<option value="delivery">Delivery</option>

                                    </Form.Control>
                                </Form.Group>
                                <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY_HERE"></div>
                                <div className="text-center mt-3">
                                    <Button type="submit" className="btn btn-danger w-50">
                                        Register Now
                                    </Button>
                                </div>
                            </Form>
                            {status === 'loading' && <>
                                <div className="text-center mt-3">
                                    <img src={Hourglass} alt="" height={40} width={40} />
                                </div>
                            </>}
                            {error && <p className="text-danger">{error.message || 'An error occurred'}</p>}
                        </Card>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
