import createError from 'http-errors';

export const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            throw createError.BadRequest(`Validation error: ${error.message}`);
        }

        next();
    };
};
