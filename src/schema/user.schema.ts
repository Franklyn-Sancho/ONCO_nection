export const userSchema = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
        id: { type: 'string' },
        imageProfile: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        description: { type: 'string' },
        token: { type: 'string' },
        emailConfirmationToken: { type: 'string' },
        emailConfirmationExpires: { type: 'string', format: 'date-time' },
        emailConfirmed: { type: 'boolean' },
    },
};


export const registerSchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
};

export const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
};