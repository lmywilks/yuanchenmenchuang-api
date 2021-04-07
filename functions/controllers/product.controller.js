const { db, admin, storage } = require('../utils/db');
const uuidv4 = require('uuid');


const Product = {
    List: async (req, res) => {
        try {
            let products = [];

            const data = await db.collection('products').get();

            if (!data) return res.status(404).json({ products });

            data.forEach(doc => {
                if (doc.exists) {
                    const p = doc.data();
                    p.productId = doc.id;
                    products.push(p);
                }
            });

            return res.json({ products });
        } catch (error) {
            return res.status(500).json({ error });
        }
    },

    Retrieve: async (req, res) => {
        try {
            const data = await db.doc(`/products/${ req.params.productId }`).get();

            if (!data.exists) return res.status(404).json({ error: 'errors.product.notfound' });

            let product = data.data();
            product.productId = data.id;

            return res.json({ product });
        } catch (error) {
            return res.status(500).json({ error });
        }
    },

    Create: async (req, res) => {
        try {
            let newProduct = { ...req.body };

            if (!newProduct.name || !newProduct.desc) 
                return res.status(400).json({ error: 'errors.product.badinput' });            

            newProduct.createdAt = new Date().toISOString();
            newProduct.updatedAt = new Date().toISOString();
            const data = await db.collection('products').add(newProduct);
            newProduct.productId = data.id;
            return res.json({ product: newProduct, message: 'create.product.success' });                            

        } catch (error) {
            return res.status(500).json({ error });
        }
    },

    Update: async (req, res) => {
        try {
            const document = db.doc(`/products/${ req.params.productId }`);

            const doc = await document.get();

            if (!doc.exists)
                return res.status(404).json({ error: 'errors.product.notfound' });

            let product = doc.data();
            product.productId = doc.id;

            for (let i in req.body) {
                if (
                    i !== 'productId' && 
                    i !== 'createdAt' && 
                    i !== 'updatedAt' && 
                    i !== 'imageUrls'
                ) {
                    product[i] = req.body[i];
                }
            }

            product.updatedAt = new Date().toISOString();

            await document.update(product);

            return res.json({ message: 'update.product.success' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    },

    Upload: async (req, res) => {
        try {

            console.log('====')
            if (!req.file) {
                return res.status(400).json({ error: 'errors.image.nofile' });
            }

            const document = db.doc(`/products/${ req.params.productId }`);

            let data = await document.get();
            
            if (!data.exists)
                return res.status(404).json({ error: 'errors.product.notfound' });
                        
            let product = data.data();
            product.productId = data.id;

            const fileparts = req.file.originalname.split('.');
            const fileextension = fileparts[fileparts.length - 1];
            const filename = fileparts[0] + '_' + new Date().getTime() + '.' + fileextension;
            const uuid = uuidv4.v4();
                    
            const blob = storage.bucket().file(`products/${ req.params.productId }/${ filename }`);            
        
            const blobWriter = blob.createWriteStream();
            
            blobWriter.on('error', (err) => {
                return res.status(500).json({ error: err });
            });
            
            blobWriter.on('finish', async () => {
                if (!product.defaultImage) product.defaultImage = filename;
                if (!product.imageUrls) product.imageUrls = [];
                product.imageUrls.push(filename);
                await blob.setMetadata({
                    metadata: {
                      // Update the download token:
                      firebaseStorageDownloadTokens: uuid,
                      contentType: req.file.mimetype
                    },
                });
                await document.update(product);
                return res.json({ filename });
            });
            
            blobWriter.end(req.file.buffer);
              
        } catch (error) {
            return res.status(500).json({ error });
        }
    },

    Delete: async (req, res) => {
        try {
            const document = db.doc(`/products/${ req.params.productId }`);

            const data = await document.get();

            if (!data.exists) 
                return res.status(404).json({ error: 'errors.product.notfound' });

            await document.delete();

            return res.json({ message: 'delete.product.success' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    },

    DeleteImage: async (req, res) => {
        try {
            const document = db.doc(`/products/${ req.params.productId }`);
            const data = await document.get();

            if (!data.exists)
                return res.status(404).json({ error: 'errors.product.notfound' });
            
            let product = data.data();
            product.productId = data.id;

            await admin.storage().bucket().file(`products/${ req.params.productId }/${ req.params.filename }`).delete();

            product.imageUrls = product.imageUrls.filter(file => file !== req.params.filename);
            product.updatedAt = new Date().toISOString();

            await document.update(product);

            return res.json({ message: 'delete.image.success' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
};

module.exports = Product;