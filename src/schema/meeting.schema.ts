export const meetingSchema = {
    type: 'object',
    required: ['type', 'title', 'body'],
    properties: {
        id: { type: 'string' }, // Same as Meetings model
        type: { type: 'string' }, // Meeting type, e.g., "meeting", "workshop", etc.
        title: { type: 'string' }, // Meeting title
        body: { type: 'string' }, // Meeting description or agenda
        author: {
            type: 'object', // Reference to the meeting author (user)
            properties: {
                userId: { type: 'string' }, // User ID of the meeting author
                name: { type: 'string' }, // User's name
                email: { type: 'string', format: 'email' }, // User's email
            },
        },
        createdAt: { type: 'string', format: 'date-time' }, // Meeting creation timestamp
        image: { type: 'string' }, // Optional meeting image
        comments: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' }, // Comment ID
                    userId: { type: 'string' }, // Comment author's user ID
                    body: { type: 'string' }, // Comment content
                    createdAt: { type: 'string', format: 'date-time' }, // Comment creation timestamp
                },
            },
        },
        likes: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' }, // Like ID
                    userId: { type: 'string' }, // User who liked the meeting
                    createdAt: { type: 'string', format: 'date-time' }, // Like creation timestamp
                },
            },
        },
    },
};

export const createMeetingSchema = {
    type: 'object',
    required: ['type', 'title', 'body'],
    properties: {
        type: { type: 'string' },
        title: { type: 'string' },
        body: { type: 'string' },
        image: { type: 'string' }
    },
}

export const updateMeetingSchema = {
    type: 'object',
    properties: {
        // Include properties that can be updated in a meeting
        title: { type: 'string' }, // Optional, allows updating the title
        body: { type: 'string' }, // Optional, allows updating the description/agenda
        type: { type: 'string' }, // Optional, allows updating the meeting type
    },
};

export const commentMeetingCreate = {
    type: 'object',
    properties: {
        type: { type: 'string' },
        body: { type: 'string' }
    }
}