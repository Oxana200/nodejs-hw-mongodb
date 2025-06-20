import express from 'express';
import * as ctrl from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(ctrl.getAllContacts)); // з пагінацією

router.get('/:contactId', isValidId, ctrlWrapper(ctrl.getContactByIdController));

router.post(
    '/',
    validateBody(createContactSchema),
    ctrlWrapper(ctrl.createContactController)
);

router.patch(
    '/:contactId',
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(ctrl.updateContactController)
);

router.delete('/:contactId', isValidId, ctrlWrapper(ctrl.deleteContactController));

export default router;
