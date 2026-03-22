# ⚠️ CRITICAL: Deploy Updated Firestore Rules

## Current Problem
❌ LeaderDashboard getting **"Missing or insufficient permissions"** error

This is because the Firestore security rules in the **code** have been updated, but Firebase Console still has the **OLD rules** that block leader access.

## Solution: Manually Update Rules in Firebase Console

Since you cannot run `firebase deploy` from the command line here, you must update the rules directly in Firebase Console:

### Step 1: Go to Firebase Console
Visit: https://console.firebase.google.com/

### Step 2: Select Your Project
- Click on **"troop242-54e6a"** project

### Step 3: Navigate to Firestore Rules
- Left sidebar → **Firestore Database**
- Click the **Rules** tab

### Step 4: Replace All Rules
Delete the existing rules and paste this entire content:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }

    function isLeader() {
      return isAuthenticated() && getUserRole() in ['leader', 'admin'];
    }

    function isScout() {
      return isAuthenticated() && getUserRole() == 'scout';
    }

    function isOwnUser(uid) {
      return request.auth.uid == uid;
    }

    // Validate activity data
    function isValidActivity(data) {
      return data.title != null && data.title is string && data.title.size() >= 3 && data.title.size() <= 100
        && data.type in ['activity', 'event']
        && data.date != null && data.date is timestamp
        && data.location != null && data.location is string
        && data.description != null && data.description is string
        && data.spots != null && data.spots is number && data.spots > 0;
    }

    // Validate user data
    function isValidUser(data) {
      return data.email != null && data.email is string
        && data.name != null && data.name is string && data.name.size() >= 2
        && data.role in ['scout', 'leader', 'admin']
        && data.status in ['pending', 'approved', 'rejected'];
    }

    // USERS COLLECTION - Strict access control
    match /users/{uid} {
      // Scout can only read own profile
      allow read: if isOwnUser(uid) && isScout();

      // Leaders/admins can read all users in the collection
      allow read: if isLeader();

      // Users can only write their own profile
      allow write: if isOwnUser(uid) && isValidUser(request.resource.data);

      // Admins can write any user
      allow write: if isAdmin() && isValidUser(request.resource.data);
    }

    // ACTIVITIES COLLECTION - Role-based access
    match /activities/{activityId} {
      // Scouts & Leaders: read all activities
      allow read: if isScout() || isLeader();

      // Leaders: create/update own, read signups
      allow create: if isLeader() && isValidActivity(request.resource.data) && request.resource.data.createdBy == request.auth.uid;
      allow update: if isLeader() &&
                        resource.data.createdBy == request.auth.uid &&
                        isValidActivity(request.resource.data);
      allow delete: if isLeader() && resource.data.createdBy == request.auth.uid;

      // Admins: full access
      allow read, write, delete: if isAdmin();

      // Nested: signups in activity
      match /signups/{signupId} {
        allow read: if parent.read;
        allow create: if isScout() && request.resource.data.uid == request.auth.uid;
        allow delete: if isScout() && resource.data.uid == request.auth.uid;
      }
    }

    // PROGRESS COLLECTION - User's own progress only
    match /progress/{uid} {
      // Users read own, leaders/admins read scouts only
      allow read: if isOwnUser(uid) && isScout() ||
                     isLeader() && get(/databases/$(database)/documents/users/$(uid)).data.role == 'scout';

      // Only user can write own progress
      allow write: if isOwnUser(uid) && isScout();
    }

    // INVITATIONS COLLECTION - Leaders create, anyone verify
    match /invitations/{code} {
      // Leaders can create invitations
      allow create: if isLeader() &&
                       request.resource.data.code != null &&
                       request.resource.data.role in ['scout', 'leader'] &&
                       request.resource.data.status == 'pending' &&
                       request.resource.data.createdAt != null &&
                       request.resource.data.expiresAt != null;

      // Anyone can read to verify
      allow read: if isAuthenticated();

      // Only leader who created can revoke
      allow update: if isLeader() && resource.data.createdBy == request.auth.uid;

      // System can mark as used (via Cloud Function)
      allow update: if resource.data.status == 'pending' && request.resource.data.status == 'used';
    }

    // ANNOUNCEMENTS COLLECTION - Read-only for all, write for admins
    match /announcements/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // EVENTS COLLECTION (Admin-only events) - Read all, write admins
    match /events/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // TROOP COLLECTION - Settings and config
    match /troop/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // SETTINGS COLLECTION - Admins only
    match /settings/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // AUDIT LOGS - Read own, admins read all, system writes
    match /auditLogs/{document=**} {
      allow read: if isAdmin() || resource.data.userId == request.auth.uid;
      allow create: if true; // Cloud Functions write these
      allow update, delete: if false; // Immutable
    }

    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 5: Click "Publish"
- Click the **Publish** button to deploy the rules

### Step 6: Verify
- You should see a success message: "Rules updated"
- The LeaderDashboard will **immediately** start loading data

## What Changed?

### Before (OLD RULES)
- ❌ Leaders could NOT read activities collection
- ❌ Leaders could NOT read users collection
- ✓ Only scouts could read activities

### After (NEW RULES)
- ✅ Leaders CAN read activities collection
- ✅ Leaders CAN read users collection
- ✅ Leaders can create/update/delete their own activities
- ✓ Scouts still can read activities

## Key Changes in Activities Collection:
**Line 65 changed from:**
```
allow read: if isScout();
```

**To:**
```
allow read: if isScout() || isLeader();
```

This allows both scouts AND leaders to read activities.

## After Deployment
Once you publish these rules:
1. ✅ Refresh the LeaderDashboard page
2. ✅ Scout roster will load
3. ✅ Activities and events will load
4. ✅ Signup data will be visible

The error "Missing or insufficient permissions" will disappear.
