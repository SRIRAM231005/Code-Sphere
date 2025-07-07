import React, { useState , useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import "./CodeCollabPage.css"; // Import the CSS file

// Dummy data for demonstration
const initialCommits = [
  { updatedBy: "alice", timestamp: "2024-05-16T09:00:00Z" },
  { updatedBy: "bob", timestamp: "2024-05-16T10:15:23Z" },
];

const initialComments = [
  { author: "alice", text: "Great start!" },
  { author: "bob", text: "Let's add more tests." },
];

const username = localStorage.getItem('username');
console.log(username);
const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
console.log(groupDetails);
const CodeMessageComplete = JSON.parse(localStorage.getItem('CodeMessageComplete'));
console.log(CodeMessageComplete);

export default function CodeCollabPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("// Write your code here...");
  const [commits, setCommits] = useState([]);
  const [comments, setComments] = useState(initialComments);
  const [commentInput, setCommentInput] = useState("");

  /*const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      setComments([...comments, { username: "you", text: commentInput }]);
      setCommentInput("");
    }
  };*/

  useEffect(() => {
    if (CodeMessageComplete) {
      setCode(CodeMessageComplete.codeHistory[0].code);
      const allComments = CodeMessageComplete.codeHistory.flatMap(
        codeVersion => codeVersion.comments
      );
      setComments(allComments);
      //setComments(CodeMessageComplete.codeHistory[0].comments);
      setCommits(CodeMessageComplete.codeHistory);
      //setCommits(CodeMessageComplete.codeHistory[0]);
    }
  }, [CodeMessageComplete]); // Dependency array ensures this runs only when CodeMessageComplete changes
  

  const handleMessageSend = (e) => {
    e.preventDefault();
    console.log("this message will come",localStorage.getItem('AddOrUpdate'));
    if(localStorage.getItem('AddOrUpdate') === 'Update'){
        /*if (commentInput.trim()) {
            setComments([...comments, { username: `${username} (Author)`, text: commentInput }]);
            setCommentInput("");
        }*/
        const fullCode = code; // the full code string
        const codeSnippet = fullCode.split('\n').slice(0, 3).join('\n'); // first 3 lines as preview
        async function FetchSendCodeMessage(){
            try{
                const response = await fetch('http://localhost:5002/messages/AddCodeMessages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        senderName: username,
                        groupName: groupDetails.groupName,
                        description: commentInput,
                        codeSnippet: codeSnippet,
                        code: code,
                    })
                });
                const data = await response.json();
                console.log(data);
            }catch(error){
                console.log('Error:',error);
            }
        }
        FetchSendCodeMessage();
        //navigate("/messaging"); 
    }else{
        /*if (commentInput.trim()) {
            setComments([...comments, { username: username, text: commentInput }]);
            setCommentInput("");
        }*/

        async function FetchAddCodeAndComment(){
            try{
                const response = await fetch('http://localhost:5002/messages/AddCodeAndComment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: CodeMessageComplete._id,
                        code: code,
                        text: commentInput,
                        username: username,
                    })
                });
                const data = await response.json();
                console.log(data.codeMessage);
                localStorage.setItem('CodeMessageComplete',JSON.stringify(data.codeMessage));
            }catch(error){
                console.log("Error: ",error);
            }
        }
        FetchAddCodeAndComment();
    }
  }

  const handleCodeShowing = (id) => {
    commits.forEach((c, i) => {
        if (c._id === id) {
            setCode(c.code);
            console.log(c.code);
        }
    });
    console.log("ID: ",id);
};

//console.log("hi here: ",localStorage.getItem('AddOrUpdate'));


  return (
    <div className="container">
      {/* Top Left: Monaco Editor */}
      <div className="editor">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={setCode}
          options={{ fontSize: 14 }}
          theme="vs-dark"
        />
      </div>

      {/* Top Right: Commit History */}
      <div className="commitHistory">
        <h3>Commit History</h3>
        <ul className="commitList">
          {commits.map((c, i) => (
            <li key={i} className="commitItem">
              <div className="commitMessage" onClick={() => handleCodeShowing(c._id)}><strong>{c.updatedBy.username}:</strong> {c.timestamp}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Left: Comments Display */}
      <div className="comments">
        <h3>Comments</h3>
        <ul className="commentList">
          {comments.map((c, i) => (
            i === 0 ? (
            <li key={i} className="commentItem">
              <strong>{c.author.username} (Author):</strong> {c.text}
            </li>):(
                <li key={i} className="commentItem">
                    <strong>{c.author.username}:</strong> {c.text}
                </li>
            )
          ))}
        </ul>
      </div>

      {/* Bottom Right: Comment Input */}
      <div className="commentInput">
        <form onSubmit={handleMessageSend} className="commentForm">
          <textarea
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a question or comment..."
            rows={3}
            className="commentTextarea"
          />
          <button type="submit" className="commentButton">Send</button>
        </form>
      </div>
    </div>
  );
}
