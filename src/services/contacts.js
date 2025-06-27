import { Contact } from '../models/contactModel.js';

export const getAllContactsService = async (userId) => {
    return Contact.find({ userId });
};

export const getContactByIdService = async (id, userId) => {
    return Contact.findOne({ _id: id, userId });
};

export const createContactService = async (contactData) => {
    return Contact.create(contactData);
};

export const updateContactService = async (id, userId, updateData) => {
    return Contact.findOneAndUpdate({ _id: id, userId }, updateData, { new: true });
};

export const deleteContactService = async (id, userId) => {
    return Contact.findOneAndDelete({ _id: id, userId });
};
