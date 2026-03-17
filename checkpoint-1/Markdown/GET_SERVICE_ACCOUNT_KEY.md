# Get Your Firebase Service Account Key

To automatically create test users, you need to download your Firebase service account key.

## Steps:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `troop242-54e6a` project
3. Click the **gear icon** (Settings) in the top-left
4. Click **Project Settings**
5. Go to the **Service Accounts** tab
6. Click **Generate New Private Key**
7. A JSON file will download — save it as `serviceAccountKey.json` in the **project root** directory

## File Location:
```
c:\Users\Rakesh\OneDrive\Documents\BSA\Troop242\serviceAccountKey.json
```

## Next Step:
Once you've saved the file, run:
```bash
node setup-firebase-users.js
```

This will create all 3 test users automatically.

⚠️ **Important:** Keep `serviceAccountKey.json` private! Don't commit it to version control.
