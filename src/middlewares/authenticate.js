import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

import dotenv from 'dotenv';
dotenv.config();

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) throw createError(401, 'No token provided');

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) throw createError(401, 'User not found');

        const session = await Session.findOne({ accessToken: token });
        if (!session) throw createError(401, 'Session expired or invalid');

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            next(createError(401, 'Access token expired'));
        } else {
            next(createError(401, 'Invalid or missing token'));
        }
    }
};
