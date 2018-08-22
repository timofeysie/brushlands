const express = require('express');
const mongoDb = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log('server started');
});

let databaseName = 'serene-brushland';
let artworksCollection = 'artworks';
let imageCollection = 'images';

app.route('/api/artworks').get((req, res) => {
    mongoDb.connect('mongodb://localhost:27017', function(err, client) {
        if (err) {
            return console.dir(err);
        }
        let db = client.db(databaseName);
        var collection = db.collection(artworksCollection);
        collection.find().sort({assetRefNo: 1}).toArray(function(err, items) {
            res.send(items);
            client.close();
        });
    });
});

app.route('/api/artwork/:id').get((req, res) => {
        let artworkId = req.params.id;
        mongoDb.connect('mongodb://localhost:27017', (err, client) => {
            if (err) {
                return console.dir(err);
            }

            let db = client.db(databaseName);
            let collection = db.collection(artworksCollection);
            collection.findOne({assetRefNo: artworkId}, (err, items) => {
                res.send(items);
            });
            client.close();
        });
    },
);

app.route('/api/image/:id').get((req, res) => {
    let artworkId = req.params.id;
    mongoDb.connect('mongodb://localhost:27017', (err, client) => {
        if (err) {
            return console.dir(err);
        }

        let db = client.db(databaseName);
        let collection = db.collection(imageCollection);
        collection.findOne({assetRefNo: artworkId}, (err, items) => {
            res.send(items);
        });
        client.close();
    });
});