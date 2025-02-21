import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import baseUrl from '../../constant/ConstantApi';

function ViewAgencyDetailsById({ userData }) {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        company_name: '',
        company_type: '',
        vendor_profile: '',
        agency_id: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        address: '',
        primary_first_name: '',
        primary_last_name: '',
        primary_phone_no: '',
        primary_email: '',
        primary_designation: '',
        password: '',
        secondary_first_name: '',
        secondary_last_name: '',
        secondary_phone_no: '',
        secondary_email: '',
        secondary_designation: '',
    });
    const [loading, setLoading] = useState(true);
    const countryOptions = [
        { value: "95", name: "Albania" },
        { value: "96", name: "Algeria" },
        { value: "86", name: "American Samoa" },
        { value: "97", name: "Andorra" },
        { value: "98", name: "Angola" },
        { value: "45", name: "APAC" },
        { value: "61", name: "Australia" },
        { value: "99", name: "Austria" },
        { value: "100", name: "Bahrain" },
        { value: "50", name: "Bangladesh" },
        { value: "101", name: "Belarus" },
        { value: "102", name: "Belgium" },
        { value: "103", name: "Benin" },
        { value: "72", name: "Bhutan" },
        { value: "104", name: "Bosnia and Herzegovina" },
        { value: "105", name: "Botswana" },
        { value: "214", name: "Brazil" },
        { value: "75", name: "Brunei" },
        { value: "106", name: "Bulgaria" },
        { value: "107", name: "Burkina Faso" },
        { value: "108", name: "Burundi" },
        { value: "64", name: "Cambodia" },
        { value: "109", name: "Cameroon" },
        { value: "212", name: "Canada" },
        { value: "110", name: "Cape Verde" },
        { value: "111", name: "Central African Republic" },
        { value: "112", name: "Chad" },
        { value: "46", name: "China" },
        { value: "113", name: "Comoros" },
        { value: "88", name: "Cook Islands" },
        { value: "114", name: "Croatia" },
        { value: "115", name: "Cyprus" },
        { value: "116", name: "Czech Republic" },
        { value: "117", name: "Democratic Republic of the Congo" },
        { value: "118", name: "Denmark" },
        { value: "119", name: "Djibouti" },
        { value: "120", name: "Egypt" },
        { value: "94", name: "EMEA" },
        { value: "121", name: "Equatorial Guinea" },
        { value: "122", name: "Eritrea" },
        { value: "123", name: "Estonia" },
        { value: "124", name: "Ethiopia" },
        { value: "1", name: "Europe" },
        { value: "125", name: "Faroe Islands" },
        { value: "71", name: "Fiji" },
        { value: "126", name: "Finland" },
        { value: "127", name: "France" },
        { value: "78", name: "French Polynesia" },
        { value: "128", name: "Gabon" },
        { value: "129", name: "Gambia" },
        { value: "130", name: "Georgia" },
        { value: "131", name: "Germany" },
        { value: "132", name: "Ghana" },
        { value: "133", name: "Gibraltar" },
        { value: "134", name: "Greece" },
        { value: "80", name: "Guam" },
        { value: "135", name: "Guernsey" },
        { value: "136", name: "Guinea" },
        { value: "137", name: "Guinea-Bissau" },
        { value: "44", name: "Holy See" },
        { value: "215", name: "Hong Kong" },
        { value: "138", name: "Hungary" },
        { value: "139", name: "Iceland" },
        { value: "47", name: "India" },
        { value: "48", name: "Indonesia" },
        { value: "140", name: "Iran" },
        { value: "141", name: "Iraq" },
        { value: "142", name: "Ireland" },
        { value: "143", name: "Isle Of Man" },
        { value: "144", name: "Israel" },
        { value: "145", name: "Italy" },
        { value: "146", name: "Ivory Coast" },
        { value: "52", name: "Japan" },
        { value: "147", name: "Jersey" },
        { value: "148", name: "Jordan" },
        { value: "149", name: "Kenya" },
        { value: "81", name: "Kiribati" },
        { value: "150", name: "Kuwait" },
        { value: "66", name: "Laos" },
        { value: "151", name: "Latvia" },
        { value: "152", name: "Lebanon" },
        { value: "153", name: "Lesotho" },
        { value: "154", name: "Liberia" },
        { value: "155", name: "Libya" },
        { value: "156", name: "Liechtenstein" },
        { value: "157", name: "Lithuania" },
        { value: "158", name: "Luxembourg" },
        { value: "159", name: "Macedonia" },
        { value: "160", name: "Madagascar" },
        { value: "161", name: "Malawi" },
        { value: "58", name: "Malaysia" },
        { value: "74", name: "Maldives" },
        { value: "162", name: "Mali" },
        { value: "163", name: "Malta" },
        { value: "84", name: "Marshall Islands" },
        { value: "164", name: "Mauritania" },
        { value: "165", name: "Mauritius" },
        { value: "213", name: "Mexico" },
        { value: "82", name: "Micronesia" },
        { value: "166", name: "Moldova" },
        { value: "167", name: "Monaco" },
        { value: "69", name: "Mongolia" },
        { value: "168", name: "Montenegro" },
        { value: "169", name: "Morocco" },
        { value: "170", name: "Mozambique" },
        { value: "56", name: "Myanmar" },
        { value: "171", name: "Namibia" },
        { value: "91", name: "Nauru" },
        { value: "59", name: "Nepal" },
        { value: "172", name: "Netherlands" },
        { value: "77", name: "New Caledonia" },
        { value: "68", name: "New Zealand" },
        { value: "173", name: "Niger" },
        { value: "174", name: "Nigeria" },
        { value: "92", name: "Niue" },
        { value: "60", name: "North Korea" },
        { value: "32", name: "North Macedonia" },
        { value: "85", name: "Northern Mariana Islands" },
        { value: "175", name: "Norway" },
        { value: "176", name: "Oman" },
        { value: "49", name: "Pakistan" },
        { value: "87", name: "Palau" },
        { value: "177", name: "Palestine" },
        { value: "65", name: "Papua New Guinea" },
        { value: "53", name: "Philippines" },
        { value: "178", name: "Poland" },
        { value: "179", name: "Portugal" },
        { value: "180", name: "Qatar" },
        { value: "181", name: "Romania" },
        { value: "51", name: "Russia" },
        { value: "182", name: "Rwanda" },
        { value: "79", name: "Samoa" },
        { value: "183", name: "San Marino" },
        { value: "184", name: "Sao Tome & Principe" },
        { value: "185", name: "Saudi Arabia" },
        { value: "186", name: "Senegal" },
        { value: "187", name: "Serbia" },
        { value: "67", name: "Singapore" },
        { value: "188", name: "Slovakia" },
        { value: "189", name: "Slovenia" },
        { value: "73", name: "Solomon Islands" },
        { value: "190", name: "Somalia" },
        { value: "191", name: "South Africa" },
        { value: "57", name: "South Korea" },
        { value: "192", name: "Spain" },
        { value: "63", name: "Sri Lanka" },
        { value: "193", name: "Sudan" },
        { value: "194", name: "Swaziland" },
        { value: "195", name: "Sweden" },
        { value: "196", name: "Switzerland" },
        { value: "197", name: "Syria" },
        { value: "62", name: "Taiwan" },
        { value: "198", name: "Tanzania" },
        { value: "55", name: "Thailand" },
        { value: "70", name: "Timor Leste" },
        { value: "199", name: "Togo" },
        { value: "93", name: "Tokelau" },
        { value: "83", name: "Tonga" },
        { value: "200", name: "Tunisia" },
        { value: "201", name: "Turkey" },
        { value: "89", name: "Tuvalu" },
        { value: "202", name: "Uganda" },
        { value: "203", name: "Ukraine" },
        { value: "204", name: "United Arab Emirates" },
        { value: "3", name: "United Kingdom" },
        { value: "211", name: "United States" },
        { value: "76", name: "Vanuatu" },
        { value: "206", name: "Vatican City" },
        { value: "54", name: "Vietnam" },
        { value: "90", name: "Wallis And Futuna" },
        { value: "207", name: "Western Sahara" },
        { value: "208", name: "Yemen" },
        { value: "209", name: "Zambia" },
        { value: "210", name: "Zimbabwe" },
    ];

    const updatedCountryOptions = countryOptions.map(country => ({
        value: country.value,
        name: country.name,
    }));

    useEffect(() => {
        if (id) {
            console.log("Fetching data for ID:", id);  // Debugging line
            setLoading(true);
            axios.get(`${baseUrl}user/viewAgencyDetails/${id}`)
                .then(response => {
                    console.log("Data fetched:", response.data);  // Debugging line
                    setFormData(response.data.updatedVendor);  // Access updatedVendor from response
                })
                .catch(error => {
                    console.error("There was an error fetching the agency details!", error);
                    toast.error("Failed to fetch agency details.");
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.put(`${baseUrl}user/updateAgency/${id}`, formData)
            .then(response => {
                console.log("Update response:", response.data);  // Debugging line
                toast.success(response.data.message);
            })
            .catch(error => {
                console.error("There was an error updating the agency details!", error);
                toast.error("Failed to update agency details.");
            })
            .finally(() => setLoading(false));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className='my-5'>
            <Row>
                <Col lg={2}></Col>
                <Col lg={10}>
                    <div className='bgColor rounded-3 shadow'>
                        <h4 className='fw-bold py-3 ms-3 text_color'>View Agency Details & Update</h4>
                    </div>
                    <div className="row">
                        <div className="col-xxl">
                            <div className="card mb-4">
                                <div className="card-header d-flex align-items-center justify-content-between">
                                    <small className="text-muted float-end p-2">
                                        Fields marked <span className="text-danger">*</span> are mandatory
                                    </small>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Add hidden input for token if needed */}
                                        <input type="hidden" name="_token" />

                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="company_name" className="col-sm-6 col-form-label">
                                                    Company Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="company_name"
                                                    name="company_name"
                                                    placeholder="Marathon B2B"
                                                    value={formData.company_name}
                                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="company_type" className="col-sm-6 col-form-label">
                                                    Company Type <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    id="company_type"
                                                    name="company_type"
                                                    className="form-select"
                                                    value={formData.company_type}
                                                    onChange={e => setFormData({ ...formData, company_type: e.target.value })}
                                                    required
                                                >
                                                    <option value="">--Select Company Type--</option>
                                                    <option value="Privately held">Privately held</option>
                                                    <option value="Publicly held">Publicly held</option>
                                                    <option value="Limited Liability Partnership">Limited Liability Partnership</option>
                                                    <option value="Single Person Owned">Single Person Owned</option>
                                                    <option value="Unregistered">Unregistered</option>
                                                </select>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="vendor_profile" className="col-sm-6 col-form-label">
                                                    Vendor Profile <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="vendor_profile"
                                                    name="vendor_profile"
                                                    placeholder="https://example.com/vendor-profile"
                                                    value={formData.vendor_profile}
                                                    onChange={e => setFormData({ ...formData, vendor_profile: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="agency_id" className="col-sm-6 col-form-label">
                                                    Agency
                                                </label>
                                                <select
                                                    id="agency_id"
                                                    name="agency_id"
                                                    className="form-select"
                                                    value={formData.agency_id}
                                                    onChange={e => setFormData({ ...formData, agency_id: e.target.value })}
                                                    required
                                                >
                                                    <option value="">--Select Agency--</option>
                                                    <option value="21">Agency 1</option>
                                                    <option value="22">Agency 2</option>
                                                    <option value="23">Agency 3</option>
                                                </select>
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="country" className="col-sm-6 col-form-label">
                                                    Country <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    className="form-select"
                                                    value={formData.country}
                                                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                                                    required
                                                >
                                                    <option value="">--Select Country--</option>
                                                    {updatedCountryOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.name} ({option.value})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="state" className="col-sm-6 col-form-label">State <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    name="state"
                                                    id="state"
                                                    className="form-control"
                                                    placeholder="California"
                                                    value={formData.state}
                                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="city" className="form-label">City <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    name="city"
                                                    id="city"
                                                    className="form-control"
                                                    placeholder="Los Angeles"
                                                    value={formData.city}
                                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="pincode" className="form-label">Pincode <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    name="pincode"
                                                    id="pincode"
                                                    maxLength="6"
                                                    className="form-control"
                                                    placeholder="90001"
                                                    value={formData.pincode}
                                                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="address" className="form-label">Address <span className="text-danger">*</span></label>
                                                <textarea
                                                    required
                                                    name="address"
                                                    id="address"
                                                    className="form-control"
                                                    placeholder="123 Tech Road, Suite 456"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="primary_first_name" className="form-label">Primary First Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    name="primary_first_name"
                                                    id="primary_first_name"
                                                    className="form-control"
                                                    placeholder="John"
                                                    value={formData.primary_first_name}
                                                    onChange={e => setFormData({ ...formData, primary_first_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="primary_last_name" className="form-label">Primary Last Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    name="primary_last_name"
                                                    id="primary_last_name"
                                                    className="form-control"
                                                    placeholder="Doe"
                                                    value={formData.primary_last_name}
                                                    onChange={e => setFormData({ ...formData, primary_last_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="primary_phone_no" className="form-label">Primary Phone Number <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    name="primary_phone_no"
                                                    id="primary_phone_no"
                                                    maxLength="10"
                                                    className="form-control"
                                                    placeholder="1234567890"
                                                    value={formData.primary_phone_no}
                                                    onChange={e => setFormData({ ...formData, primary_phone_no: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="primary_email" className="form-label">Primary Email <span className="text-danger">*</span></label>
                                                <input
                                                    type="email"
                                                    required
                                                    name="primary_email"
                                                    id="primary_email"
                                                    className="form-control"
                                                    placeholder="alltake.doe@example.com"
                                                    value={formData.primary_email}
                                                    onChange={e => setFormData({ ...formData, primary_email: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="primary_designation" className="form-label">Primary Designation <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    name="primary_designation"
                                                    id="primary_designation"
                                                    className="form-control"
                                                    placeholder="CEO"
                                                    value={formData.primary_designation}
                                                    onChange={e => setFormData({ ...formData, primary_designation: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    className="form-control"
                                                    placeholder="******"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="secondary_first_name" className="form-label">Secondary First Name</label>
                                                <input
                                                    type="text"
                                                    name="secondary_first_name"
                                                    id="secondary_first_name"
                                                    className="form-control"
                                                    placeholder="Jane"
                                                    value={formData.secondary_first_name}
                                                    onChange={e => setFormData({ ...formData, secondary_first_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="secondary_last_name" className="form-label">Secondary Last Name</label>
                                                <input
                                                    type="text"
                                                    name="secondary_last_name"
                                                    id="secondary_last_name"
                                                    className="form-control"
                                                    placeholder="Doe"
                                                    value={formData.secondary_last_name}
                                                    onChange={e => setFormData({ ...formData, secondary_last_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="secondary_phone_no" className="form-label">Secondary Phone Number</label>
                                                <input
                                                    type="text"
                                                    name="secondary_phone_no"
                                                    id="secondary_phone_no"
                                                    maxLength="10"
                                                    className="form-control"
                                                    placeholder="0987654321"
                                                    value={formData.secondary_phone_no}
                                                    onChange={e => setFormData({ ...formData, secondary_phone_no: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="secondary_email" className="form-label">Secondary Email</label>
                                                <input
                                                    type="email"
                                                    name="secondary_email"
                                                    id="secondary_email"
                                                    className="form-control"
                                                    placeholder="jane.doe@example.com"
                                                    value={formData.secondary_email}
                                                    onChange={e => setFormData({ ...formData, secondary_email: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="secondary_designation" className="form-label">Secondary Designation</label>
                                                <input
                                                    type="text"
                                                    name="secondary_designation"
                                                    id="secondary_designation"
                                                    className="form-control"
                                                    placeholder="CTO"
                                                    value={formData.secondary_designation}
                                                    onChange={e => setFormData({ ...formData, secondary_designation: e.target.value })}
                                                />
                                            </div>

                                            <div className="mb-3 col-md-12">
                                                <button type="submit" className="btn btn-primary">
                                                    Update
                                                </button>
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
    );
}

export default ViewAgencyDetailsById;
