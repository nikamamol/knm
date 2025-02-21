import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Button, Card } from 'react-bootstrap';
import EmailEditor from 'react-email-editor';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link, useNavigate } from 'react-router-dom';
import { createTemplate } from '../redux/reducer/createteplate/CreateNewTemplate';
import { toast } from 'react-toastify';



const TemplateOne = () => {
    const navigate = useNavigate()
    const emailEditorRef = useRef(null);
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.template);

    const [savedHtml, setSavedHtml] = useState(null);
    const [formType, setFormType] = useState('0');
    const [logoPreview, setLogoPreview] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const [documentPreview, setDocumentPreview] = useState('');
    const [formLink, setFormLink] = useState('');
    const [formData, setFormData] = useState({
        template_title: '',
        logo: '',
        banner: '',
        form_type: '0',
        form_link: '',
        receive_comminication: '',
        document: '',
        html_content: ''
    });
    const [isHtmlSaved, setIsHtmlSaved] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleFormTypeChange = (e) => {
        setFormType(e.target.value);
        setFormData({ ...formData, form_type: e.target.value });
    };

    const handleFileChange = (e, setter, field) => {
        const file = e.target.files[0];
        if (file) {
            setter(URL.createObjectURL(file));
            setFormData({ ...formData, [field]: file.name });
        }
    };

   
    const saveTemplate = () => {
        return new Promise((resolve) => {
            emailEditorRef.current.editor.exportHtml((data) => {
                const { design, html } = data;
                setSavedHtml(html);
                setFormData((prevData) => ({
                    ...prevData,
                    html_content: html
                }));
                setIsHtmlSaved(true);
                // console.log('Template saved', design);
                resolve(html);
            });
        });
    };



    const handleSubmit = async () => {


        try {
            // Save the template before submission
            const html = await saveTemplate();

            // Ensure that the HTML content is set in formData
            setFormData((prevData) => ({
                ...prevData,
                html_content: html
            }));

            // Dispatch the action to create the template
            await dispatch(createTemplate({
                ...formData,
                html_content: html // Ensure latest HTML content is used
            }));

            // Show success toast
            toast.success('Template successfully created');
            navigate('/landingpages/viewalllandingpages');


            // Clear all input fields after submission
            clearForm();
        } catch (error) {
            // console.error('Error submitting template:', error.message);
            toast.error('Error creating template');
        }
    };

    const clearForm = () => {
        setFormData({
            template_title: '',
            logo: '',
            banner: '',
            form_type: '0',
            form_link: '',
            receive_comminication: '',
            document: '',
            html_content: ''
        });
        setLogoPreview('');
        setBannerPreview('');
        setDocumentPreview('');
        setFormLink('');
        setSavedHtml(null);
        setIsHtmlSaved(false);
        setFormErrors({});
    };



    const onLoad = () => {
        // Use emailEditorRef.current.editor.loadDesign(savedDesign) if you have a design to load
    };

    const onReady = () => {
        // console.log('onReady');
    };

    // const handleFormLinkChange = (e) => {
    //     const value = e.target.value;
    //     setFormLink(value);
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         form_link: value
    //     }));
    // };

    return (
        <div>
            <Container fluid className='my-5'>
                <Row>
                    <Col lg={12}>
                        <div>
                            <Link to='/dashboard' className='btn btn-outline-danger my-4 btn-sm'>
                                <KeyboardBackspaceIcon className='me-2' />Back to Dashboard
                            </Link>
                        </div>
                        <div className='bgColor rounded-3 shadow'>
                            <h4 className='fw-bold py-3 ms-3 text_color'>Create Landing Page Template</h4>
                        </div>
                        <div className="row">
                            <div className="col-xxl">
                                <div className="card mb-4">
                                    <div className="card-header p-3 d-flex align-items-center justify-content-between">
                                        <small className="text-muted float-end">Fields marked <span className="text-danger">*</span> are mandatory</small>
                                    </div>
                                    <div className="card-body">
                                        <div className="card mb-4">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="mb-3 col-md-6">
                                                        <label htmlFor="template_title" className="form-label">Title/Header<span className="text-danger">*</span></label>
                                                        <input type="text" name="template_title" className="form-control" id="template_title" placeholder="Beyond on-demand for DDoS defense" onChange={(e) => setFormData({ ...formData, template_title: e.target.value })} />
                                                        {formErrors.template_title && <div className="text-danger">{formErrors.template_title}</div>}
                                                    </div>
                                                    {/* <div className="mb-3 col-md-6">
                                                        <label htmlFor="logo" className="form-label">Logo</label> (.png, .jpeg, .jpg, .svg) 200px × 74 px <span className="text-danger"> *</span>
                                                        {logoPreview && <a href={logoPreview} target="_blank" id="view_logo">View Logo</a>}
                                                        <input className="form-control" type="file" id="logo" name="logo" accept=".png, .jpeg, .jpg, .svg" onChange={(e) => handleFileChange(e, setLogoPreview, 'logo')} />
                                                        {formErrors.logo && <div className="text-danger">{formErrors.logo}</div>}
                                                    </div> */}
                                                    {/* <div className="mb-3 col-md-6">
                                                        <label htmlFor="banner" className="form-label">Banner Image</label> (.png, .jpeg, .jpg) 1170px × 267 px <span className="text-danger"> *</span>
                                                        {bannerPreview && <a href={bannerPreview} target="_blank" id="view_banner">View Banner</a>}
                                                        <input className="form-control" type="file" id="banner" name="banner" accept=".png, .jpeg, .jpg" onChange={(e) => handleFileChange(e, setBannerPreview, 'banner')} />
                                                        {formErrors.banner && <div className="text-danger">{formErrors.banner}</div>}
                                                    </div> */}
                                                    {/* {formType === '0' && (
                                                        <div className="mb-3 col-md-6">
                                                            <label htmlFor="form_link" className="form-label">Client Form Link</label>
                                                            <span className="text-danger"> *</span>
                                                            <input className="form-control" type="text" placeholder="" name="form_link" id="form_link" value={formLink} onChange={handleFormLinkChange} />
                                                            {formErrors.form_link && <div className="text-danger">{formErrors.form_link}</div>}
                                                        </div>
                                                    )} */}
                                                    {/* <div className="mb-3 col-md-6">
                                                        <label htmlFor="receive_comminication" className="form-label">Receive marketing communications</label>
                                                        <span className="text-danger"> *</span>
                                                        <input className="form-control" type="text" placeholder="I agree to receive marketing communications" name="receive_comminication" id="receive_comminication" onChange={(e) => setFormData({ ...formData, receive_comminication: e.target.value })} />
                                                        {formErrors.receive_comminication && <div className="text-danger">{formErrors.receive_comminication}</div>}
                                                    </div> */}
                                                    {/* <div className="mb-3 col-md-6">
                                                        <label htmlFor="document" className="form-label">Document</label> (.pdf, .docx) <span className="text-danger"> *</span>
                                                        {documentPreview && <a href={documentPreview} target="_blank" id="view_document">View Document</a>}
                                                        <input className="form-control" type="file" id="document" name="document" accept=".pdf, .docx" onChange={(e) => handleFileChange(e, setDocumentPreview, 'document')} />
                                                        {formErrors.document && <div className="text-danger">{formErrors.document}</div>}
                                                    </div> */}
                                                </div>
                                                <div>
                                                    <label htmlFor="html_content" className="form-label">Create Template</label>
                                                    <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
                                                </div>
                                                <div className='my-3 d-flex gap-2'>
                                                    <Link className='btn btn-danger' to='/landingpages/viewalllandingpages'>View All Template</Link>
                                                    <Button className='btn btn-success' onClick={handleSubmit} disabled={loading}>Save Template</Button>
                                                </div>
                                                {error && <div className="text-danger">{error}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TemplateOne;
