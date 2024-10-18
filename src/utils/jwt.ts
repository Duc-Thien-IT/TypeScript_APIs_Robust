import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const generateToken = (userId: number): string => {
    //Tạo token
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    //Kiểm tra token và báo lỗi quá 1h
    return jwt.verify(token, JWT_SECRET);
};