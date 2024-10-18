import pool from '../config/db';
import * as dotenv from 'dotenv';

dotenv.config();

export interface User {
    id: number;
    hoten: string;
    email: string;
    phone: string;
    address: string;
    password: string;
}

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO users (hoten, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user.hoten, user.email, user.phone, user.address, user.password]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
};

