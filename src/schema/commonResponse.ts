export const successResponse = {
    description: 'Success response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    message: { type: 'string' }, // Add properties as needed
                },
            },
        },
    },
};

export const errorResponse = {
    description: 'Error response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' }, // Add properties as needed
                },
            },
        },
    },
};
