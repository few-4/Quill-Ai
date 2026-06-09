import User from "../models/user.model.js"

export const createUser = async (fullname, email, hashedPassword) => {
    const user = await User.create({
        fullName: fullname,
        email: email,
        password: hashedPassword
    });
    return user;
}

export const findUserByEmail = async (email) => {
    const user = await User.findOne({ email }).select("+password");
    return user;
}