import admin from "firebase-admin"

interface firebaseAdminConfig {
    project_id: string,
    private_key: string,
    storage_bucket: string,
    client_email: string
}
function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdmin(config: firebaseAdminConfig) {
    const private_key = formatPrivateKey(config.private_key);

    if(admin.apps.length > 0){
        return admin.app();
    }

    const cert = admin.credential.cert({
        projectId: config.project_id,
        clientEmail: config.client_email,
        privateKey: private_key        
    })

    return admin.initializeApp({
        credential: cert,
        projectId: config.project_id,
        storageBucket: config.storage_bucket,
    });
}

export async function initAdmin(){
    
    const adminApp = {
        project_id: process.env.FIREBASE_PROJECT_ID as string,
        client_email: process.env.FIREBASE_CLIENT_EMAIL as string,
        private_key: process.env.FIREBASE_PRIVATE_KEY as string,
        storage_bucket: process.env.FIREBASE_STORAGE_BUCKET as string
    }

    return createFirebaseAdmin(adminApp);
}
