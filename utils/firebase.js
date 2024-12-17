// var admin = require("firebase-admin");
// var serviceAccount = require("../serviceAccountKey.json")
// // admin.initializeApp({
// //     credential: admin.credential.cert(serviceAccount),
// //     storageBucket: "gs://flutter-hayat.appspot.com/"
// // });
// var bucket = admin.storage().bucket();
// const d = new Date()
// const date = new Date(d.setFullYear(d.getFullYear() + 200)).toString()

// async function uploadFile(filepath, filename) {
//     console.log("File path =>" + filepath)
//     console.log("File name =>" + filename)
//     await bucket.upload(filepath, {
//         gzip: true,
//         destination: filename,
//         metadata: {
//             cacheControl: 'public, max-age=31536000'
//         }
//     });

//     console.log(`${filename} uploaded to bucket.`);
// }

// async function generateSignedUrl(filename) {
//     const options = {
//         version: 'v2',
//         action: 'read',
//         expires: date
//     };

//     const [url] = await bucket.file(filename).getSignedUrl(options);
//     imageUrl = url + ''
//     console.log(url);
//     return url
// };

// module.exports = {
//     admin,
//     bucket,
//     uploadFile,
//     generateSignedUrl
// }