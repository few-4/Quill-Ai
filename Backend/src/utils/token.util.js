import jwt from 'jsonwebtoken';

export const generateToken = async ({ id, name, email }) => {
    const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    return token;
}

export const decodeToken = async (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
}