import * as dotenv from 'dotenv';
import pool from '../config/db';

dotenv.config();

// Hàm tạo mã OTP
export const createOTPVerification = async (email: string, otp: string, expiresAt: Date) => {
    const client = await pool.connect();
    try {
        await client.query(
            'INSERT INTO otp_verifications (email, otp, expires_at) VALUES ($1, $2, $3)',
            [email, otp, expiresAt]
        );
    } finally {
        client.release();
    }
};

// Hàm kiểm tra mã OTP
export const checkOTP = async (email: string, otp: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM otp_verifications WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
            [email, otp]
        );
        return result.rows.length > 0;
    } finally {
        client.release();
    }
};