const { db, admin } = require('../utils/db');

const Info = {
    Retrieve: async (req, res) => {
        try {
            const data = await db.doc(`/info/main`).get();

            const info = data.data();

            return res.json({ info });
        } catch (error) {
            return res.status(500).json({ error });
        }
    },
    Update: async (req, res) => {
        try {
            const document = db.doc(`/info/main`);
            const data = await document.get();

            let info = data.data();

            if (!req.body || !req.body.desc) 
                return res.status(400).json({ error: 'errors.info.badrequest' });
            
            for (let i in req.body) {
                if (i !== 'name' && i !== 'updatedAt') {
                    info[i] = req.body[i];
                }
            }
            
            info.updateAt = new Date().toISOString();

            await document.update(info);

            return res.json({ message: 'update.info.success' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
};

module.exports = Info;