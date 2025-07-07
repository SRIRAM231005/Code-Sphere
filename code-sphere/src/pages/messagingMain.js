import React, { useState , useEffect } from "react";
import VerticalMenuSection from "../components/VerticalMenuSection";
import GroupInfoBox from "../components/GroupInfoBox";
import JoinedGroups from "../components/JoinedGroups";
import MessagesBox from "../components/MessagesBox";
import MessageInputBox from "../components/MessageInputBox";
import { io } from 'socket.io-client';
import { Users, Hash, Bell, Compass } from "lucide-react";
import './messagingMain.css';

const socket = io('http://localhost:5002');

// Mock data
const menuItems = [
  { id: "general", label: "General", icon: <Hash size={22} /> },
  { id: "team", label: "Team", icon: <Users size={22} /> },
  { id: "explore", label: "Explore", icon: <Compass size={22} /> },
  { id: "alerts", label: "Alerts", icon: <Bell size={22} /> },
];

/*const groupDetails = {
  groupName: "React Devs",
  description: "A group for React developers to chat and share ideas.",
  memberCount: 42,
  members: data.usersOnline
};*/


export default function App() {
  localStorage.removeItem('groupDetails');
  const username = localStorage.getItem('username');
  console.log(username);
  // 1. Initialize from localStorage
  const [TotalOnlineUsersData, setTotalOnlineUsersData] = useState([]);
  const [groupDetailsIncoming, setGroupDetailsIncoming] = useState(null);
  const [groupDetails, setGroupDetails] = useState(() => {
    const saved = localStorage.getItem('groupDetails');
    return saved ? JSON.parse(saved) : null;
  });


  // 2. Save to localStorage whenever groupDetails changes
  useEffect(() => {
    if (groupDetails) {
      localStorage.setItem('groupDetails', JSON.stringify(groupDetails));
    }
  }, [groupDetails]);

  useEffect(() => {
    //console.log('hi');
    socket.emit('join', `${username}`);
    socket.on('receiveMessage', () => {
        console.log('connected');
    });
    socket.on('your-info', (data) => {
        console.log('usersOnline: ',data.usersOnline);
        console.log('user',data.socketId);
        setTotalOnlineUsersData(data.usersOnline);
    });
  }, [username]);

  useEffect(() => {
    console.log("groupDetailsIncoming",groupDetailsIncoming);
    if(groupDetailsIncoming){
        setGroupDetails({
            groupName: groupDetailsIncoming.groupName,
            description: groupDetailsIncoming.description,
            memberCount: `${TotalOnlineUsersData.length}`,
            members: TotalOnlineUsersData
        });
    }
  }, [groupDetailsIncoming, TotalOnlineUsersData]);


  //const [selectedMenu, setSelectedMenu] = useState(menuItems[0].id);
  //const [messages, setMessages] = useState(initialMessages);
  const [messages, setMessages] = useState([]);


  const handleSend = (msg) => {
    async function FetchSenddMessage(msg){
        try{
            const response = await fetch('http://localhost:5002/messages/AddMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderName: username,
                    groupName: groupDetails.groupName,
                    content: msg
                })
            });
            const data = await response.json();
            console.log(data);
        }catch(error){
            console.log('Error:',error);
        }
    }
    FetchSenddMessage(msg);
    const newMessage = {
        senderName: username,
        groupName: groupDetails.groupName,
        content: msg
      };
      
      // Update the state
      setMessages(prevMessages => [
        ...prevMessages,
        newMessage
      ]);
      
      // Emit the new message to the server
      console.log("this is the problem",newMessage);
      socket.emit('sendMessage', newMessage);
      
    /*setMessages([
      ...messages,
      {
        senderName: username,
        groupName: groupDetails.groupName,
        content: msg
      },
    ],
    socket.emit('sendMessage', messages));*/
  };

  return (
    <div className="App">
      <div className="column menu-column">
        <VerticalMenuSection/>
      </div>
      <div className="column info-column">
        {groupDetails ? (
            <GroupInfoBox {...groupDetails} />
        ):(
            <div>Welcome Back!</div>
        )}
      </div>
      <div className="column chat-column">
        <div className="chat-box">
            {groupDetails ? (
                <>
                <MessagesBox {...groupDetails} />
                <MessageInputBox onSend={handleSend} />
                </>
            ):(
                <JoinedGroups onGroupSelect={setGroupDetailsIncoming} />
            )}
        </div>
      </div>
    </div>
  );
}
