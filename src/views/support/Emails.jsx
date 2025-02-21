import React, { useState, useEffect, useRef } from 'react';
import { Col, Container, Row, Form, Button, Image, Card, Spinner } from 'react-bootstrap';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../../redux/reducer/registeruser/UserDetails';
import axios from 'axios';
import baseUrl from '../../constant/ConstantApi';
import io from 'socket.io-client'; // Import socket.io-client

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [socket, setSocket] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const messagesEndRef = useRef(null); // Ref to scroll to the bottom

  useEffect(() => {
    dispatch(fetchUserDetails());
    fetchMessages();

    const socketIo = io(baseUrl);
    setSocket(socketIo);

    socketIo.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [dispatch]);

 
  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${baseUrl}user/get_all_message`, {
        headers: { "authorization": `Bearer ${token}` },
      });

      const formattedMessages = response.data.map((message) => {
        const time = new Date(message.time);
        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return { ...message, time: formattedTime };
      });

      setMessages(formattedMessages.reverse()); // Reverse the messages to show the latest at the bottom
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = {
        text: input,
        sender: user?.username,
        time: formatTime(new Date()),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');
      setTyping(false);

      try {
        const formData = new FormData();
        formData.append('text', input);
        formData.append('sender', user?.username);
        formData.append('time', new Date().toISOString());
        if (file) {
          formData.append('file', file);
        }

        const response = await axios.post(`${baseUrl}user/message`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          fetchMessages();
        } else {
          console.error('Failed to send message:', response.data);
        }
      } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleReceiverMessage = () => {
  
    setMessages((prevMessages) => [...prevMessages]);
    setTyping(false);
  };

  const handleUploadFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadImage = () => {
    document.getElementById('fileInput').click();
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setTimeout(handleReceiverMessage, 2000);
    }
  }, [messages]);

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col lg={2}></Col>
        <Col lg={10}>
          <Row className="justify-content-center align-items-center vh-100 my-10">
            <Col xs={12} md={8} lg={12} className="d-flex flex-column h-100">
              <div className="d-flex align-items-center p-3 border-bottom bg-success text-white mt-5">
                <h3 className="mt-2">Chat Section</h3>
              </div>
              <Card className="shadow w-100 mt-10" style={{ height: '65%' }}>
                <Card.Body className="d-flex flex-column p-0 h-100">
                  {/* Messages Section */}
                  <div className="flex-grow-1 overflow-auto p-3 bg-light">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`d-flex align-items-start mb-3 ${message.sender === user?.username ? 'flex-row-reverse' : ''}`}
                      >
                        <Image
                          src="#"
                          roundedCircle
                          className={`me-2 ${message.sender === user?.username ? 'ms-2' : ''}`}
                        />
                        <div
                          className={`p-2 rounded ${message.sender === user?.username ? 'bg-info text-dark' : 'bg-white text-dark'}`}
                        >
                          <div className="d-flex justify-content-between">
                            <div className="small text-muted text-end me-5">{message.sender}</div>
                            <div className="small text-muted text-end">{message.time}</div>
                          </div>
                          {message.text}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {typing && (
                      <div className="d-flex align-items-center">
                        <Spinner animation="border" size="sm" className="me-2 text-success" />
                        <span className="text-success">Typing...</span>
                      </div>
                    )}

                    {/* Scroll to bottom */}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Footer (Input Section) */}
                  <div className="d-flex p-3 border-top bg-white align-items-center">
                    <Button
                      variant="light"
                      className="me-2 rounded-pill shadow-sm"
                      onClick={handleUploadFile}
                    >
                      <UploadFileIcon />
                    </Button>
                    <Button
                      variant="light"
                      className="me-2 rounded-pill shadow-sm"
                      onClick={handleUploadImage}
                    >
                      <ImageIcon />
                    </Button>

                    <Form.Control
                      as="textarea"
                      value={input}
                      placeholder="Type a message..."
                      onChange={(e) => setInput(e.target.value)}
                      className="me-2 rounded shadow-sm flex-grow-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // Prevents new line from being added
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button variant="success" onClick={handleSendMessage} className="rounded-pill shadow-sm p-2">
                      <SendIcon />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatApp;