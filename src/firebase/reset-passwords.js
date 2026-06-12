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

const auth = admin.auth();
const db = admin.firestore();

async function resetPasswords() {
  try {
    console.log('Resetting passwords to simple credentials...\n');

    const accounts = [
      { email: 'admin@troop242.com', password: 'admin123', name: 'Admin User', role: 'admin' },
      { email: 'leader@troop242.com', password: 'leader123', name: 'Leader User', role: 'leader' },
      { email: 'scout@troop242.com', password: 'scout123', name: 'Scout User', role: 'scout' }
    ];

    for (const account of accounts) {
      try {
        const user = await auth.getUserByEmail(account.email);

        // Update password
        await auth.updateUser(user.uid, {
          password: account.password
        });

        // Update Firestore
        await db.collection('users').doc(user.uid).update({
          name: account.name,
          role: account.role,
          status: 'approved',
          password: admin.firestore.FieldValue.delete()
        });

        console.log(`✓ Reset ${account.email}`);
      } catch (error) {
        console.error(`✗ Error with ${account.email}:`, error.message);
      }
    }

    console.log('\n📧 New Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN:');
    console.log('  Email: admin@troop242.com');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('LEADER:');
    console.log('  Email: leader@troop242.com');
    console.log('  Password: leader123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SCOUT:');
    console.log('  Email: scout@troop242.com');
    console.log('  Password: scout123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetPasswords();
