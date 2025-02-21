import React, { useState, useMemo } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import Avatar from "../assets/man.webp";

function Chatbot() {
    // State to track answered questions
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    const handleEnd = ({ steps, values }) => {

    };

    // Memoizing the getOptions function
    const getOptions = useMemo(() => {
        const allOptions = [
            { value: 'uploadFile', label: 'How to upload RA Team File?', trigger: '6' },
            { value: 'checkStatus', label: 'How to check status?', trigger: '8' },
            { value: 'uploadQualityCheckedFile', label: 'How to upload Quality Checked file?', trigger: '10' },
            { value: 'updateCampaignStatus', label: 'How to update Campaign status?', trigger: '11' },
            { value: 'loginCRM', label: 'How to login to this CRM?', trigger: '12' },
            { value: 'uploadEMCheckedFile', label: 'How to upload EM Checked file?', trigger: '13' },
        ];

        return allOptions.filter(option => !answeredQuestions.includes(option.value));
    }, [answeredQuestions]);

    // Memoizing the steps to prevent unnecessary re-renders
    const steps = useMemo(() => [
        {
            id: '1',
            message: 'Welcome to the Lead Generation Campaign Support!',
            trigger: '2',
        },
        {
            id: '2',
            message: 'What is your name?',
            trigger: '3',
        },
        {
            id: '3',
            user: true,
            trigger: '4',
        },
        {
            id: '4',
            message: 'Hi {previousValue}, how can I assist you today?',
            trigger: '5',
        },
        {
            id: '5',
            options: getOptions,
        },
        {
            id: '6',
            message: 'To upload the RA Team File, follow these steps: Click RPF File -> RA Team -> PreQA.',
            trigger: '7',
        },
        {
            id: '10',
            message: 'To upload the Quality Checked file, follow these steps: Click RPF Files -> Quality Team -> Quality Checked.',
            trigger: '7',
        },
        {
            id: '7',
            message: 'Please confirm with your manager or team lead before uploading the file..',
            trigger: () => {
                const updatedAnsweredQuestions = [...answeredQuestions];
                if (!updatedAnsweredQuestions.includes('uploadFile') && steps[5].trigger === '6') {
                    updatedAnsweredQuestions.push('uploadFile');
                } else if (!updatedAnsweredQuestions.includes('uploadQualityCheckedFile') && steps[5].trigger === '10') {
                    updatedAnsweredQuestions.push('uploadQualityCheckedFile');
                } else if (!updatedAnsweredQuestions.includes('checkStatus') && steps[5].trigger === '8') {
                    updatedAnsweredQuestions.push('checkStatus');
                } else if (!updatedAnsweredQuestions.includes('updateCampaignStatus') && steps[5].trigger === '11') {
                    updatedAnsweredQuestions.push('updateCampaignStatus');
                } else if (!updatedAnsweredQuestions.includes('loginCRM') && steps[5].trigger === '12') {
                    updatedAnsweredQuestions.push('loginCRM');
                } else if (!updatedAnsweredQuestions.includes('uploadEMCheckedFile') && steps[5].trigger === '13') {
                    updatedAnsweredQuestions.push('uploadEMCheckedFile');
                }

                setAnsweredQuestions(updatedAnsweredQuestions);
                return '5'; // Show the options again
            }
        },
        {
            id: '8',
            message: 'To check the status, follow these steps: Click RPF File -> RA Team -> PreQA All.',
            trigger: '7',
        },
        // New Campaign Status Question
        {
            id: '11',
            message: 'To update the Campaign status, follow these steps: Click Campaigns -> Your Campaigns -> All Campaigns.',
            trigger: '7',
        },
        // New CRM Login Question
        {
            id: '12',
            message: 'To log in to the CRM, fill out the login form with your details, submit, and an OTP will be sent to your registered email. Enter the OTP and click submit to access your account.',
            trigger: '7',
        },
        // New EM Checked File Upload Question
        {
            id: '13',
            message: 'To upload the EM Checked file, follow these steps: Click RPF Files -> Email Team -> Email Checked.',
            trigger: '7',
        },
        {
            id: '9',
            message: 'Thank you for using the support bot! Have a great day!',
            end: true,
        },
    ], [answeredQuestions, getOptions]);

    // Creating our own theme
    const theme = {
        background: '#FEFAE0',
        headerBgColor: '#7E60BF',
        headerFontSize: '20px',
        botBubbleColor: '#8967B3',
        headerFontColor: 'white',
        botFontColor: 'white',
        userBubbleColor: '#6A9AB0',
        userFontColor: 'white',
    };

    // Set some properties of the bot
    const config = {
        botAvatar: Avatar,
        floating: true,
        handleEnd: handleEnd,
    };

    return (
        <div className="chatbot-wrapper">
            <ThemeProvider theme={theme}>
                <ChatBot
                    headerTitle="Chatbot"
                    steps={steps}
                    {...config}
                />
            </ThemeProvider>
        </div>
    );
}

export default Chatbot;
