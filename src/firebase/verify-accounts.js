import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://troop242-54e6a.firebaseio.com"
});

const db = admin.firestore();

async function verifyAccounts() {
  try {
    console.log('Checking Firestore accounts...\n');

    const usersSnap = await db.collection('users').get();

    if (usersSnap.empty) {
      console.log('No users found in Firestore');
      return;
    }

    console.log(`Found ${usersSnap.size} users:\n`);
    usersSnap.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Email: ${data.email}`);
      console.log(`Name: ${data.name}`);
      console.log(`Role: ${data.role}`);
      console.log(`Status: ${data.status}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyAccounts();
