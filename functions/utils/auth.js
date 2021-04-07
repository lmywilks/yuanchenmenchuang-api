const { admin, db } = require('./db');

module.exports = async (req, res, next) => {
    try {
        if (
            req.headers.authorization && 
            req.headers.authorization.startsWith('Bearer ')
        ) {
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else {
            return res.status(401).json({ error: 'errors.unauthorized' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        next();
    } catch (error) {
        return res.status(500).json({ error });
    }
};