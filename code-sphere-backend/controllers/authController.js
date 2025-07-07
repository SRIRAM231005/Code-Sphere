const User = require('../models/User');
const Group = require('../models/Group');

let a = 1;
async function signUp(req, res){
  try {
    const { username, email, password } = req.body;

    console.log(req.body);

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function login(req, res){
  try {
    const { identifier, password } = req.body;

    console.log(req.body);

    const user = await User.findOne({ email: identifier });
    const userall = await User.find();
    console.log(user.email === identifier);
    console.log(req.body.identifier);
    console.log(typeof user.email);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if(a == 0){
        a = 1;
        const groupmaking = new Group({ 
            groupName: 'React Devs',
            isProjectGroup: false,
            admin: user._id,
            members: [
                user._id
            ],
            description: 'A group for React developers to chat and share ideas.'
        });
        await groupmaking.save();
    }else{
        await Group.findOneAndUpdate(
            {}, // empty filter: matches the first group found
            { $addToSet: { members: user._id } }, // $addToSet prevents duplicates
            { new: true } // returns the updated group document
        );
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signUp, login };
