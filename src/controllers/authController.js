const User = require('../models/User');
const {createJWT} = require('../../utils/jwt')


const signup = async (req, res) => {
    try {
      const {firstName, lastName, email, password} = req.body;
    
      const emailAlreadyExists = await User.findOne({ email });

      if (emailAlreadyExists) return res.status(409).send({success:false, message:"email already exists"});
      
    
      const user = await User.create({ firstName, lastName, email, password });
    
      const tokenUser = await createJWT({payload:{ user}});
    
        res.status(200).json({ success:true, user: tokenUser });
    } catch (error) {
       res.status(500).send({success:false, message:error.message})
    }
    };
      
      
    const login = async (req, res) => {
      try {
        const { email, password } = req.body;
    
        if (!email || !password) return res.status(400).json({ success: false, message: "Please provide email and password" });
        
    
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "Invalid credentials" });
        
    
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) return res.status(404).json({ success: false, message: "Invalid credentials" });
        
    
        const tokenUser = await createJWT({ payload: { user } });
    
         res.status(200).json({ success: true, user: tokenUser });
      } catch (error) {

          return res.status(500).json({ success: false, message: error.message });
        
      }
    };

    module.exports = {
        signup,
        login
    }