import { Router } from 'express';
import { changeRole, changeUsername, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../middlewares/auth.middleware.js';

const router = Router();

router
    .route('/register')
    .post(registerUser);

router
    .route('/login')
    .post(loginUser);

router
    .route('/logout')
    .post(verifyUser, logoutUser);

router
    .route('/changeRole')
    .post(verifyAdmin, changeRole);

router
    .route('/changeUsername')
    .post(verifyUser, changeUsername);

export default router;