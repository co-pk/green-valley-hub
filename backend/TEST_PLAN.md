# Green Valley Academy Application System Test Plan

## Admin Authentication Tests

### Admin Login
```bash
# Test valid admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@greenvalleyacademy.edu",
    "password": "your-admin-password"
  }'

# Test invalid credentials
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrong-password"
  }'
```

## Application Decision Tests

### Approve Application
```bash
# Test application approval
curl -X POST http://localhost:5000/api/admin/decision \
  -H "Content-Type: application/json" \
  -H "email: admin@greenvalleyacademy.edu" \
  -H "password: your-admin-password" \
  -d '{
    "studentId": "S123ABC",
    "approved": true
  }'

# Test application rejection
curl -X POST http://localhost:5000/api/admin/decision \
  -H "Content-Type: application/json" \
  -H "email: admin@greenvalleyacademy.edu" \
  -H "password: your-admin-password" \
  -d '{
    "studentId": "S123ABC",
    "approved": false
  }'
```

## Manual Test Cases

### Admin Authentication
1. Verify admin login with valid credentials succeeds
2. Verify admin login with invalid credentials fails
3. Verify inactive admin accounts cannot log in
4. Verify admin session persistence works correctly

### Application Processing
1. Verify pending applications are displayed correctly
2. Verify application approval updates Firestore correctly
3. Verify application rejection updates Firestore correctly
4. Verify approved applications activate student and parent accounts
5. Verify rejected applications do not activate accounts

### Email Notifications
1. Verify approval emails are sent to both student and parent
2. Verify rejection emails are sent to both student and parent
3. Verify email templates render correctly with dynamic data
4. Verify activation codes are only included in approval emails

### Security Checks
1. Verify non-admin users cannot access admin routes
2. Verify expired admin sessions are handled correctly
3. Verify input validation on all endpoints
4. Verify proper error handling and logging

## Expected Results

### Successful Application Approval
1. Firestore Update:
   - Student and parent records marked as active
   - Application status updated to 'approved'
   - Activation timestamps recorded
   
2. Email Notifications:
   - Both student and parent receive approval emails
   - Emails contain correct activation codes
   - Email templates properly personalized

### Successful Application Rejection
1. Firestore Update:
   - Application status updated to 'rejected'
   - No activation codes set
   - Rejection timestamp recorded
   
2. Email Notifications:
   - Both student and parent receive rejection emails
   - No activation codes included
   - Proper explanation and next steps provided

### Error Cases
1. Invalid Student ID:
   - Appropriate error response
   - No Firestore updates
   - No emails sent
   - Error logged

2. Email Failure:
   - Transaction rolled back
   - Error response returned
   - Incident logged
   - Admin notified

## Logging Verification
1. Check admin actions are logged:
   ```bash
   # Query Firestore logs collection
   firebase firestore:get logs --limit=10
   ```

2. Verify log entries contain:
   - Timestamp
   - Action type
   - Admin identifier
   - Success/failure status
   - Relevant IDs (student, parent)
   - Error details if applicable
