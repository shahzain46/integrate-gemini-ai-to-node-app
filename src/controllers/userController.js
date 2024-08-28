const User = require("../models/User");


const getUser = async (req, res) => {
    try {
        const userId = req.user._id; 

        const user = await User.findOne({_id:userId})
        console.log(user);
        if (!user) {
            return res.status(404).send({success: false, message: 'User not found'})
          }
        
        res.status(200).send({success: true, user : user})

    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}

module.exports = {getUser}