// Test GraphQL Queries for Training Management System
// Copy these queries into GraphQL Playground (http://localhost:4000/graphql)
// Remember to set Authorization header: { "Authorization": "Bearer <your-jwt-token>" }

// ============================================
// CENTER TRAINING TESTS
// ============================================

// TEST 1: Get All Center Trainings
// Expected: Returns array of all center training records
query GetAllCenterTrainings {
  centerTrainings {
        id
        startTrainingDate
        endTrainingDate
        center
        strength
        technology
        trainerName
        trainerType
        certification
        trainingStatus
        examinationStatus
        employeeId
        fdp
        createdAt
        updatedAt
    }
}

// TEST 2: Get Single Center Training
// Variables: { "id": "1" }
// Expected: Returns single center training record
query GetCenterTraining($id: ID!) {
    centerTraining(id: $id) {
        id
        startTrainingDate
        endTrainingDate
        center
        strength
        technology
        trainerName
        trainerType
        certification
        trainingStatus
        examinationStatus
        employeeId
        fdp
    }
}

// TEST 3: Create Center Training (Admin/Superadmin only)
// Variables: See below
// Expected: Creates new record and returns it
mutation CreateCenterTraining($input: CreateCenterTrainingInput!) {
    createCenterTraining(input: $input) {
        id
        center
        technology
        trainerName
        startTrainingDate
        endTrainingDate
        createdAt
    }
}
/* Variables for TEST 3:
{
  "input": {
    "startTrainingDate": "2024-03-15",
    "endTrainingDate": "2024-04-15",
    "center": "Innovation Hub",
    "strength": 25,
    "technology": "Node.js",
    "trainerName": "Alice Johnson",
    "trainerType": "External",
    "certification": "Node.js Expert",
    "trainingStatus": "Y",
    "examinationStatus": "Scheduled",
    "employeeId": "EMP005",
    "fdp": "Backend Development Masterclass"
  }
}
*/

// TEST 4: Update Center Training (Admin/Superadmin only)
// Variables: See below
// Expected: Updates record and returns updated data
mutation UpdateCenterTraining($input: UpdateCenterTrainingInput!) {
    updateCenterTraining(input: $input) {
        id
        trainingStatus
        examinationStatus
        strength
        updatedAt
    }
}
/* Variables for TEST 4:
{
  "input": {
    "id": "1",
    "trainingStatus": "Y",
    "examinationStatus": "Completed",
    "strength": 32
  }
}
*/

// TEST 5: Filter by Center
// Variables: { "center": "Main Campus" }
// Expected: Returns all trainings at Main Campus
query GetCenterTrainingsByCenter($center: String!) {
    centerTrainingsByCenter(center: $center) {
        id
        center
        technology
        trainerName
        startTrainingDate
        endTrainingDate
    }
}

// TEST 6: Filter by Technology
// Variables: { "technology": "React.js" }
// Expected: Returns all React.js trainings
query GetCenterTrainingsByTechnology($technology: String!) {
    centerTrainingsByTechnology(technology: $technology) {
        id
        center
        technology
        trainerName
        trainingStatus
        examinationStatus
    }
}

// TEST 7: Delete Center Training (Admin/Superadmin only)
// Variables: { "id": "1" }
// Expected: Returns true if deleted successfully
mutation DeleteCenterTraining($id: ID!) {
    deleteCenterTraining(id: $id)
}

// ============================================
// ERROR HANDLING TESTS
// ============================================

// TEST 8: Query without Authentication
// Remove Authorization header
// Expected: Error "Authentication required"

// TEST 9: Create without Admin Role
// Login as regular user
// Expected: Error "Insufficient permissions"

// TEST 10: Query Non-existent ID
// Variables: { "id": "99999" }
// Expected: Returns null or error
query GetNonExistentCenterTraining {
    centerTraining(id: "99999") {
        id
        center
    }
}

// TEST 11: Invalid Date Range
// Start date after end date
// Expected: Validation error (if service layer is used)
mutation CreateInvalidDateRange {
    createCenterTraining(input: {
        startTrainingDate: "2024-04-01"
    endTrainingDate: "2024-03-01"
    center: "Test"
    strength: 10
    technology: "Test"
    trainerName: "Test"
    trainerType: "Test"
    certification: "Test"
    trainingStatus: "Y"
    examinationStatus: "Test"
    employeeId: "TEST"
    fdp: "Test"
    }) {
        id
    }
}

// ============================================
// TESTING CHECKLIST
// ============================================

/*
✅ TEST CHECKLIST:

Center Training:
[ ] 1. Get all center trainings
[ ] 2. Get single center training by ID
[ ] 3. Create new center training
[ ] 4. Update center training
[ ] 5. Delete center training
[ ] 6. Filter by center
[ ] 7. Filter by technology

Error Handling:
[ ] 8. Authentication error
[ ] 9. Authorization error
[ ] 10. Not found error
[ ] 11. Validation error

NOTES:
- Run database migration first: db/migrations/create_training_tables.sql
- Get JWT token by logging in first
- Set Authorization header for all requests
- Admin/Superadmin role required for mutations
- Check server logs for detailed error messages
*/
