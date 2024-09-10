import admin, { ServiceAccount } from "firebase-admin";
import { config } from "dotenv";

config();

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_URL,
  "universe_domain":process.env.FIREBASE_UNIVERSE_DOMAIN
}


if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  throw new Error("Missing required fields in service account configuration");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export default admin;