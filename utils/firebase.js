var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://flutter-hayat.appspot.com/"
});
var bucket = admin.storage().bucket();
const d = new Date()
const date = new Date(d.setFullYear(d.getFullYear() + 200)).toString()

async function uploadFile(filepath, filename) {
    console.log("File path =>" + filepath)
    console.log("File name =>" + filename)
    try {
        const file = bucket.file(filename);
        const [exists] = await file.exists();

        if (exists) {
            console.log(`File with name ${filename} already exists. Deleting it...`);
            await file.delete();
            console.log(`File ${filename} deleted successfully.`);
        }

        await bucket.upload(filepath, {
            gzip: true,
            destination: filename,
            metadata: {
                cacheControl: 'public, max-age=31536000'
            }
        });

        console.log(`${filename} uploaded to bucket.`);
    } catch (e) {
        console.log("Error: ", e);
    }
}

async function generateSignedUrl(filename) {
    const options = {
        version: 'v2',
        action: 'read',
        expires: date
    };

    const [url] = await bucket.file(filename).getSignedUrl(options);
    imageUrl = url + ''
    console.log(url);
    return url
};

async function uploadAvatar(filepath, userId) {
    const imageName = `${userId}_profile.jpg`;
    // Check file exists
    const file = bucket.file(`ProfilePictures/${imageName}`);
    const [exists] = await file.exists();

    if (exists) {
        console.log(`File with name ${file.name} already exists. Deleting it...`);
        await file.delete();
        console.log(`File ${file.name} deleted successfully.`);
    }

    // Upload file to Firebase Storage
    await bucket.upload(filepath, {
        gzip: true,
        destination: `ProfilePictures/${imageName}`,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    console.log(`${imageName} uploaded successfully.`);

    if (!exists) {
        throw new Error(`File does not exist after upload: ${imageName}`);
    }

    // Generate signed URL
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
    });

    console.log('Generated URL:', url);
    return url;
}


module.exports = {
    admin,
    bucket,
    uploadFile,
    generateSignedUrl,
    uploadAvatar
}