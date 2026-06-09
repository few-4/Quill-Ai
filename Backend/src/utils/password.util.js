import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword;
}

export const comparePassword = async (hashedPassword, userPassword) => {
    const passwordMatch = await bcrypt.compare(hashedPassword, userPassword)
    return passwordMatch;
}