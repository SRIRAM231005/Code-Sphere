const TextMessage = require('../models/TextMessage');
const CodeMessage = require('../models/CodeMessage');
const Group = require('../models/Group');
const User = require('../models/User');

async function SendAllMessages(req , res){
    try{
        const {groupName} = req.body;

        console.log(req.body);

        const group = await Group.findOne({ groupName: groupName });
        if (!group) return res.status(404).json({ message: "Group not found" });

        const groupMessages = await TextMessage.find({ group: group._id })
        .populate('sender', 'username')
        .populate('group', 'groupName');

        res.status(200).json(groupMessages);


    }catch(error) {
        res.status(500).json({ error: error.message });
    }
}

async function AddMessages(req , res){
    try {
        const { senderName, groupName, content } = req.body;
    
        if (!senderName || !groupName || !content) {
          return res.status(400).json({ message: "All fields are required" });
        }
    
        // Find user by username
        const user = await User.findOne({ username: senderName });
        if (!user) return res.status(404).json({ message: "Sender not found" });
    
        // Find group by name
        const group = await Group.findOne({ groupName: groupName });
        if (!group) return res.status(404).json({ message: "Group not found" });
    
        // Save message with ObjectIDs
        const newMessage = new TextMessage({
          sender: user._id,
          group: group._id,
          content
        });
    
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    
    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error });
    }
}

async function AddCodeMessages(req , res){
    try {
        const { senderName, groupName, description, codeSnippet, code } = req.body;

        // Find user by username
        const user = await User.findOne({ username: senderName });
        if (!user) return res.status(404).json({ message: "Sender not found" });
    
        // Find group by name
        const group = await Group.findOne({ groupName: groupName });
        if (!group) return res.status(404).json({ message: "Group not found" });

        const newCodeMessage = new CodeMessage({
            sender: user._id,
            group: group._id,
            description,
            codeSnippet,
            code,
            codeHistory: [{
                updatedBy: user._id,
                code: code,
                timestamp: new Date(),
                comments: [{
                  author: user._id,
                  text: description,
                  timestamp: new Date()
                }]
              }]
          });
      
          const savedMessage = await newCodeMessage.save();
          res.status(201).json(savedMessage);

    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error });
    }
}

async function AddCodeAndComment(req , res){
    try{
        const { id, code, text, username } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const codeMessage = await CodeMessage.findById(id);
        if (!codeMessage) return res.status(404).json({ message: "CodeMessage not found" });

        const newComment = {
            author: user._id,
            text: text,
            timestamp: new Date()
        }
        const newCodeVersion = {
            updatedBy: user._id,
            code: code,
            timestamp: new Date(),
            comments: [newComment]
        };

        codeMessage.codeHistory.push(newCodeVersion);
        await codeMessage.save();
        res.status(200).json({ message: "Code and comment added successfully", codeMessage });

    }catch(error){
        res.status(500).json({ message: "Failed to send message", error });
    }
}

async function getAllMessages(req, res){
  const {groupName} = req.body;

  try {
    const group = await Group.findOne({ groupName: groupName });
    if (!group) return res.status(404).json({ message: "Group not found" });

    /*const textMessages = await TextMessage.find({ group: groupId })
      .populate('sender', 'username') // populate user info if needed
      .lean()
      .exec();

    const codeMessages = await CodeMessage.find({ group: groupId })
      .populate('sender', 'username')
      .lean()
      .exec();*/

    const textMessages = await TextMessage.find({ group: group._id })
    .populate('sender', 'username')
    .populate('group', 'groupName')
    .lean();

    const codeMessages = await CodeMessage.find({ group: group._id })
    .populate('sender', 'username')
    .populate('group', 'groupName')
    .populate('codeHistory.updatedBy', 'username')
    .populate('codeHistory.comments.author', 'username')
    .lean();

    // Add type field manually to distinguish
    const typedText = textMessages.map((msg) => ({
      ...msg,
      type: 'text',
      createdAt: msg.createdAt,
    }));

    const typedCode = codeMessages.map((msg) => ({
      ...msg,
      type: 'code',
      createdAt: msg.createdAt, // Ensure both have the same field
    }));

    const allMessages = [...typedText, ...typedCode];

    allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json(allMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

//module.exports = { getAllMessages };


module.exports = { SendAllMessages, AddMessages, AddCodeMessages, AddCodeAndComment, getAllMessages };