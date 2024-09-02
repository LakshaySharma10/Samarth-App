import React, { useState, useCallback, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

// Function to simulate typewriter effect
const typewriterEffect = (text, speed, callback) => {
  let result = '';
  let index = 0;
  const interval = setInterval(() => {
    result += text[index];
    callback(result);
    index++;
    if (index >= text.length) {
      clearInterval(interval);
    }
  }, speed);
};

const ChatInterviewPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [startInterview, setStartInterview] = useState(false);
  const [messageCount, setMessageCount] = useState(0);  // Track the number of user messages

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 1000 } });

  // Function to handle resume upload
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      setUploadError('');
      setResume(file);

      const formData = new FormData();
      formData.append('resume', file);

      try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(prevMessages => [...prevMessages, { text: data.message, type: 'system' }]);

          const startResponse = await fetch('http://127.0.0.1:5000/start', {
            method: 'GET',
          });
          const startData = await startResponse.json();
          if (startResponse.ok) {
            setMessages(prevMessages => [...prevMessages, { text: startData.response, type: 'ai' }]);
            setStartInterview(true);
          } else {
            console.error('Failed to fetch start message.');
            setUploadError('Failed to fetch start message.');
          }
        } else {
          setUploadError(data.error || 'Failed to upload resume.');
        }
      } catch (error) {
        console.error('Error uploading resume:', error);
        setUploadError('An error occurred while uploading the resume.');
      }
    } else {
      setUploadError('Please upload a valid PDF file.');
    }
  };

  const fetchLLMResponse = async (message) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.response || 'Sorry, I didn\'t understand that.';
      } else {
        console.error('Server Error:', data.error);
        return 'Sorry, there was an error.';
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      return 'Sorry, there was an error.';
    }
  };

  const simulateAIResponse = useCallback(async (message) => {
    setLoading(true);
    const aiText = await fetchLLMResponse(message);

    typewriterEffect(aiText, 50, (updatedMessage) => {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai' && newMessages[newMessages.length - 1].text !== aiText) {
          newMessages.pop();
        }
        newMessages.push({ text: updatedMessage, type: 'ai' });
        return newMessages;
      });
    });

    setLoading(false);
  }, []);

  const handleSend = () => {
    if (input.trim() === '' || messageCount >= 10) return; // Prevent sending more than 10 messages

    setMessages(prevMessages => [...prevMessages, { text: input, type: 'user' }]);
    simulateAIResponse(input);
    setInput('');
    setMessageCount(prevCount => prevCount + 1); // Increment message count
  };

  const handleStartInterview = async () => {
    try {
      const initialMessage = "Let's start the interview.";
      const response = await fetch('http://127.0.0.1:5000/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: initialMessage }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prevMessages => [...prevMessages, { text: data.response, type: 'ai' }]);
        setStartInterview(false);
      } else {
        console.error('Failed to start interview.');
        if (data.error) {
          setUploadError(data.error);
        }
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setUploadError('An error occurred while starting the interview.');
    }
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].type === 'user') {
      simulateAIResponse(messages[messages.length - 1].text);
    }
  }, [messages, simulateAIResponse]);

  return (
    <main className="w-full bg-black text-white h-screen flex flex-col">
      <section className="flex-1 overflow-auto p-4">
        <animated.div style={fadeInProps}>
          <div className="max-w-4xl mx-auto">
            <div className="border border-[#0b5428] p-4 rounded-lg bg-[#020d02] shadow-lg">
              <h1 className="text-3xl font-bold mb-4">Interview Chat</h1>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${msg.type === 'user' ? 'bg-[#0b5428]' : msg.type === 'system' ? 'bg-gray-700' : 'bg-[#020d02]'}`}
                  >
                    <p className="text-lg">{msg.text}</p>
                  </div>
                ))}
                {loading && <p className="text-lg text-gray-400">AI is typing...</p>}
              </div>
              {startInterview && (
                <button
                  onClick={handleStartInterview}
                  className="mt-4 px-6 py-2 bg-[#0b5428] text-white rounded-lg border border-[#0b5428] transition-transform transform hover:scale-105"
                >
                  Start Interview
                </button>
              )}
            </div>
          </div>
        </animated.div>
      </section>
      <section className="bg-[#020d02] p-4 border-t border-[#0b5428]">
        <div className="max-w-4xl mx-auto flex flex-col">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="mb-4 p-2 bg-[#0b5428] text-white rounded-lg border border-[#0b5428] outline-none"
          />
          {uploadError && <p className="text-red-500">{uploadError}</p>}
          
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-2 bg-[#0b5428] text-white rounded-lg border border-[#0b5428] outline-none"
              placeholder={messageCount < 10 ? "Type your message..." : "Interview complete. Analysis will be generated."} // Update placeholder text
              disabled={loading || messageCount >= 10}  // Disable input after 10 messages
            />
            <button
              onClick={handleSend}
              className="ml-4 px-6 py-2 bg-[#0b5428] text-white rounded-lg border border-[#0b5428] transition-transform transform hover:scale-105"
              disabled={loading || messageCount >= 10} // Disable button after 10 messages
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChatInterviewPage;
