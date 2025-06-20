import mongoose from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;

    // Перевіряємо, чи contactId — це коректний ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        // Створюємо помилку 400, якщо id не валідний
        return next(createError(400, `Invalid ID format: ${contactId}`));
    }

    next(); // все ок — переходимо до наступного middleware або контролера
};
