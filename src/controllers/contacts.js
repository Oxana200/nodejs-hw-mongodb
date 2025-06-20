import {
    createContactService,
    getContactByIdService,
    updateContactService,
    deleteContactService,
    countContacts,
    listContacts,
} from '../services/contacts.js';
import createError from 'http-errors';

// GET /contacts з фільтрами, пагінацією, сортуванням
export const getAllContacts = async (req, res) => {
    const {
        page = 1,
        perPage = 10,
        sortBy = 'name',
        sortOrder = 'asc',
        type,
        isFavourite,
    } = req.query;

    const query = {};
    if (type) query.contactType = type;
    if (isFavourite !== undefined) query.isFavourite = isFavourite === 'true';

    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const totalItems = await countContacts(query);
    const contacts = await listContacts(query, skip, +perPage, sortBy, sortDirection);

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: {
            data: contacts,
            page: +page,
            perPage: +perPage,
            totalItems,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
        },
    });
};

// GET /contacts/:contactId
export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

// POST /contacts
export const createContactController = async (req, res) => {
    const newContact = await createContactService(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

// PATCH /contacts/:contactId
export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const updatedContact = await updateContactService(contactId, req.body);

    if (!updatedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
    });
};

// DELETE /contacts/:contactId
export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const deletedContact = await deleteContactService(contactId);

    if (!deletedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};
