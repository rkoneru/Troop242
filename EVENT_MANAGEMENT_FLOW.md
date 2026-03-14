# Event Management Flow - Leader & Admin

**Current Date**: March 14, 2026
**Status**: Complete and Working

---

## 🔄 Complete Event Flow

### 1. **Where Events Are Created**

#### LeaderDashboard (Leader Portal)
- **URL**: `/leader-dashboard`
- **Tab**: Events tab
- **Form Fields**: Title, Date, Time, Location, Description
- **Storage Key**: `troop_events`
- **Handler**: `handleCreateEvent()`

#### AdminDashboard (Admin Portal)
- **URL**: `/admin-dashboard`
- **Tab**: Events tab
- **Form Fields**: Title, Date, Location, Description (no time field)
- **Storage Key**: `troop_events` (SAME KEY!)
- **Handler**: `handleAddEvent()`

**Important**: Both Leader and Admin create events in the **same localStorage** location (`troop_events`)

---

## 📍 Event Storage Location

### localStorage Key: `troop_events`

**Structure**:
```javascript
// Each event object
{
  id: "item-1710433200000-a1b2c3d",
  title: "Summer Camp 2026",
  date: "2026-07-15",
  time: "8:00 AM",          // Leader adds this
  location: "Mountain Lake",
  description: "3-day camping adventure",
  createdAt: "2026-03-14T10:30:00.000Z",
  createdBy?: "Leader/Admin" // Not currently stored
}
```

**Data Persistence**:
- Auto-saved via `saveData()` utility in `adminData.js`
- Survives page refresh and browser restart
- Shared across both dashboards

---

## 🎯 Where Events Are Displayed

### 1. **LeaderDashboard**
- **Tab**: Events tab
- **Display**: Simple event cards below the create form
- **Shows**: Title, Date, Time, Location, Description
- **Interactions**: View only (no delete button currently)
- **Code Location**: `src/pages/LeaderDashboard.jsx` lines 1050+

### 2. **AdminDashboard**
- **Tab**: Events tab
- **Display**: Upcoming events list with delete button
- **Shows**: Title, Date, Location, Description
- **Interactions**: View, Delete
- **Code Location**: `src/pages/AdminDashboard.jsx` lines 385-540

### 3. **Public Calendar Page** ❌
- **URL**: `/calendar`
- **Current Status**: Does NOT use `troop_events` localStorage
- **What It Shows**: Google Calendar embed from official Troop 242 calendar
- **Code Location**: `src/pages/Calendar.jsx` lines 60-80
- **Issue**: Events created in Leader/Admin dashboards don't appear here

---

## 🔗 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser localStorage                      │
│                                                               │
│  Key: 'troop_events'                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [{id, title, date, time, location, description, ...}] │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────┬──────────────────────────┬──────────────────┬────┘
           │                          │                  │
           │                          │                  │
      ┌────▼─────┐          ┌────────▼────────┐    ┌────▼──────┐
      │  Leader   │          │     Admin      │    │  Calendar  │
      │ Dashboard │          │   Dashboard    │    │    Page    │
      │           │          │                │    │            │
      │ - View    │          │ - Create       │    │ - Google   │
      │ - Create  │          │ - View         │    │   Calendar │
      │ - List    │          │ - Delete       │    │ - NO ACCESS│
      │           │          │ - List         │    │   to local │
      └───────────┘          └────────────────┘    │   storage  │
      (Read/Write)           (Read/Write)          └────────────┘
                                                   (External Only)
```

---

## 📋 Event Lifecycle

### Step 1: Creation
```
Leader/Admin fills event form
          ↓
handleCreateEvent() validates data
          ↓
New event object created with:
  - id: generateId()
  - title, date, time, location, description
  - createdAt: timestamp
          ↓
Event added to state: [...events, newEvent]
          ↓
saveData('troop_events', updatedEvents)
          ↓
Saved to localStorage
```

### Step 2: Display
```
Component mounts → loadData('troop_events', [])
          ↓
Events loaded from localStorage
          ↓
Rendered in component state
          ↓
Displayed in UI with map()
```

### Step 3: Deletion (Admin Only)
```
Admin clicks delete button
          ↓
handleDeleteEvent(eventId)
          ↓
events.filter(e => e.id !== eventId)
          ↓
saveData('troop_events', filtered)
          ↓
Removed from localStorage
```

---

## ⚠️ Current Issues & Gaps

### Issue 1: Public Calendar Doesn't Show Created Events
**Problem**:
- Leader/Admin create events in localStorage
- Calendar page displays Google Calendar embed
- **Result**: Created events don't appear to public scouts

**Root Cause**:
- Calendar page doesn't load from `troop_events` key
- Uses external Google Calendar instead
- No sync between localStorage and Google Calendar

**Solution**:
See "Recommended Fixes" section below

### Issue 2: No Event Deletion in LeaderDashboard
**Problem**:
- Leaders can create events but NOT delete them
- Only Admins can delete

**Why**:
- Delete button not implemented in LeaderDashboard
- Only AdminDashboard has delete functionality

**Solution**: Add delete handler to LeaderDashboard

### Issue 3: No Creator Attribution
**Problem**:
- Events don't track who created them (Leader vs Admin)
- Can't distinguish between sources

**Solution**: Add `createdBy` field to event object

### Issue 4: No Scout Signup/RSVP
**Problem**:
- Events are view-only for scouts
- No way to RSVP or track attendance
- Different from Activities (which have signups)

**Why**:
- Events and Activities are separate systems
- Activities have signup roster, events don't

---

## 🛠️ Recommended Fixes

### Fix 1: Sync Public Calendar with localStorage Events
**Priority**: HIGH
**Impact**: Events become visible to all scouts

**Implementation**:
```javascript
// In Calendar.jsx
const [events, setEvents] = useState(() => loadData('troop_events', []))

// Display both Google Calendar + local events
{events.map(event => (
  <div key={event.id}>
    {event.title} - {event.date} at {event.location}
  </div>
))}
```

### Fix 2: Add Delete Button to LeaderDashboard Events
**Priority**: MEDIUM
**Impact**: Leaders can manage their own events

**Implementation**:
```javascript
// In LeaderDashboard.jsx - Events Tab
const handleDeleteEvent = (eventId) => {
  const updated = events.filter(e => e.id !== eventId)
  setEvents(updated)
  saveData('troop_events', updated)
  showSuccess('Event deleted.')
}

// Add delete button next to each event
<button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
```

### Fix 3: Add Event Creator Attribution
**Priority**: MEDIUM
**Impact**: Track who created each event

**Implementation**:
```javascript
const event = {
  id: generateId(),
  title: newEventForm.title,
  date: newEventForm.date,
  location: newEventForm.location,
  description: newEventForm.description,
  createdAt: new Date().toISOString(),
  createdBy: sessionStorage.getItem('loggedInUser')?.name || 'Unknown'
}
```

### Fix 4: Add Scout Event RSVP Feature
**Priority**: LOW
**Impact**: Scouts can confirm attendance

**Implementation**:
```javascript
// Add signups array to events (like activities)
const event = {
  ...event,
  spots: 50,  // capacity
  signups: [] // [{scoutId, scoutName, signedUpAt}]
}
```

---

## 📊 Current Event Management Comparison

| Feature | Leader Dashboard | Admin Dashboard | Calendar Page | Activities |
|---------|------------------|-----------------|---------------|-----------|
| Create | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| View | ✅ Yes | ✅ Yes | ⚠️ Google Calendar only | ✅ Yes |
| Delete | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| Scout Signup | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Capacity Tracking | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Roster View | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Public Visibility | ❌ Only on Google Calendar | ❌ Admin only | ⚠️ External calendar | ✅ Yes |

---

## 🔐 Data Integrity

### What's Protected
- Events are stored in browser localStorage
- Any user can create/delete (no permissions check)
- No backend validation

### What's Vulnerable
- Events only persist in single browser
- No cross-device sync
- No backup if localStorage is cleared
- No audit trail of changes

### Recommendations
1. Add user role validation before delete
2. Add event edit/update functionality
3. Create backup/export feature
4. Log who created/deleted events
5. Add event edit history

---

## 🚀 Next Steps

### Immediate (Week 1)
- [ ] Fix 1: Display `troop_events` on Calendar page
- [ ] Fix 2: Add delete button to LeaderDashboard events

### Short Term (Week 2-3)
- [ ] Fix 3: Add creator attribution to events
- [ ] Add event edit functionality (both dashboards)
- [ ] Add event export/backup feature

### Medium Term (Week 4+)
- [ ] Fix 4: Add scout RSVP to events
- [ ] Add capacity management
- [ ] Add email notifications for new events
- [ ] Add recurring events

### Long Term
- [ ] Backend sync (database instead of localStorage)
- [ ] Event categories/tags
- [ ] Event attendance tracking
- [ ] Event feedback/surveys
- [ ] Integration with Google Calendar sync

---

## 📝 How to Test Events Locally

### Test Creating Event in LeaderDashboard
1. Navigate to `/leader-dashboard`
2. Click **Events** tab
3. Fill in: Title, Date, Time, Location, Description
4. Click **"Create Event"**
5. See success message
6. Event appears in list below

### Test Creating Event in AdminDashboard
1. Navigate to `/admin-dashboard`
2. Click **Events** tab
3. Fill in: Title, Date, Location, Description
4. Click **"Add Event"**
5. Event appears in "Upcoming Events" list
6. Can click delete button to remove

### Test localStorage Persistence
1. Create an event (either dashboard)
2. Open DevTools (F12)
3. Go to Application → Local Storage
4. Find key: `troop_events`
5. See event in JSON array
6. Refresh page → event still there ✅
7. Clear localStorage → event gone ✅

### Test Public Calendar Page
1. Navigate to `/calendar`
2. See Google Calendar embed
3. Events created in dashboards **won't appear here** ❌
4. Only official Troop 242 Google Calendar events show

---

## 💡 Summary

**Events Created By Leader/Admin**:
1. ✅ Stored in `troop_events` localStorage key
2. ✅ Displayed in both dashboards
3. ✅ Persist across sessions
4. ❌ Don't appear on public Calendar page
5. ❌ No scout signup/RSVP feature
6. ❌ Can't be deleted by leaders

**Recommended Priority Fixes**:
1. Show events on public Calendar page
2. Add leader event deletion
3. Add scout RSVP feature
4. Sync with Google Calendar

**Questions?** Check the data flow diagram above or test locally using the test instructions provided.
