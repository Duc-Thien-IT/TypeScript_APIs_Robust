import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail, User } from '../models/user';
import { sendOTPEmail } from '../emailServices';
import { createOTPVerification, checkOTP } from '../models/otp'; // Import từ otpModel
import crypto from 'crypto';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    const { hoten, email, phone, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser: Omit<User, 'id'> = { hoten, email, phone, address, password: hashedPassword };
        await createUser(newUser);

        // Tạo mã OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // Mã OTP 6 chữ số

        // Gửi mã OTP qua email
        await sendOTPEmail(email, otp);

        // Lưu mã OTP vào cơ sở dữ liệu
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút
        await createOTPVerification(email, otp, expiresAt); // Sử dụng hàm từ otpModel

        res.redirect('/verify.html'); // Chuyển hướng đến trang xác thực OTP
    } catch (err) {
        console.error(err); // Log lỗi để dễ dàng gỡ lỗi
        res.status(500).send('Error registering user');
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = generateToken(user.id);
            // Có thể lưu token vào cookie hoặc localStorage, tùy thuộc vào yêu cầu của bạn
            res.redirect('/home.html'); // Chuyển hướng đến trang chủ
            // Hoặc nếu bạn muốn trả về token dưới dạng JSON, có thể dùng res.json({ token });
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send('Error logging in user');
    }
};


export const logout = (req: Request, res: Response) => {
    res.redirect('/login.html');
};

export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const isValid = await checkOTP(email, otp); // Sử dụng hàm từ otpModel

    if (isValid) {
        // Xác thực thành công
        res.redirect('/login.html');
    } else {
        res.status(400).send('Invalid or expired OTP');
    }
};