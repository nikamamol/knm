import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeadNavbar from "./components/HeadNavbar";
const MainDashboard = lazy(() => import('../src/views/MainDashboard'));
const AddUser = lazy(() => import("../src/views/userdetails/AddUser"));
const VieweUser = lazy(() => import("../src/views/userdetails/VieweUser"));
const Attendance = lazy(() => import("../src/views/userdetails/Attendance"));
const Expired = lazy(() => import("../src/views/rfp/Expired"));
const OperationCheck = lazy(() => import("../src/views/rfp/OperationCheck"));
const Received = lazy(() => import("../src/views/rfp/Received"));
const MyEnterprise = lazy(() => import("../src/views/enterprise/MyEnterprise"));
const InviteEnterprise = lazy(() => import("../src/views/enterprise/InviteEnterprise"));
const InviteAgencies = lazy(() => import("../src/views/agency/InviteAgencies"));
const MyEngencies = lazy(() => import("../src/views/agency/MyEngencies"));
// billing
const AddClient = lazy(() => import("../src/views/billing/AddClient"));
const CreateInvoice = lazy(() => import("../src/views/billing/CreateInvoice"));
const InvoiceSetting = lazy(() => import("../src/views/billing/InvoiceSetting"));
const ProcessPayment = lazy(() => import("../src/views/billing/ProcessPayment"));
const VieweClient = lazy(() => import("../src/views/billing/VieweClient"));
const ViewInvoice = lazy(() => import("../src/views/billing/ViewInvoice"));
import { registerLicense } from '@syncfusion/ej2-base';

// Support views
const Emails = lazy(() => import("../src/views/support/Emails"));
const OnlineChat = lazy(() => import("../src/views/support/OnlineChat"));

// Settings views
const IpWhiteList_BlockList = lazy(() => import("../src/views/settings/IpWhiteList_BlockList"));

// Library views
const VoiceLibrary = lazy(() => import("../src/views/library/VoiceLibrary"));

// Campaigns - Agency views
const ActiveCampaigns = lazy(() => import("../src/views/leads/agency/ActiveCampaigns"));
const AllCampaigns = lazy(() => import("../src/views/leads/agency/AllCampaigns"));
const ClosedCampaigns = lazy(() => import("../src/views/leads/agency/ClosedCampaigns"));
const PausedCampaigns = lazy(() => import("../src/views/leads/agency/PausedCampaigns"));

// Campaigns - Inhouse views
const ActiveCampaignsIn = lazy(() => import("../src/views/leads/inhousecampaign/ActiveCampaignsIn"));
const AllCampaignsIn = lazy(() => import("../src/views/leads/inhousecampaign/AllCampaignsIn"));
const ClosedCampaignsIn = lazy(() => import("../src/views/leads/inhousecampaign/ClosedCampaignsIn"));
const PausedCampaignsIn = lazy(() => import("../src/views/leads/inhousecampaign/PausedCampaignsIn"));
const CreateCampaign = lazy(() => import("../src/views/leads/inhousecampaign/CreateCampaign"));

// Campaigns - Enterprises views
const ActiveCampaignsEn = lazy(() => import("../src/views/leads/enterprises/ActiveCampaignsEn"));
const AllCampaignsEn = lazy(() => import("../src/views/leads/enterprises/AllCampaignsEn"));
const ClosedCampaignsEn = lazy(() => import("../src/views/leads/enterprises/ClosedCampaignsEn"));
const PausedCampaignsEn = lazy(() => import("../src/views/leads/enterprises/PausedCampaignsEn"));

// User details
const Profile = lazy(() => import("./views/userdetails/Profile"));
const ViewAllCampaignsClick = lazy(() => import("./views/leads/ViewAllCampaignsClick"));
const Login = lazy(() => import('../src/userloginsignup/Login'));
const Register = lazy(() => import('../src/userloginsignup/Register'));
const OtpInput = lazy(() => import('../src/userloginsignup/OtpInput'));

// Landing page views
const NewLandingPage = lazy(() => import('../src/views/landingpages/NewLandingPage'));
const ViewLandingPages = lazy(() => import('../src/views/landingpages/ViewLandingPages'));

// Templates
const TemplateOne = lazy(() => import('./template/TemplateOne'));
const TemplateTwo = lazy(() => import('./template/TemplateTwo'));
const TemplateThree = lazy(() => import('./template/TemplateThree'));
import PrivateRoutes from './utils/PrivateRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// User details
const UserDetailsByID = lazy(() => import('./views/userdetails/UserDetailsByID'));

// Agency details
const ViewAgencyDetailsById = lazy(() => import('./views/agency/ViewAgencyDetailsById'));

// Billing views
const ViewClientDetailsId = lazy(() => import('./views/billing/ViewClientDetailsId'));
const CreateNewInvoice = lazy(() => import('./views/billing/CreateNewInvoice'));
const ViewInvoiceById = lazy(() => import('./views/billing/ViewInvoiceById'));

// Campaign details
const ViewCampaignDetails = lazy(() => import('./views/leads/inhousecampaign/ViewCampaignDetails'));
const NewInHouseCamp = lazy(() => import('./views/leads/inhousecampaign/NewInHouseCamp'));
const ExpiredCampaignIn = lazy(() => import('./views/leads/inhousecampaign/ExpiredCampaignIn'));
const InHouseCompletedCampaign = lazy(() => import('./views/leads/inhousecampaign/InHouseCompletedCampaign'));
const UpdateCampaign = lazy(() => import('./views/leads/inhousecampaign/UpdateCampaign'));

// Landing page description
const ViewLandingPageDesciption = lazy(() => import("./views/landingpages/ViewLandingPageDesciption"));

// RFP views
const RecivedAll = lazy(() => import('./views/rfp/RecivedAll'));
const QualityCheck = lazy(() => import('./views/rfp/QualityCheck'));
const EmailCheck = lazy(() => import('./views/rfp/EmailCheck'));
const OperationChecked = lazy(() => import('./views/rfp/OperationChecked'));
const RAMaster = lazy(() => import('./views/rfp/RAMaster'));
const QualityChecked = lazy(() => import('./views/rfp/QualityChecked'));
const QualityMaster = lazy(() => import('./views/rfp/QualityMaster'));
const QualityDoneShowEmail = lazy(() => import('./views/rfp/QualityDoneShowEmail'));
const EMChecked = lazy(() => import('./views/rfp/EMChecked'));
const EMDoneShowQuality = lazy(() => import('./views/rfp/EMDoneShowQuality'));
const EMMasterFile = lazy(() => import('./views/rfp/EMMasterFile'));
const OperationMaster = lazy(() => import('./views/rfp/OperationMaster'));
const UnwantedLeads = lazy(() => import('./views/rfp/UnwantedLeads'));
const EmailCheckedShowDelivery = lazy(() => import('./views/rfp/EmailCheckedShowDelivery'));
const QualitycheckedShowDelivery = lazy(() => import('./views/rfp/QualitycheckedShowDelivery'));
const TalSuppressionFile = lazy(() => import('./views/rfp/TalSuppressionFile'));
import Loading from "./assets/Loading.gif"
import Createassets from './views/rfp/benchmark/Createassets';
import ViewAsset from './views/rfp/benchmark/ViewAsset';
import Calendar from './table/Calender';
import Preqatlview from './views/rfp/Preqatlview';
// Other components
const Chatbot = lazy(() => import('./components/Chatboat'));



const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/register', '/template-1', '/enterotp'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <HeadNavbar />}
      {children}
    </>
  );
};

// Register the Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhAYVF/WmFZfVpgd19HZlZTQWYuP1ZhSXxXdk1gWX9dcXJXQGZeU0w=');

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Layout>
        <Chatbot />
        <Suspense fallback={<div className='d-flex justify-content-center align-items-center vh-100'>
          <img src={Loading} alt="Loading.." />
        </div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/enterotp" element={<OtpInput />} />
            {/* all route are private */}
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<MainDashboard />} />
              <Route path="/viewallcampaignsclick" element={<ViewAllCampaignsClick />} />
              <Route path="/viewpage/:id" element={<ViewLandingPageDesciption />} />
              {/* landing pages */}
              <Route path="/landingpages/createlandingpage" element={<NewLandingPage />} />
              <Route path="/landingpages/viewalllandingpages" element={<ViewLandingPages />} />
              <Route path="/template-1" element={<TemplateOne />} />
              <Route path="/template-2" element={<TemplateTwo />} />
              <Route path="/template-3" element={<TemplateThree />} />

              {/* user */}
              <Route path="/user/addUser" element={<AddUser />} />
              <Route path="/user/viewUser" element={<VieweUser />} />
              <Route path="/user/attendance" element={<Attendance />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/:id" element={<UserDetailsByID />} />
              {/* RFP */}
              <Route path="/rfp/operatinfinalcheck" element={<OperationCheck />} />
              <Route path="/rfp/tal-suppress-files" element={<TalSuppressionFile />} />
              <Route path="/rfp/expired" element={<Expired />} />
              <Route path="/rfp/received" element={<Received />} />
              <Route path="/rfp/preqatl" element={<Preqatlview />} />
              <Route path="/rfp/receivedall" element={<RecivedAll />} />
              <Route path="/rfp/qualitycheck" element={<QualityCheck />} />
              <Route path="/rfp/emailcheck" element={<EmailCheck />} />
              <Route path="/rfp/operationallcheckedfiles" element={<OperationChecked />} />
              <Route path="/rfp/receivedmaster" element={<RAMaster />} />
              <Route path="/rfp/qualitychecked" element={<QualityChecked />} />
              <Route path="/rfp/qualitymaster" element={<QualityMaster />} />
              <Route path="/rfp/qualitydoneshowemail" element={<QualityDoneShowEmail />} />
              <Route path="/rfp/emcheckedfilesand_upload" element={<EMChecked />} />
              <Route path="/rfp/emdoneshowquality" element={<EMDoneShowQuality />} />
              <Route path="/rfp/emmasterfile" element={<EMMasterFile />} />
              <Route path="/rfp/operationmaster" element={<OperationMaster />} />
              <Route path="/rfp/unwantedleads" element={<UnwantedLeads />} />
              <Route path="/rfp/emailcheckedshowdelivery" element={<EmailCheckedShowDelivery />} />
              <Route path="/rfp/qualitydonefiles" element={<QualitycheckedShowDelivery />} />
              {/* <Route path="/rfp/qualitymastertab" element={<QualityMasterTab />} /> */}
              {/* Agency */}
              <Route path="/agency/myengencies" element={<MyEngencies />} />
              <Route path="/agency/inviteagency" element={<InviteAgencies />} />
              <Route path="/agency/viewAgencyDetails/:id" element={<ViewAgencyDetailsById />} />
        
              {/* enterprise */}
              <Route path="/enterprise/MyEnterprise" element={<MyEnterprise />} />
              <Route path="/enterprise/inviteEnterprise" element={<InviteEnterprise />} />
              {/* campaign/agency */}
              <Route path="/campaigns/agency/activecampaigns" element={<ActiveCampaigns />} />
              <Route path="/campaigns/agency/allCampaigns" element={<AllCampaigns />} />
              <Route path="/campaigns/agency/closedCampaigns" element={<ClosedCampaigns />} />
              <Route path="/campaigns/agency/pausedCampaigns" element={<PausedCampaigns />} />
              {/* campaign/Enterprise */}
              <Route path="/campaigns/enterprises/activecampaigns" element={<ActiveCampaignsEn />} />
              <Route path="/campaigns/enterprises/allCampaigns" element={<AllCampaignsEn />} />
              <Route path="/campaigns/enterprises/closedCampaigns" element={<ClosedCampaignsEn />} />
              <Route path="/campaigns/enterprises/pausedCampaigns" element={<PausedCampaignsEn />} />
              {/* campaign/inhouse */}
              <Route path="/campaigns/inhousecampaigns/activecampaigns" element={<ActiveCampaignsIn />} />
              <Route path="/campaigns/inhousecampaigns/allCampaigns" element={<AllCampaignsIn />} />
              <Route path="/campaigns/inhousecampaigns/closedCampaigns" element={<ClosedCampaignsIn />} />
              {/* <Route path="/campaigns/inhousecampaigns/pausedCampaigns" element={<PausedCampaignsIn />} /> */}
              <Route path="/campaigns/inhousecampaigns/createCampaign" element={<CreateCampaign />} />
              <Route path="/campaigns/inhousecampaigns/expiredcampaigns" element={<ExpiredCampaignIn />} />
              <Route path="/campaigns/inhousecampaigns/completedcampaign" element={<InHouseCompletedCampaign />} />
              <Route path="/campaigns/inhousecampaigns/inhousenewcampaign" element={<NewInHouseCamp />} />
              <Route path="/campaigns/inhousecampaigns/campaigndetail/:id" element={<ViewCampaignDetails />} />
              <Route path="/campaigns/inhousecampaigns/updateCampaignById/:id" element={<UpdateCampaign />} />

              {/* billing */}
              <Route path="/billing/addClient" element={<AddClient />} />
              <Route path="/billing/createInvoice" element={<CreateInvoice />} />
              <Route path="/billing/invoiceSetting" element={<InvoiceSetting />} />
              <Route path="/billing/processPayment" element={<ProcessPayment />} />
              <Route path="/billing/vieweClient" element={<VieweClient />} />
              <Route path="/billing/viewClient/:id" element={<ViewClientDetailsId />} />
              <Route path="/billing/viewInvoice" element={<ViewInvoice />} />
              <Route path="/billing/createnewinvoice" element={<CreateNewInvoice />} />
              <Route path="/billing/ViewInvoiceById/:id" element={<ViewInvoiceById />} />
              <Route path="/benchmark/createassets" element={<Createassets />} />
              {/* support */}
              <Route path="/support/chat" element={<Emails />} />
              <Route path="/support/onlinechat" element={<OnlineChat />} />
              {/* settings */}
              <Route path="/settings/ipwhitelist_blocklist" element={<IpWhiteList_BlockList />} />
              {/* library */}
              <Route path="/library/voiceLibrary" element={<VoiceLibrary />} />

              {/* start 03022025 */}
              <Route path="/benchmark/viewbenchmarkAsset/:id" element={<ViewAsset />} />
              <Route path="/user/calender" element={<Calendar />} />

            </Route>
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
