const User = require("../schemas/User");

exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};
