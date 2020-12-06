var firebase_admin = require("firebase-admin");

// CHANGE: The path to your service account
var serviceAccount = require("../config/firebaseConfig.json");

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(serviceAccount),
    storageBucket: "gs://bshoes-2.appspot.com/"
});

var bucket = firebase_admin.storage().bucket();

async function uploadFileToFireBase(path_file, id_file) {

    const metadata = {
        metadata: {
        // This line is very important. It's to create a download token.
        firebaseStorageDownloadTokens: id_file
        },
        contentType: 'image/jpg',
        cacheControl: 'public, max-age=31536000',
    };

    // Uploads a local file to the bucket
    return bucket.upload(path_file , {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        metadata: metadata,
    })
    .then((data) => {
        let file = data[0];
        return `URL: https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${id_file}`;
    });
}

module.exports = uploadFileToFireBase;