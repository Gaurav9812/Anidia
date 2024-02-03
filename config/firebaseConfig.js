// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const { initializeApp } = require("firebase/app");

const {
    getStorage,
    getDownloadURL,
    ref,
    uploadBytesResumable
} = require("firebase/storage");
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
module.exports.firebaseConfig;

// Initialize Firebase

module.exports.uploadFile = async (file, path,user) => {
    const metaData = {
        contentType: file.mimetype
    };

    const app = initializeApp(firebaseConfig);
    const storage = getStorage();
    path = path ? path : "";
    const imageRef = ref(
        storage,
        "files/" +
            path +
            user.createFileName({
                fieldName: file.fieldname,
                mimetype: file.mimetype
            })
    );
    const task = await uploadBytesResumable(imageRef, file.buffer, metaData);
    return await getDownloadURL(task.ref);
};
