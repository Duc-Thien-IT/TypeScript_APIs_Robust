import { Router } from 'express';
import { register, login, logout, verifyOTP } from '../controller/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/verify-otp', verifyOTP);

// Route được bảo vệ
router.get('/protected-route', authenticateJWT, (req, res) => {
    res.send('This is a protected route');
});

export default router;