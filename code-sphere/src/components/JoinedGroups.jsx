import React, { useEffect, useState } from 'react';
import './JoinedGroups.css';

const JoinedGroups = ({ onGroupSelect }) => {
  const username = localStorage.getItem('username');
  console.log(username);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's joined groups
    async function FetchGroups(){
        try{
            const response = await fetch('http://localhost:5002/groups/AllJoinedGroups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                })
            });
            const data = await response.json();
            console.log(data);
            setGroups(data);
        }catch(error){
            console.log("Error: ",error);
        }finally {
            setLoading(false);
        }
    }
    FetchGroups();
  }, []);

  return (
    <div className="joined-groups-container">
      {loading ? (
        <div className="loading">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="no-groups">You haven’t joined any groups yet.</div>
      ) : (
        <div className="groups-box">
            <div className="heading">Joined Groups</div>
            <div className="groups-divs">
                {groups.map((group) => (
                    <div
                        key={group._id}
                        className="group-card"
                        onClick={() => onGroupSelect(group)}
                    >
                        <div className="group-title">{group.groupName}</div>
                        <div className="group-description">{group.description}</div>
                        <div className="group-members">{group.members.length} members</div>
                    </div>
                    ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default JoinedGroups;
