import React, { useState } from 'react';
import axios from 'axios';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import baseUrl from '../../constant/ConstantApi';

function AddClient() {
  const [formData, setFormData] = useState({
    company_name: '',
    client_name: '',
    mobile: '',
    email: '',
    address: '',
    country: '',
    city: '',
    pincode: ''
  });
  const userRole = localStorage.getItem('role');
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}user/addnewClient`, formData)
      .then(response => {
        // console.log('Client added:', response.data);
        toast.success("Client Added Successfully !")
        setFormData(
          {
            company_name: '',
            client_name: '',
            mobile: '',
            email: '',
            address: '',
            country: '',
            city: '',
            pincode: ''
          }
        )
      })
      .catch(error => {
        // console.error('There was an error adding the client!', error);
        toast.success("Getting Error Add Client !")
      });
  };

  return (
    <div>
      <Container fluid className='my-5'>
        <Row>
          <Col lg={2}></Col>
          <Col lg={10}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'>Add Client</h4>
            </div>
            <div className="row">
              <div className="col-xxl">
                <div className="card mb-4">
                  <div className="card-header p-3 d-flex align-items-center justify-content-between">
                    <small className="text-muted float-end">Fields marked <span className="text-danger">*</span> are mandatory</small>
                  </div>
                  <div className="card-body">
                    <Form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="mb-3 col-md-6">
                          <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="XYZ Inc"
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <Form.Label>POC Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <Form.Label>Phone No <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="658 799 8941"
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john.doe@domain.com"
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            as="textarea"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                          >
                            <option value="">--Select Country--</option>
                            <option value="95">Albania</option>
                            <option value="96">Algeria</option>
                            <option value="86">American Samoa</option>
                            <option value="97">Andorra</option>
                            <option value="98">Angola</option>
                            <option value="45">APAC</option>
                            <option value="61">Australia</option>
                            <option value="99">Austria</option>
                            <option value="100">Bahrain</option>
                            <option value="50">Bangladesh</option>
                            <option value="101">Belarus</option>
                            <option value="102">Belgium</option>
                            <option value="103">Benin</option>
                            <option value="72">Bhutan</option>
                            <option value="104">Bosnia and Herzegovina</option>
                            <option value="105">Botswana</option>
                            <option value="214">Brazil</option>
                            <option value="75">Brunei</option>
                            <option value="106">Bulgaria</option>
                            <option value="107">Burkina Faso</option>
                            <option value="108">Burundi</option>
                            <option value="64">Cambodia</option>
                            <option value="109">Cameroon</option>
                            <option value="212">Canada</option>
                            <option value="110">Cape Verde</option>
                            <option value="111">Central African Republic</option>
                            <option value="112">Chad</option>
                            <option value="46">China</option>
                            <option value="113">Comoros</option>
                            <option value="88">Cook Islands</option>
                            <option value="114">Croatia</option>
                            <option value="115">Cyprus</option>
                            <option value="116">Czech Republic</option>
                            <option value="117">Democratic Republic of the Congo</option>
                            <option value="118">Denmark</option>
                            <option value="119">Djibouti</option>
                            <option value="120">Egypt</option>
                            <option value="94">EMEA</option>
                            <option value="121">Equatorial Guinea</option>
                            <option value="122">Eritrea</option>
                            <option value="123">Estonia</option>
                            <option value="124">Ethiopia</option>
                            <option value="1">Europe</option>
                            <option value="125">Faroe Islands</option>
                            <option value="71">Fiji</option>
                            <option value="126">Finland</option>
                            <option value="127">France</option>
                            <option value="78">French Polynesia</option>
                            <option value="128">Gabon</option>
                            <option value="129">Gambia</option>
                            <option value="130">Georgia</option>
                            <option value="131">Germany</option>
                            <option value="132">Ghana</option>
                            <option value="133">Gibraltar</option>
                            <option value="134">Greece</option>
                            <option value="80">Guam</option>
                            <option value="135">Guernsey</option>
                            <option value="136">Guinea</option>
                            <option value="137">Guinea-Bissau</option>
                            <option value="44">Holy See</option>
                            <option value="215">Hong Kong</option>
                            <option value="138">Hungary</option>
                            <option value="139">Iceland</option>
                            <option value="47">India</option>
                            <option value="48">Indonesia</option>
                            <option value="140">Iran</option>
                            <option value="141">Iraq</option>
                            <option value="142">Ireland</option>
                            <option value="143">Isle Of Man</option>
                            <option value="144">Israel</option>
                            <option value="145">Italy</option>
                            <option value="146">Ivory Coast</option>
                            <option value="52">Japan</option>
                            <option value="147">Jersey</option>
                            <option value="148">Jordan</option>
                            <option value="149">Kenya</option>
                            <option value="81">Kiribati</option>
                            <option value="150">Kuwait</option>
                            <option value="66">Laos</option>
                            <option value="151">Latvia</option>
                            <option value="152">Lebanon</option>
                            <option value="153">Lesotho</option>
                            <option value="154">Liberia</option>
                            <option value="155">Libya</option>
                            <option value="156">Liechtenstein</option>
                            <option value="157">Lithuania</option>
                            <option value="158">Luxembourg</option>
                            <option value="159">Macedonia</option>
                            <option value="160">Madagascar</option>
                            <option value="161">Malawi</option>
                            <option value="58">Malaysia</option>
                            <option value="74">Maldives</option>
                            <option value="162">Mali</option>
                            <option value="163">Malta</option>
                            <option value="84">Marshall Islands</option>
                            <option value="164">Mauritania</option>
                            <option value="165">Mauritius</option>
                            <option value="213">Mexico</option>
                            <option value="82">Micronesia</option>
                            <option value="166">Moldova</option>
                            <option value="167">Monaco</option>
                            <option value="69">Mongolia</option>
                            <option value="168">Montenegro</option>
                            <option value="169">Morocco</option>
                            <option value="170">Mozambique</option>
                            <option value="56">Myanmar</option>
                            <option value="171">Namibia</option>
                            <option value="91">Nauru</option>
                            <option value="59">Nepal</option>
                            <option value="172">Netherlands</option>
                            <option value="77">New Caledonia</option>
                            <option value="68">New Zealand</option>
                            <option value="173">Niger</option>
                            <option value="174">Nigeria</option>
                            <option value="92">Niue</option>
                            <option value="60">North Korea</option>
                            <option value="32">North Macedonia</option>
                            <option value="85">Northern Mariana Islands</option>
                            <option value="175">Norway</option>
                            <option value="176">Oman</option>
                            <option value="49">Pakistan</option>
                            <option value="87">Palau</option>
                            <option value="177">Palestine</option>
                            <option value="65">Papua New Guinea</option>
                            <option value="53">Philippines</option>
                            <option value="178">Poland</option>
                            <option value="179">Portugal</option>
                            <option value="180">Qatar</option>
                            <option value="181">Romania</option>
                            <option value="51">Russia</option>
                            <option value="182">Rwanda</option>
                            <option value="79">Samoa</option>
                            <option value="183">San Marino</option>
                            <option value="184">Sao Tome &amp; Principe</option>
                            <option value="185">Saudi Arabia</option>
                            <option value="186">Senegal</option>
                            <option value="187">Serbia</option>
                            <option value="67">Singapore</option>
                            <option value="188">Slovakia</option>
                            <option value="189">Slovenia</option>
                            <option value="73">Solomon Islands</option>
                            <option value="190">Somalia</option>
                            <option value="191">South Africa</option>
                            <option value="57">South Korea</option>
                            <option value="192">Spain</option>
                            <option value="63">Sri Lanka</option>
                            <option value="193">Sudan</option>
                            <option value="194">Swaziland</option>
                            <option value="195">Sweden</option>
                            <option value="196">Switzerland</option>
                            <option value="197">Syria</option>
                            <option value="62">Taiwan</option>
                            <option value="198">Tanzania</option>
                            <option value="55">Thailand</option>
                            <option value="70">Timor Leste</option>
                            <option value="199">Togo</option>
                            <option value="93">Tokelau</option>
                            <option value="83">Tonga</option>
                            <option value="200">Tunisia</option>
                            <option value="201">Turkey</option>
                            <option value="89">Tuvalu</option>
                            <option value="202">Uganda</option>
                            <option value="203">Ukraine</option>
                            <option value="204">United Arab Emirates</option>
                            <option value="3">United Kingdom</option>
                            <option value="211">United States</option>
                            <option value="76">Vanuatu</option>
                            <option value="206">Vatican City</option>
                            <option value="54">Vietnam</option>
                            <option value="90">Wallis And Futuna</option>
                            <option value="207">Western Sahara</option>
                            <option value="208">Yemen</option>
                            <option value="209">Zambia</option>
                            <option value="210">Zimbabwe</option>
                          </Form.Select>
                        </div>
                        <div className="mb-3 col-md-6">
                          <Form.Label>City <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <Form.Label>Pincode <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="10001"
                            required
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <button type="submit" className="btn btn-danger me-2" disabled={!(userRole === 'oxmanager' || userRole === 'admin')}>Save</button>
                        <button type="reset" className="btn btn-outline-secondary" onClick={() => setFormData({
                          company_name: '',
                          client_name: '',
                          mobile: '',
                          email: '',
                          address: '',
                          country: '',
                          city: '',
                          pincode: ''
                        })}>Clear</button>
                      </div>
                    </Form>
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

export default AddClient;
