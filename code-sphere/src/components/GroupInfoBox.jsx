import { Group, IdCard } from 'lucide-react';
import './MainMessageComponents.css';

const GroupInfoBox = ({ groupName, description, memberCount, members }) => {
    console.log('members:',typeof members);
    return(
  <div className="group-info-box">
    <Group size={32} className="group-info-icon" />
    <div className="group-info-details">
      <div className="group-info-header">
        <h2 className="group-info-title">{groupName}</h2>
        <IdCard size={18} className="group-info-idicon" />
      </div>
      <p className="group-info-desc">{description}</p>
      <span className="group-info-members">{memberCount} members</span>
      <div className="group-info-members-list">
        <h4>Members Online</h4>
        {Array.isArray(members) && members.length > 0 ? (
          <ul>
            {members.map((username, idx) => (
              <li key={idx} members>
                <div>{username}</div>
                <div className='online'>Online.</div>
              </li>
            ))}
          </ul>
        ) : (
          <span>No members</span>
        )}
      </div>
    </div>
  </div>
);
}

export default GroupInfoBox;
