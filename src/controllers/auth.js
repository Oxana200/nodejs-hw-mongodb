import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { registerUserService, loginUserService, refreshSessionService, logoutUserService } from '../services/auth.js';

export const registerUserController = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await registerUserService({ name, email, password: hashedPassword });
    if (!user) throw createError(409, 'Email in use');

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: { id: user._id, name: user.name, email: user.email },
    });
};

export const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUserService(email, password);

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: { accessToken }
    });
};


export const refreshSessionController = async (req, res) => {
    const refreshTokenFromCookie = req.cookies.refreshToken;
    const { accessToken, refreshToken } = await refreshSessionService(refreshTokenFromCookie);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken },
    });
};

export const logoutUserController = async (req, res) => {
    const refreshTokenFromCookie = req.cookies.refreshToken;
    await logoutUserService(refreshTokenFromCookie);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(204).send();
};
