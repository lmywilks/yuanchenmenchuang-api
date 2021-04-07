const functions = require("firebase-functions");
const { storage } = require('./utils/db');

const express = require('express');

const app = express();

const cors = require('cors');

const authRouter = require('./routers/auth.router');
const infoRouter = require('./routers/info.router');
const productRouter = require('./routers/product.router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.options('*', cors());

app.use(function(req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization");
    next();
});

app.use('/auth', authRouter);
app.use('/info', infoRouter);
app.use('/products', productRouter);

// app.listen('3000', () => {
//     console.log('run');
// });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.api = functions.region('asia-east2').https.onRequest(app);

exports.onProductDeleted = functions
    .region('asia-east2')
    .firestore
    .document('/products/{productId}')
    .onDelete(async (snapshot, context) => {
        const productId = context.params.productId;
        const bucket = storage.bucket();

        return bucket.deleteFiles({
            prefix: `products/${ productId }`
        });
    });