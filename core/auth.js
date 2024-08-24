const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const googleClientId = process.env.GOOGLE_ID;

// Initialize the OAuth2 client with your Google Client ID
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

async function verifyGoogleToken(token) {
    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleClientId, // Specify the CLIENT_ID of the app that accesses the backend
        });

        // Get the user payload from the ticket
        const payload = ticket.getPayload();

        // Return the payload with user information
        return payload;
    } catch (error) {
        console.error('Google token verification failed:', error);
        throw new Error('Invalid Google token');
    }
}

module.exports = verifyGoogleToken;
