const express = require('express');
const mongoDb = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log('server started');
});

app.route('/api/artworks').get((req, res) => {
    mongoDb.connect("mongodb://localhost:27017", function (err, client) {
        if (err) {
            return console.dir(err);
        }
        let db = client.db('serene-brushland');
        var collection = db.collection('artworks');
        collection.find().sort({assetRefNo: 1}).toArray(function (err, items) {
            res.send(items);
            client.close();
        });
    });
})
;