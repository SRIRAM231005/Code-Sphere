import { MessageSquare, Plus } from 'lucide-react'; // Lucide icon[5]
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './MainMessageComponents.css';

const MessageInputBox = ({ onSend }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  };

  const handleClick = () => {
    localStorage.setItem('AddOrUpdate','Add');
    localStorage.removeItem('CodeMessageComplete');
    navigate("/codeCollab"); // Replace with your route
  };

  return (
    <form onSubmit={handleSend} className="message-input-box">
        <div className="message-input-Box">
            <input
            className="message-input"
            placeholder="Type your message..."
            value={value}
            onChange={e => setValue(e.target.value)}
        />
        <div className="buttons-div">
            <button onClick={handleClick}>
                <Plus size={20} style={{ marginRight: 6 }} />
            </button>
            <button type="submit" className="message-send-btn">
                <MessageSquare size={20} style={{ marginRight: 6 }} />
                Send
            </button>
        </div>
        </div>
    </form>
  );
};

export default MessageInputBox;
