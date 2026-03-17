# Enable Email/Password Authentication in Firebase

The automated script encountered an error because Email/Password authentication is not enabled.

## Steps to Enable:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `troop242-54e6a` project
3. Go to **Authentication** (left sidebar)
4. Click the **Sign-in method** tab
5. Click on **Email/Password**
6. Toggle the **Enable** switch to ON
7. Click **Save**

## Then:

Once you've enabled Email/Password authentication, run the setup script again:

```bash
node setup-firebase-users.js
```

This will create all 3 test users automatically:
- `scout@troop242.com` / `Scout123!@#`
- `leader@troop242.com` / `Leader123!@#`
- `admin@troop242.com` / `Admin123!@#`
