const { FIREBASE } = require('../utils/config');

const firebase = require('firebase');
firebase.initializeApp(FIREBASE);

const Auth = {    
    Login: async (req, res) => {
        try {
            const login = { ... req.body };

            if (!login.username || !login.password) 
                return res.status(400).json({ error: 'errors.login.missing' });
            
            if (login.username !== 'yuanchenmenchuang')
                return res.status(400).json({ error: 'errors.login.wronguser' });
                        
            const data = await firebase.auth().signInWithEmailAndPassword('lmywilks.info@gmail.com', login.password);

            if (!data || !data.user) {
                return res.status(401).json({ error: 'errors.login.wrongcredential' });
            }

            const token = await data.user.getIdToken();

            return res.json({ token });
        } catch (err) {
            return res.status(401).json({ error: 'errors.login.wrongcredential' });
        }
    }
};

module.exports = Auth;