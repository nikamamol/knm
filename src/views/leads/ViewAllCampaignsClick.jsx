import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaigns } from '../../redux/reducer/createcampaign/GetCampaignData';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';





const ViewAllCampaignsClick = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaigns, status, error } = useSelector((state) => state.campaigns);
  const [expanded, setExpanded] = useState('panel1');
  const [activeTab, setActiveTab] = useState('tele_marketing');
  const [campaignDate, setCampaigDate] = useState([])

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  useEffect(() => {
    if (campaigns && Array.isArray(campaigns)) {
      campaigns.forEach(campaign => {
        setCampaigDate(campaign.endDate); // Log endDate for each campaign
      });
    }
  }, [campaigns]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  const handleViewCampaign = (campaignId) => {
    navigate(`/campaigns/inhousecampaigns/campaigndetail/${campaignId}`);

  }
  return (

    <div>
      <Container fluid className='my-5 '>
        <Row className=''>
          <Col lg={3}>
          </Col>
          <Col lg={8}>
            <div className='bgColor rounded-3 shadow'>
              <h4 className='fw-bold py-3 ms-3 text_color'> All Campaign List</h4>
            </div>
            <div className='mt-3'>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className="border-0 mb-3">
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="rounded-4" style={{ backgroundColor: "#FFF1DB" }}>
                  <Typography>Completed Campaign</Typography>
                </AccordionSummary>
                <AccordionDetails className='border-0'>
                  <Typography>
                    <div className="container-xxl flex-grow-1 container-p-y">
                      <div className="list-group list-group-horizontal-md text-md-center">
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'tele_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('tele_marketing')}
                        >
                          Tele Marketing (0)
                        </a>
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'email_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('email_marketing')}
                        >
                          Email Marketing (0)
                        </a>
                      </div>
                      <div className="tab-content px-0 mt-3 card rounded-4 border-0 shadow p-4">
                        <div className={`tab-pane fade ${activeTab === 'tele_marketing' ? 'show active' : ''}`} id="tele_marketing">
                          <div className="row ms-3" id="div_ongoing_tele_marketing">
                            <div className="col-md-12">
                              <h3>Tele Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => (
                                  <Col md={4} key={campaign._id} className="mb-4">
                                    {campaign.campaignType === "Tele Marketing" && campaign.campaignStatus === "Completed" &&
                                      <Card className="shadow-sm h-100 border-0">
                                        <Card.Body>
                                          <Card.Title>{campaign.campaignName}</Card.Title>
                                          <Card.Text>
                                            <strong>Code:</strong> {campaign.campaignCode}<br />
                                            <strong>Type:</strong> {campaign.campaignType}<br />
                                            <strong>Status:</strong> {campaign.campaignStatus}<br />
                                            <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                            <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                          </Card.Text>
                                        </Card.Body>
                                        <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>
                                      </Card>
                                    }
                                  </Col>
                                ))}
                              </Row>

                            </div>
                          </div>
                        </div>
                        <div className={`tab-pane fade ${activeTab === 'email_marketing' ? 'show active' : ''}`} id="email_marketing">
                          <div className="row  ms-3" id="div_ongoing_email_marketing">
                            <div className="col-md-12">
                              <h3>Email Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => (
                                  <Col md={4} key={campaign._id} className="mb-4">
                                    {campaign.campaignType === "Email Marketing" && campaign.campaignStatus === "Completed" &&
                                      <Card className="shadow-sm h-100">
                                        <Card.Body>
                                          <Card.Title>{campaign.campaignName}</Card.Title>
                                          <Card.Text>
                                            <strong>Code:</strong> {campaign.campaignCode}<br />
                                            <strong>Type:</strong> {campaign.campaignType}<br />
                                            <strong>Status:</strong> {campaign.campaignStatus}<br />
                                            <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                            <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                          </Card.Text>
                                        </Card.Body>
                                        <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>
                                      </Card>
                                    }
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>


              <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className="border-0 mb-3">
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" className="rounded-4 border-0" style={{ backgroundColor: "#FFD3B6" }}>
                  <Typography>Active Campaign</Typography>
                </AccordionSummary>
                <AccordionDetails className='border-0'>
                  <Typography>
                    <div className="container-xxl flex-grow-1 container-p-y">
                      <div className="list-group list-group-horizontal-md text-md-center">
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'tele_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('tele_marketing')}
                        >
                          Tele Marketing (0)
                        </a>
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'email_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('email_marketing')}
                        >
                          Email Marketing (0)
                        </a>
                      </div>
                      <div className="tab-content px-0 mt-3 card rounded-4 p-4 border-0 shadow">
                        <div className={`tab-pane fade ${activeTab === 'tele_marketing' ? 'show active' : ''}`} id="tele_marketing">
                          <div className="row ms-3" id="div_ongoing_tele_marketing">
                            <div className="col-md-12">
                              <h3>Tele Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => (

                                  <Col md={4} key={campaign._id} className="mb-4">
                                    {campaign.campaignType === "Tele Marketing" && campaign.campaignStatus === "Active" &&
                                      <Card className="shadow-sm h-100">
                                        <Card.Body>
                                          <Card.Title>{campaign.campaignName}</Card.Title>
                                          <Card.Text>
                                            <strong>Code:</strong> {campaign.campaignCode}<br />
                                            <strong>Type:</strong> {campaign.campaignType}<br />
                                            <strong>Status:</strong> {campaign.campaignStatus}<br />
                                            <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                            <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                          </Card.Text>
                                        </Card.Body>
                                        <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>
                                      </Card>
                                    }
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          </div>
                        </div>
                        <div className={`tab-pane fade ${activeTab === 'email_marketing' ? 'show active' : ''}`} id="email_marketing">
                          <div className="row  ms-3" id="div_ongoing_email_marketing">
                            <div className="col-md-12">
                              <h3>Email Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => (
                                  <Col md={4} key={campaign._id} className="mb-4">
                                    {campaign.campaignType === "Email Marketing" && campaign.campaignStatus === "Active" &&
                                      <Card className="shadow-sm h-100">
                                        <Card.Body>
                                          <Card.Title>{campaign.campaignName}</Card.Title>
                                          <Card.Text>
                                            <strong>Code:</strong> {campaign.campaignCode}<br />
                                            <strong>Type:</strong> {campaign.campaignType}<br />
                                            <strong>Status:</strong> {campaign.campaignStatus}<br />
                                            <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                            <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                          </Card.Text>
                                        </Card.Body>
                                        <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>
                                      </Card>
                                    }
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className="border-0 mb-3">
                <AccordionSummary aria-controls="panel4d-content" id="panel4d-header" className="rounded-4 border-0" style={{ backgroundColor: "#F7E7DC" }}>
                  <Typography>New Campaign</Typography>
                </AccordionSummary>
                <AccordionDetails className='border-0'>
                  <Typography>
                    <div className="container-xxl flex-grow-1 container-p-y">
                      <div className="list-group list-group-horizontal-md text-md-center">
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'tele_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('tele_marketing')}
                        >
                          Tele Marketing (0)
                        </a>
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'email_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('email_marketing')}
                        >
                          Email Marketing (0)
                        </a>
                      </div>
                      <div className="tab-content px-0 mt-3 card rounded-4 p-4">
                        <div className={`tab-pane fade ${activeTab === 'tele_marketing' ? 'show active' : ''}`} id="tele_marketing">
                          <div className="row ms-3" id="div_ongoing_tele_marketing">
                            <div className="col-md-12">
                              <h3>Tele Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => (
                                  <Col md={4} key={campaign._id} className="mb-4">
                                    {campaign.campaignType === "Tele Marketing" && campaign.campaignStatus === "New" &&
                                      <Card className="shadow-sm h-100">
                                        <Card.Body>
                                          <Card.Title>{campaign.campaignName}</Card.Title>
                                          <Card.Text>
                                            <strong>Code:</strong> {campaign.campaignCode}<br />
                                            <strong>Type:</strong> {campaign.campaignType}<br />
                                            <strong>Status:</strong> {campaign.campaignStatus}<br />
                                            <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                            <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                          </Card.Text>
                                        </Card.Body>
                                        <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>
                                      </Card>
                                    }
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          </div>
                        </div>
                        <div className={`tab-pane fade ${activeTab === 'email_marketing' ? 'show active' : ''}`} id="email_marketing">
                          <div className="row  ms-3" id="div_ongoing_email_marketing">
                            <div className="col-md-12">
                              <h3>Email Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => (
                                  <Col md={4} key={campaign._id} className="mb-4">
                                    {campaign.campaignType === "Email Marketing" && campaign.campaignStatus === "New" &&
                                      <Card className="shadow-sm h-100">
                                        <Card.Body>
                                          <Card.Title>{campaign.campaignName}</Card.Title>
                                          <Card.Text>
                                            <strong>Code:</strong> {campaign.campaignCode}<br />
                                            <strong>Type:</strong> {campaign.campaignType}<br />
                                            <strong>Status:</strong> {campaign.campaignStatus}<br />
                                            <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                            <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                          </Card.Text>
                                        </Card.Body>
                                        <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>

                                      </Card>
                                    }
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className="border-0 mb-3">
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" className="rounded-4 border-0" style={{ backgroundColor: "#EECEB9" }}>
                  <Typography>Expired Campaign</Typography>
                </AccordionSummary>
                <AccordionDetails className='border-0'>
                  <Typography>
                    <div className="container-xxl flex-grow-1 container-p-y">
                      <div className="list-group list-group-horizontal-md text-md-center">
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'tele_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('tele_marketing')}
                        >
                          Tele Marketing (0)
                        </a>
                        <a
                          className={`list-group-item list-group-item-action ${activeTab === 'email_marketing' ? 'active' : ''}`}
                          onClick={() => handleTabClick('email_marketing')}
                        >
                          Email Marketing (0)
                        </a>
                      </div>
                      <div className="tab-content px-0 mt-3 card rounded-4 border-0 shadow p-4">
                        <div className={`tab-pane fade ${activeTab === 'tele_marketing' ? 'show active' : ''}`} id="tele_marketing">
                          <div className="row ms-3" id="div_ongoing_tele_marketing">
                            <div className="col-md-12">
                              <h3>Tele Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => {
                                  const isExpired = new Date(campaign.endDate) < new Date();
                                  return (
                                    campaign.campaignType === "Tele Marketing" && isExpired  && (
                                      <Col md={4} key={campaign._id} className="mb-4">
                                        <Card className="shadow-sm h-100">
                                          <Card.Body>
                                            <Card.Title>{campaign.campaignName}</Card.Title>
                                            <Card.Text>
                                              <strong>Code:</strong> {campaign.campaignCode}<br />
                                              <strong>Type:</strong> {campaign.campaignType}<br />
                                              <strong>Status:</strong> {campaign.campaignStatus}<br />
                                              <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                              <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                            </Card.Text>
                                          </Card.Body>
                                          <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>
                                        </Card>
                                      </Col>
                                    )
                                  );
                                })}
                              </Row>
                            </div>
                          </div>
                        </div>
                        <div className={`tab-pane fade ${activeTab === 'email_marketing' ? 'show active' : ''}`} id="email_marketing">
                          <div className="row ms-3" id="div_ongoing_email_marketing">
                            <div className="col-md-12">
                              <h3>Email Marketing Campaigns</h3>
                              <Row>
                                {campaigns.map((campaign) => {
                                  const isExpired = new Date(campaign.endDate) < new Date();
                                  return (
                                    campaign.campaignType === "Email Marketing" && isExpired && (
                                      <Col md={4} key={campaign._id} className="mb-4">
                                        <Card className="shadow-sm h-100">
                                          <Card.Body>
                                            <Card.Title>{campaign.campaignName}</Card.Title>
                                            <Card.Text>
                                              <strong>Code:</strong> {campaign.campaignCode}<br />
                                              <strong>Type:</strong> {campaign.campaignType}<br />
                                              <strong>Status:</strong> {campaign.campaignStatus}<br />
                                              <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}<br />
                                              <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}<br />
                                            </Card.Text>
                                          </Card.Body>
                                          <button className='btn btn-info' onClick={() => handleViewCampaign(campaign._id)}>View Campaign</button>
                                        </Card>
                                      </Col>
                                    )
                                  );
                                })}
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>

            </div>
          </Col>
        </Row>
      </Container>
    </div>

  );
}

export default ViewAllCampaignsClick;