import { Request } from 'express';
import { User } from './models/userModel';

declare global {
    namespace Express {
        interface Request {
            user?: User; //Lưu thông tin người dùng
            isAuthenticated: () => boolean; //kiểm tra đăng nhập
        }
    }
}