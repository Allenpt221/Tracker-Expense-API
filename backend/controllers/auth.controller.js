import UserAuth from '../model/auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const {username, email, password} = req.body;
    const hashpassword = bcrypt.hashSync(password, 10);
    try {
        if(!username || !email){
            return res.status(400).json({success: false, message: 'username and email is required'});
        }

        const newUser = new UserAuth({username, email, password: hashpassword});

        await newUser.save();
        return res.status(200).json({success: true, message: 'successfully created'})
    } catch (error){
        console.log('Error Server', error.message);
        return res.status(500).json({success: false, message: 'Server is Error'});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {

        const users = await UserAuth.findOne({email});

        if(!users){
            return res.status(400).json({success: false, message: 'Wrong Credentials'});
        }

        const correctPassword = await bcrypt.compare(password, users.password);

        if(!correctPassword){
            return res.status(400).json({success: false, message: 'Invalid Password'});
        }

        const token = jwt.sign({ id: users._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        const currentTimeUTC = new Date();
        const expiryDateGMT8 = new Date(currentTimeUTC.getTime() + (8 * 60 * 60 * 1000));
        expiryDateGMT8.setHours(expiryDateGMT8.getHours() + 1);
        res.cookie('access-token', token, {
            httpOnly: true,
            expires: expiryDateGMT8
        });

        return res.status(200).json({success: true, message: 'Successfully Log in'});
    } catch (error){
        console.log('Error Server', error.message);
        return res.status(500).json({success: false, message: 'Server is Error'});
    }
};


export const logout = async (req, res) => {
    try {
        
        res.clearCookie('access-token', {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict',
        });

        // Send a success response
        return res.status(200).json({success: true, message: 'Successfully logged out'});
    } catch (error) {
        console.error('Error Server', error.message);
        return res.status(500).json({success: false, message: 'Server Error'});
    }
};
