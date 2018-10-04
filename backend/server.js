const express = require('express');
const mongoDb = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('server started');
});

let databaseName = 'serene-brushland';
let artworksCollection = 'artworks';
let imageCollection = 'images';
let artistCollection = 'artists';

app.route('/api/artworks').get((req, res) => {
    mongoDb.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (err, client) => {
        if (err) {
            return console.dir(err);
        }
        let db = client.db(databaseName);
        var collection = db.collection(artworksCollection);
        collection.find().sort({assetRefNo: 1}).toArray(function (err, items) {
            res.send(items);
            client.close();
        });
    });
});

app.route('/api/artwork/:id').get((req, res) => {
    let artworkId = req.params.id;
    mongoDb.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (err, client) => {
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
}
);

app.route('/api/image/:id').get((req, res) => {
    let artworkId = req.params.id;
    mongoDb.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (err, client) => {
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

app.route('/api/artist/:name').get((req, res) => {
    let name = req.params.name;
    mongoDb.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (err, client) => {
        if (err) {
            return console.dir(err);
        }
        let db = client.db(databaseName);
        let collection = db.collection(artistCollection);
        collection.findOne({name: name}, (err, items) => {
            res.send(items);
        });
        client.close();
    });

});

app.route('/api/artist/:name').post((req, res) => {
    let name = req.params.name;
    var data = req.body;
    mongoDb.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (err, client) => {
        if (err) {
            return console.dir(err);
        }
        let db = client.db(databaseName);
        let collection = db.collection(artistCollection);
        var newvalues = {
            $set: {
                bio: {
                    title: data.bio.title,
                    body: data.bio.body,
                    AASDLink: data.bio.AASDLink,
                    WikiLink: data.bio.WikiLink
                }
            }
        };
        collection.updateOne({name: name}, newvalues, (err, items) => {
            res.send(items);
        });
        client.close();
    });

});
