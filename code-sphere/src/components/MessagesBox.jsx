import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus } from 'lucide-react'; // Lucide icon[5]
import { io } from 'socket.io-client';
import './MainMessageComponents.css';

const socket = io('http://localhost:5002');
//let msgdisp;

const MessagesBox = ({ groupName, description, memberCount, members }) =>{
    const username = localStorage.getItem('username');
    console.log(username);
    const navigate = useNavigate();
    const [divs, setDivs] = useState([]);
    const [tasksArray, setTasksArray] = useState([]);

    console.log(tasksArray);

    useEffect(() => {

        /*if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log("Notification permission granted.");
                } else {
                    console.log("Notification permission denied.");
                }
            });
        }*/
        groupName = "React Devs";
        async function getMessages(){
            try{
                const response = await fetch('http://localhost:5002/messages/getAllMessages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        groupName: groupName,
                    })
                });
                const messages = await response.json();
                console.log('messages:',messages);
                setTasksArray(messages);
                //tasks.forEach((task) => array.push(task.task));
            }catch(error){
                console.log('Error: ',error);
            }

            // http://localhost:5002/messages/SendAllMessages
            // https://trialbackend.onrender.com/api/tasks
        }
    
        getMessages();
    }, [groupName]); 

    /*useEffect(() =>{
        async function getMessages(){
            try{
                const response = await fetch('http://localhost:5002/messages/getAllMessages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        groupName: groupName,
                    })
                });
                const messages = await response.json();
                console.log('messages:',messages);
                setTasksArray(messages);
                //tasks.forEach((task) => array.push(task.task));
            }catch(error){
                console.log('Error: ',error);
            }
        }
        getMessages();
    },[]);*/
    let msgSender;
    useEffect(() => {
        socket.on('receiveMessage', (msg) => {
            console.log("this says this works");
            console.log('Messagereceived: ',msg);
            msgSender = msg.senderName;
            //msgdisp = msg;
            const newDiv = `${msg.content}`; 
            setDivs([...divs, newDiv]); 
        });
        //onMessageReceived("Hello! You have a new message.");
    }, [divs]); 

    /*function onMessageReceived(message) {
        if (document.hidden) {
          sendNotification("New Message", message);
        } else {
          console.log("User is on the webpage, no notification sent");
        }
    }*/

        const handleClick = (div) => {
            localStorage.setItem('AddOrUpdate','Update');
            localStorage.setItem('CodeMessageComplete',JSON.stringify(div));
            navigate("/codeCollab"); // Replace with your route
        };


    return(
  <div className="messages-box">
        <div className='displaybox1'>
                {tasksArray.map((div, index) => (
                    div.type === "text" ? (
                        <div key={index} className={`child-div ${div.sender.username === username ? "highlight" : ""}`}>
                            <div className="userinfo">
                                <div className="username">{div.sender.username}</div>
                                <div className="date">{new Date(div.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="message-content">{div.content}</div>
                        </div>
                    ):(
                        <div key={index} className={`child-div code-child-div ${div.sender.username === username ? "highlight" : ""}`}>
                            <div className="userinfo">
                                <div className="username">{div.sender.username}</div>
                                <div className="date">{new Date(div.createdAt).toLocaleString()}</div>
                            </div>
                            <Editor
                                height="120px"
                                defaultLanguage="javascript" // or use div.language if you store it
                                value={div.codeSnippet}
                                options={{ readOnly: true, fontSize: 14 }}
                                theme="vs-dark"
                            />
                            <div style={{ marginTop: 8 }}>{div.description}</div>
                            <button className='add-ans-button' onClick={() => handleClick(div)}>
                                <Plus size={20} style={{ marginRight: 6 }} />
                                Add Answer
                            </button>
                        </div>
                    )
                ))}
            </div>
            <div className="displaybox2">
                {divs.map((div, index) => (
                    <div key={index} className="child-div highlight">
                        <div className="userinfo">
                            <div className="username">{msgSender}</div>
                            <div className="date">Now</div>
                        </div>
                        <div>{div}</div>
                    </div>
                ))}
        </div>
  </div>
);
}

export default MessagesBox;
