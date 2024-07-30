const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserService {
    async createUser(userData) {
        const { name, age, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            age: parseInt(age),
            email,
            password: hashedPassword,
            date_ajout: new Date()
        });

        return await newUser.save();
    }

    async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async updateUser(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new UserService();