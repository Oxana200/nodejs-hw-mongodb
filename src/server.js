import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(cookieParser());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/auth', express.urlencoded({ extended: true }), express.json(), authRouter);
    app.use('/contacts', authenticate, contactsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
