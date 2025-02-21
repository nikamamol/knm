import { Col, Container, Row } from 'react-bootstrap'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchClients } from '../../../redux/reducer/billing/ClientSlice';
import { fetchTemplates } from '../../../redux/reducer/createteplate/GetTemplate';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import baseUrl from '../../../constant/ConstantApi';


function UpdateCampaign({ campaignId }) {
    const { id } = useParams(); // Extract campaign ID from route params
    const dispatch = useDispatch();
    const clients = useSelector((state) => state.clients.data);
    const templates = useSelector((state) => state.templates.templates);

    const [formData, setFormData] = useState({
        clientSelect: '',
        campaignName: '',
        campaignCode: '',
        startDate: '',
        endDate: '',
        campaignType: '',
        campaignNature: '',
        target: 0,
        leadPerDay: 0,
        voiceLogRequired: '',
        billingDay: 0,
        cpl: 0,
        supervisor: '',
        supervisorTarget: 0,
        template: '',
        revenue: [],
        companySize: [],
        jobTitle: '',
        geo: '',
        industry: '',
        note: '',
        deliveryType: '',
        deliveryDays: '',
        suppressionList: [],
        abmList: [],
        contactsPerCampaign: false,
        abmCpc: 'Company',
        nonAbmCpc: 'Company',
        noOfContacts: 0,
        industryFilter: [],
        functionFilter: [],
        seniorityLevel: [],
        employeeSize: [],
        companyFilter: [],
        jobTitleFilter: [],
        revenueFilter: [],
        countryFilter: [],
        cityFilter: [],
        zipCodeFilter: []
    });

    const [files, setFiles] = useState({
        assets: [],
        script: [],
        suppression: [],
        tal: [],
        suppressionList: [],
        abmList: []
    });
    const [uploadedFiles, setUploadedFiles] = useState({
        assets: null,
        script: null,
        suppression: null,
        tal: null,
    });

    // Fetch clients and templates when the component mounts
    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchTemplates());

        // Fetch campaign data by ID
        const fetchCampaignData = async () => {
            try {
                const response = await axios.get(`${baseUrl}user/getCampaignsDataById/${id}`);
                const campaignData = response.data;

                // Prefill form with fetched data
                setFormData({
                    clientSelect: campaignData.clientSelect || '',
                    campaignName: campaignData.campaignName || '',
                    campaignCode: campaignData.campaignCode || '',
                    startDate: campaignData.startDate.slice(0, 10) || '',
                    endDate: campaignData.endDate.slice(0, 10) || '',
                    campaignType: campaignData.campaignType || '',
                    campaignNature: campaignData.campaignNature || '',
                    target: campaignData.target || 0,
                    leadPerDay: campaignData.leadPerDay || 0,
                    voiceLogRequired: campaignData.voiceLogRequired || '',
                    billingDay: campaignData.billingDay || 0,
                    cpl: campaignData.cpl || 0,
                    supervisor: campaignData.supervisor || '',
                    supervisorTarget: campaignData.supervisorTarget || 0,
                    template: campaignData.template || '',
                    revenue: campaignData.revenue || [],
                    companySize: campaignData.companySize || [],
                    jobTitle: campaignData.jobTitle || '',
                    geo: campaignData.geo || '',
                    industry: campaignData.industry || '',
                    note: campaignData.note || '',
                    deliveryType: campaignData.deliveryType || '',
                    deliveryDays: campaignData.deliveryDays || '',
                    suppressionList: campaignData.suppressionList || [],
                    abmList: campaignData.abmList || [],
                    contactsPerCampaign: campaignData.contactsPerCampaign || false,
                    abmCpc: campaignData.abmCpc || 'Company',
                    nonAbmCpc: campaignData.nonAbmCpc || 'Company',
                    noOfContacts: campaignData.noOfContacts || 0,
                    industryFilter: campaignData.industryFilter || [],
                    functionFilter: campaignData.functionFilter || [],
                    seniorityLevel: campaignData.seniorityLevel || [],
                    employeeSize: campaignData.employeeSize || [],
                    companyFilter: campaignData.companyFilter || [],
                    jobTitleFilter: campaignData.jobTitleFilter || [],
                    revenueFilter: campaignData.revenueFilter || [],
                    countryFilter: campaignData.countryFilter || [],
                    cityFilter: campaignData.cityFilter || [],
                    zipCodeFilter: campaignData.zipCodeFilter || []
                });
            } catch (error) {
                // console.error("Error fetching campaign data:", error);
                toast.error("Failed to fetch campaign data.");
            }
        };

        fetchCampaignData();
    }, [dispatch, id]);  // Fetch data on component mount or when `id` changes

    // console.log(formData);

    // Handle form change
   const handleChange = (event) => {
    const { name, type, value, files } = event.target;

    if (type === 'file') {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [name]: Array.from(files),
        }));
    } else {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }
};


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();

        // Append form data
        Object.keys(formData).forEach(key => {
            if (Array.isArray(formData[key])) {
                formData[key].forEach(item => payload.append(key, item));
            } else {
                payload.append(key, formData[key]);
            }
        });

        // Append files with original names
        Object.keys(files).forEach(key => {
            Array.from(files[key]).forEach(file => {
                payload.append(key, file);  // Append the file to the payload
            });
        });

        try {
            // Send the update request to the server
            await axios.put(`${baseUrl}user/updateCampaignById/${id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Campaign updated successfully');
        } catch (error) {
            toast.error('Failed to update campaign. Please try again.');
        }
    };

    return (
        <div>
            <Container fluid className='my-5 '>
                <Row className=''>
                    <Col lg={2}>
                    </Col>
                    <Col lg={10}>
                        <div className='bgColor rounded-3 shadow'>
                            <h4 className='fw-bold py-3 ms-3 text_color'>Update Campaign</h4>
                        </div>

                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-xxl">
                                        <div className="card mb-4">
                                            <div className="card-header d-flex align-items-center justify-content-between p-3">
                                                <small className="text-muted float-end">Fields marked <span className="text-danger">*</span> are mandatory</small>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="mb-3 col-md-6 client_select">
                                                        <label htmlFor="client_select" className="form-label">Campaign For Client  <span className="text-danger">*</span></label>
                                                        <select
                                                            id="client_select"
                                                            name="clientSelect"
                                                            value={formData.clientSelect}
                                                            onChange={handleChange}
                                                            className="form-select"
                                                        >
                                                            <option value="">--Select Client Name--</option>
                                                            {/* <option value="-1">Add New Client</option> */}
                                                            {clients.map(client => (
                                                                <option key={client._id} value={client.companyName}>
                                                                    {client.companyName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="campaign_name" className="form-label">Campaign Name <span className="text-danger">*</span></label>
                                                        <input type="text" className="form-control" value={formData.campaignName}
                                                            onChange={handleChange} id="campaign_name" name="campaignName" placeholder="Melt the Ice Campaign" aria-label="Melt the Ice Campaign" aria-describedby="basic-icon-default-fullname2" />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="campaign_code" className="form-label">Campaign Code <span className="text-danger">*</span></label>
                                                        <input type="text" id="campaign_code" value={formData.campaignCode}
                                                            onChange={handleChange} className="form-control phone-mask" name="campaignCode" placeholder="ICE" aria-label="ICE" aria-describedby="basic-icon-default-phone2" />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="start_date" className="form-label">Start Date <span className="text-danger">*</span></label>
                                                        <input type="date" id="start_date" name='startDate' className="form-control" value={formData.startDate} onChange={handleChange} min="2024-07-19" />
                                                    </div>

                                                    <div className="mb-3 col-md-6">
                                                        <label for="end_date" className="form-label">End Date <span className="text-danger">*</span></label>
                                                        <input className="form-control" value={formData.endDate} onChange={handleChange} type="date" min="2024-07-19" name="endDate" id="end_date" />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="campaign_type" className="form-label">Type Of Campaign  <span className="text-danger">*</span></label>
                                                        <select id="campaign_type" value={formData.campaignType} onChange={handleChange} name="campaignType" className="form-select">
                                                            <option value="">--Select Campaign Type--</option>
                                                            <option value="Tele Marketing">Tele Marketing</option>
                                                            <option value="Email Marketing">Email Marketing</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="campaign_nature" className="form-label">Nature Of Campaign<span className="text-danger">*</span></label>
                                                        <select id="campaign_nature" value={formData.campaignNature} onChange={handleChange} name='campaignNature' className="form-select">
                                                            <option value="">--Select Campaign Nature--</option>
                                                            <option value="HQL">HQL</option>
                                                            <option value="SQL">SQL</option>
                                                            <option value="MQL">MQL</option>
                                                            <option value="WP">WP</option>
                                                            <option value="AG">AG</option>
                                                            <option value="EM">EM</option>

                                                        </select>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="target" className="form-label">Target</label>  <span className="text-danger"> *</span>
                                                        <input className="form-control" name='target' type="number" value={formData.target} onChange={handleChange} placeholder="3000" id="target" />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="lead_per_day" className="form-label">Lead Per Day</label> <span className="text-danger"> *</span>
                                                        <input className="form-control" type="number" name='leadPerDay' value={formData.leadPerDay} onChange={handleChange} placeholder="100" id="lead_per_day" />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="voice_log_required" className="form-label">Voice Log</label> <span className="text-danger"> *</span>
                                                        <select id="voice_log_required" name="voiceLogRequired" value={formData.voiceLogRequired} onChange={handleChange} className="form-select">
                                                            <option value="">--Voice Log--</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="billing_day" className="form-label">Billing Day</label> <span className="text-danger"> *</span>
                                                        <select id="billing_day" value={formData.billingDay} name='billingDay' onChange={handleChange} className="form-select">
                                                            <option value="">--Billing Day--</option>
                                                            <option value="1">1st of the month</option>
                                                            <option value="2">2nd of the month</option>
                                                            <option value="3">3rd of the month</option>
                                                            <option value="4">4th of the month</option>
                                                            <option value="5">5th of the month</option>
                                                            <option value="6">6th of the month</option>
                                                            <option value="7">7th of the month</option>
                                                            <option value="8">8th of the month</option>
                                                            <option value="9">9th of the month</option>
                                                            <option value="10">10th of the month</option>
                                                            <option value="11">11th of the month</option>
                                                            <option value="12">12th of the month</option>
                                                            <option value="13">13th of the month</option>
                                                            <option value="14">14th of the month</option>
                                                            <option value="15">15th of the month</option>
                                                            <option value="16">16th of the month</option>
                                                            <option value="17">17th of the month</option>
                                                            <option value="18">18th of the month</option>
                                                            <option value="19">19th of the month</option>
                                                            <option value="20">20th of the month</option>
                                                            <option value="21">21st of the month</option>
                                                            <option value="22">22nd of the month</option>
                                                            <option value="23">23rd of the month</option>
                                                            <option value="24">24th of the month</option>
                                                            <option value="25">25th of the month</option>
                                                            <option value="26">26th of the month</option>
                                                            <option value="27">27th of the month</option>
                                                            <option value="28">28th of the month</option>
                                                            <option value="29">29th of the month (if applicable)</option>
                                                            <option value="30">30th of the month (if applicable)</option>

                                                        </select>
                                                    </div>
                                                    <div className="mb-3 col-md-6 client_select">
                                                        <label htmlFor="cpl" className="form-label">
                                                            CPL
                                                        </label>
                                                        <span className="text-danger"> *</span>

                                                        <div className="input-group">
                                                            <span className="input-group-text">$</span>
                                                            <input
                                                                className="form-control"
                                                                value={formData.cpl}
                                                                onChange={handleChange}
                                                                type="number"
                                                                name="cpl"

                                                                id="cpl"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label htmlFor="deliveryType" className="form-label">Delivery Type</label>
                                                        <select
                                                            id="deliveryType"
                                                            value={formData.deliveryType}
                                                            name="deliveryType"
                                                            onChange={handleChange}

                                                            className="form-select"
                                                        >
                                                            <option value="Daily">Daily</option>
                                                            <option value="Twice in a Week">Twice in a Week</option>
                                                            <option value="Weekly">Weekly</option>
                                                            <option value="Forthnight">Forthnight</option>
                                                            <option value="Monthly">Monthly</option>
                                                            <option value="Quaterly">Quaterly</option>

                                                        </select>
                                                        {/* <a href="#" style={{ display: formData.template ? 'block' : 'none' }} target="_blank" id="view_sample">View Sample</a>
                          <a href="#" style={{ display: formData.template ? 'block' : 'none' }} target="_blank" id="view_landing">View Landing Page</a> */}
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label htmlFor="deliveryDays" className="form-label">Delivery Day</label>
                                                        <select
                                                            id="deliveryDays"
                                                            value={formData.deliveryDays}
                                                            name="deliveryDays"
                                                            onChange={handleChange}

                                                            className="form-select"
                                                        >
                                                            <option value="Daily">Daily</option>
                                                            <option value="Mon">Mon</option>
                                                            <option value="Tue">Tue</option>
                                                            <option value="Wed">Wed</option>
                                                            <option value="Thu">Thu</option>
                                                            <option value="Fri">Fri</option>
                                                            <option value="Mon-Tue">Mon-Tue</option>
                                                            <option value="Mon-Wed">Mon-Wed</option>
                                                            <option value="Mon-Thu">Mon-Thu</option>
                                                            <option value="Mon-Fri">Mon-Fri</option>
                                                            <option value="Tue-Wed">Tue-Wed</option>
                                                            <option value="Tue-Thu">Tue-Thu</option>
                                                            <option value="Tue-Fri">Tue-Fri</option>
                                                            <option value="Wed-Thu">Wed-Thu</option>
                                                            <option value="Wed-Fri">Wed-Fri</option>
                                                            <option value="Thu-Fri">Thu-Fri</option>

                                                        </select>
                                                        {/* <a href="#" style={{ display: formData.template ? 'block' : 'none' }} target="_blank" id="view_sample">View Sample</a>
                          <a href="#" style={{ display: formData.template ? 'block' : 'none' }} target="_blank" id="view_landing">View Landing Page</a> */}
                                                    </div>

                                                    <div className="mb-3 col-md-6">
                                                        <label htmlFor="template" className="form-label">Landing Page</label>
                                                        <select
                                                            id="template"
                                                            value={formData.template}
                                                            name="template"
                                                            onChange={handleChange}

                                                            className="form-select"
                                                        >
                                                            <option value="">--Landing Template--</option>
                                                            {templates && templates.map((template) => (
                                                                <option key={template._id} value={template.template_title}>
                                                                    {template.template_title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {/* <a href="#" style={{ display: formData.template ? 'block' : 'none' }} target="_blank" id="view_sample">View Sample</a>
                          <a href="#" style={{ display: formData.template ? 'block' : 'none' }} target="_blank" id="view_landing">View Landing Page</a> */}
                                                    </div>
                                                    {/* sceocond part */}
                                                    <div className="">
                                                        <div className="text-center py-2 bg-light">Supervisor</div>
                                                    </div>

                                                    <div className="container">
                                                        <div className="row">
                                                            <div className="col-lg-6 mb-2">
                                                                <label for="campaign_superwiser" className="form-label">Supervisor<span className="text-danger">*</span></label>
                                                                <select id="supervisor" value={formData.supervisor} onChange={handleChange} name='supervisor' className="form-select">
                                                                    <option value="">Select Supervisor</option>
                                                                    <option value="ankush suryawanshi">
                                                                        Ankush Suryawanshi
                                                                    </option>

                                                                </select>
                                                            </div>
                                                            <div className="mb-2 col-lg-6 ">
                                                                <label for="target" className="form-label">Target</label> <span className="text-danger"> *</span>
                                                                <input className="form-control" name="supervisorTarget" value={formData.supervisorTarget} onChange={handleChange} type="number" placeholder="100" id="cpl" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div className="text-center py-2 bg-light">Assets</div>
                                                    </div>

                                                    <div className="mb-3 col-md-6 mt-2">
                                                        <label htmlFor="assets" className="form-label">Assets/Whitepaper</label> (.pdf)
                                                        <span className="text-danger" id="validation_assets"> *</span>
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            id="assets"
                                                            name="assets"
                                                            accept=".pdf"  // Accept only PDF files
                                                            multiple
                                                            onChange={handleChange}
                                                        />
                                                    </div>

                                                    <div className="mb-3 col-md-6">
                                                        <label htmlFor="script" className="form-label">Script</label> (.doc, .docx)
                                                        <span className="text-danger" id="validation_script"> *</span>
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            id="script"
                                                            name="script"
                                                            accept=".doc,.docx"  // Accept only DOC/DOCX files
                                                            multiple
                                                            onChange={handleChange}
                                                        />
                                                    </div>

                                                    <div className="mb-3 col-md-6">
                                                        <label htmlFor="suppression" className="form-label">Suppression</label> (.csv) <span className="text-danger" id="validation_suppression"> *</span>
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            id="suppression"
                                                            name="suppression"
                                                            accept=".pdf, .xlsx, .xls, .csv"
                                                            multiple
                                                            onChange={handleChange}
                                                        />
                                                    </div>

                                                    <div className="mb-3 col-md-6">
                                                        <label htmlFor="tal" className="form-label">TAL</label> (.csv) <span className="text-danger" id="validation_tal"> *</span>
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            id="tal"
                                                            name="tal"
                                                            accept=".pdf,.xlsx, .xls, .csv"
                                                            multiple
                                                            onChange={handleChange}
                                                        />
                                                    </div>

                                                    <div className="">
                                                        <div className="text-center py-2 bg-light">Additional</div>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="revenue" className="form-label">Revenue</label> <span className="text-danger"> *</span>
                                                        <input className="form-control" value={formData.revenue} onChange={handleChange} type="text" placeholder="1000000" name="revenue" id="revenue" />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="company_size" className="form-label">Company Size</label><span className="text-danger"> *</span>
                                                        <input className="form-control" type="text" value={formData.companySize} onChange={handleChange} placeholder="50" name="companySize" id="company_size" />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="job_title" className="form-label">Job Title</label> <span className="text-danger"> *</span>
                                                        <textarea className="form-control enablebutton" value={formData.jobTitle} onChange={handleChange} type="text" placeholder="Director" name="jobTitle" id="job_title"></textarea>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="geo" className="form-label">Geo</label> <span className="text-danger"> *</span>
                                                        <textarea className="form-control enablebutton" value={formData.geo} onChange={handleChange} type="text" placeholder="USA" name="geo" id="geo"></textarea>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="industry" className="form-label">Industry</label>  <span className="text-danger"> *</span>
                                                        <textarea className="form-control enablebutton" value={formData.industry} onChange={handleChange} type="text" placeholder="Information Technology" name="industry" id="industry"></textarea>
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label for="note" className="form-label">Note</label> <span className="text-danger"> *</span>
                                                        <textarea className="form-control enablebutton" type="text" placeholder="Note" value={formData.note} onChange={handleChange} name="note" id="note"></textarea>
                                                    </div>

                                                    {/* forth part */}
                                                    <div className="text-center py-2 bg-light">Supression &amp; ABM List</div>
                                                    <div className="mb-3 col-md-6 mt-2">
                                                        <label htmlFor="supression_list" className="form-label">Supression</label> (.csv)
                                                        <span>
                                                            <a
                                                                target="_blank"
                                                                className='ms-2'
                                                                rel="noopener noreferrer"
                                                                style={{ pointerEvents: 'visible' }}
                                                                href='/src/assets/Demo_Template.xls'
                                                            >
                                                                Download Template
                                                            </a>
                                                        </span>
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            multiple
                                                            onChange={handleChange}

                                                            accept=".pdf, .xlsx, .xls, .csv"
                                                            name="suppressionList"
                                                        />
                                                    </div>

                                                    <div className="mb-3 col-md-6 mt-2">
                                                        <label htmlFor="abm" className="form-label">ABM</label> (.csv)
                                                        <span>
                                                            <a
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className='ms-2'
                                                                style={{ pointerEvents: 'visible' }}
                                                                href='/src/assets/abm_template.xls'
                                                            >
                                                                Download Template
                                                            </a>

                                                        </span>
                                                        <input
                                                            className="form-control"
                                                            type="file"

                                                            multiple onChange={handleChange}
                                                            accept=".pdf, .xlsx, .xls, .csv"
                                                            id="abm_list"
                                                            name="abmList"
                                                        />
                                                    </div>
                                                    <div id="div_view_contact_per_campaign">
                                                        <div className="text-center py-2 bg-light">Contacts Per Campaign</div>

                                                        {/* <div className="mb-3 form-check form-switch mt-2">
                            <input className="form-check-input" name="contacts_per_campaign" type="checkbox" id="contacts_per_campaign" />
                            <label className="form-check-label" for="contacts_per_campaign">Does this campaign have contacts per campaign?</label>
                          </div> */}
                                                        <div id="div_contacts_per_campaign mt-2" style={{ display: 'block' }}>
                                                            <div className="row">
                                                                <div className="mb-3 col-md-6" id="div_abm_cpc" style={{ display: 'bkock' }}>
                                                                    <label for="abm_cpc" className="form-label">ABM CPC</label> <span className="text-danger"> *</span>
                                                                    <select id="abm_cpc" value={formData.abmCpc} onChange={handleChange} name="abmCpc" className="form-select">
                                                                        <option value="">--Select--</option>
                                                                        <option value="Company">Company</option>
                                                                        <option value="Domain">Domain</option>
                                                                        <option value="State">State</option>
                                                                        <option value="Zipcode">Zipcode</option>
                                                                    </select>
                                                                </div>
                                                                <div className="mb-3 col-md-6" id="div_non_abm_cpc" style={{ display: 'block' }}>
                                                                    <label for="non_abm_cpc" className="form-label">Non ABM CPC</label> <span className="text-danger"> *</span>
                                                                    <select id="non_abm_cpc" value={formData.nonAbmCpc} onChange={handleChange} name="nonAbmCpc" className="form-select">
                                                                        <option value="">--Select--</option>
                                                                        <option value="Company">Company</option>
                                                                        <option value="Domain">Domain</option>
                                                                        <option value="Zipcode">Zipcode</option>
                                                                    </select>
                                                                </div>
                                                                <div className="mb-3 col-md-6 client_select">
                                                                    <label for="no_of_contacts" className="form-label">No Of Contacts</label> <span className="text-danger"> *</span>
                                                                    <input className="form-control" value={formData.noOfContacts} onChange={handleChange} type="number" placeholder="100" name="noOfContacts" id="no_of_contacts" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* five part */}

                                                    {/* <div className="text-center py-2 bg-light">Data Filter</div> */}
                                                    <div id="div_data_filter" >
                                                        <div className="row">


                                                            {/* seven part */}
                                                            <div id="div_additional_questions" >
                                                                {/* <div className="text-center py-2 bg-light">Save</div> */}
                                                                <button className="btn btn-outline-danger w-100 mt-2">
                                                                    Update Campaign
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UpdateCampaign
