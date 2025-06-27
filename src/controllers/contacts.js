import {
    createContactService,
    getAllContactsService,
    getContactByIdService,
    updateContactService,
    deleteContactService,
} from '../services/contacts.js';
import createError from 'http-errors';

export const getAllContactsController = async (req, res) => {
    const userId = req.user._id;
    const contacts = await getAllContactsService(userId);

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactByIdService(contactId, userId);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    const userId = req.user._id;
    const newContact = await createContactService({ ...req.body, userId });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updatedContact = await updateContactService(contactId, userId, req.body);

    if (!updatedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const deletedContact = await deleteContactService(contactId, userId);

    if (!deletedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};
