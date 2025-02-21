import { configureStore } from "@reduxjs/toolkit";
import ClientSlice from "../reducer/billing/ClientSlice";
import clientDetailsSlice from "../reducer/billing/ViewClientDetails";
import userSlice from "../reducer/registeruser/Register";
import authSlice from "../reducer/registeruser/Login";
import otpSlice from "../reducer/registeruser/OtpVerify";
import rootReducer from "../reducer/createcampaign/CreateNewCampaign";
import campaignsSlice from "../reducer/createcampaign/GetCampaignData";
import templateSlice from "../reducer/createteplate/CreateNewTemplate";
import viewTemplateSlice from "../reducer/createteplate/GetTemplate";
import templateSliceById from "../reducer/createteplate/ViewTemplateById";
import fileUploadReducer from "../reducer/rpf/uploadcsvbyemploy";
import fileDataReducer from "../reducer/rpf/getcsvfiledata";
import fileUploadSliceCsvByOperation from "../reducer/rpf/operationcsvupload";
import rfpReducer from "../reducer/rpf/operatilallfile";
import invoiceReducer from "../reducer/billing/GetInvoice";
import invoiceSlicebyid from "../reducer/billing/GetInvoiceFromId";
import ramasterFileUploadSlice from "../reducer/rpf/ramasterupload";
import raMasterFileReducer from "../reducer/rpf/ramasterdataget";
import qualitycheckedfileUploadReducer from "../reducer/rpf/qualitychecked";
import qualityCheckedCsvReducer from "../reducer/rpf/getQualitycheckedData";
import CsvsliceByQualityChecked from "../reducer/rpf/getQualitycheckedData";
import qualityMasterFileUploadReducer from "../reducer/rpf/uploadqualitymaster";
import CsvsliceByQualityMaster from "../reducer/rpf/getQualityMasterData";
import uploadEmailCheckedReducer from "../reducer/rpf/uploadEmailChecked";
import csvFilesReducer from "../reducer/rpf/getEmCheckData";
import emmasterFileUploadReducer from "../reducer/rpf/uploadEmailmasterfile";
import CsvsliceByEMMaster from "../reducer/rpf/getEmMasterFileData";
import opmasterFileUploadReducer from "../reducer/rpf/operationMasterCsvFile";
import CsvsliceByOPMaster from "../reducer/rpf/getoperationMasterCsvFile";
import unwantedLeadsFileUploadReducer from "../reducer/rpf/unwantedLeads";
import CsvsliceByUnwantedLeads from "../reducer/rpf/getUnwantedLeads";
import userSessionReducer from "../reducer/registeruser/Logout";
import userReducer from "../reducer/registeruser/UserDetails"
import suprressionFileUploadReducer from '../reducer/rpf/uploadSuppression'
import suppressionsReducer from "../reducer/rpf/getsepparation";
import fileUploadSliceRatL from "../reducer/rpf/uploadratl";

const store = configureStore({
    reducer: {
        clients: ClientSlice,
        clientDetails: clientDetailsSlice,
        userRegister: userSlice,
        auth: authSlice,
        otp: otpSlice,
        reducer: rootReducer,
        campaigns: campaignsSlice,
        template: templateSlice,
        templates: viewTemplateSlice,
        templateId: templateSliceById,
        fileUpload: fileUploadReducer,
        fileData: fileDataReducer,
        operationFileUpload: fileUploadSliceCsvByOperation,
        files: fileUploadSliceCsvByOperation,
        rfp: rfpReducer,
        invoices: invoiceReducer,
        invoice: invoiceSlicebyid,
        ramasterfileUpload: ramasterFileUploadSlice,
        raFileUpload: raMasterFileReducer,
        qualitycheckedfileUpload: qualitycheckedfileUploadReducer,
        qualityCheckedCsv: qualityCheckedCsvReducer,
        csvFileCheckedbyQualityChecked: CsvsliceByQualityChecked,
        qualityMasterFileUpload: qualityMasterFileUploadReducer,
        csvFileCheckedbyQualityMaster: CsvsliceByQualityMaster,
        emailCheckedFileUpload: uploadEmailCheckedReducer,
        csvFileCheckedbyEMChecked: csvFilesReducer,
        emmasterFileUpload: emmasterFileUploadReducer,
        csvFileCheckedbyEMMaster: CsvsliceByEMMaster,
        opmasterFileUpload: opmasterFileUploadReducer,
        csvFileCheckedbyOPMaster: CsvsliceByOPMaster,
        unwantedLeadsFileUpload: unwantedLeadsFileUploadReducer,
        csvFileCheckedbyUnwantedLeads: CsvsliceByUnwantedLeads,
        user: userReducer,
        userSession: userSessionReducer,
        suprressionFileUpload: suprressionFileUploadReducer,
        suppressions: suppressionsReducer,
        fileUploadtl: fileUploadSliceRatL,
    },
});

export default store;