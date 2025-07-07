const Group = require('../models/Group');
const User = require('../models/User');

async function AllJoinedGroups(req , res){
    try{
        const { username } = req.body;

        const user = await User.findOne({ username: username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const groups = await Group.find({ members: user._id });
        res.status(201).json(groups);

    }catch(error){
        res.status(500).json({ error: error.message });
    }

}

module.exports = { AllJoinedGroups };