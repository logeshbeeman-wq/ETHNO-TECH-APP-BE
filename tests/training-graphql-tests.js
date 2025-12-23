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
// BATCH TRAINING TESTS
// ============================================

// TEST 8: Get All Batch Trainings
// Expected: Returns array of all batch training records
query GetAllBatchTrainings {
  batchTrainings {
        id
        startTrainingDate
        endTrainingDate
        batch
        departments
        yearSem
        strength
        technology
        labNo
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

// TEST 9: Get Single Batch Training
// Variables: { "id": "1" }
// Expected: Returns single batch training record
query GetBatchTraining($id: ID!) {
    batchTraining(id: $id) {
        id
        startTrainingDate
        endTrainingDate
        batch
        departments
        yearSem
        strength
        technology
        labNo
        trainerName
    }
}

// TEST 10: Create Batch Training (Admin/Superadmin only)
// Variables: See below
// Expected: Creates new record and returns it
mutation CreateBatchTraining($input: CreateBatchTrainingInput!) {
    createBatchTraining(input: $input) {
        id
        batch
        departments
        yearSem
        technology
        labNo
        trainerName
        createdAt
    }
}
/* Variables for TEST 10:
{
  "input": {
    "startTrainingDate": "2024-03-20",
    "endTrainingDate": "2024-04-20",
    "batch": "Batch C",
    "departments": "Electronics Engineering",
    "yearSem": "4th Year - Sem 7",
    "strength": 30,
    "technology": "IoT",
    "labNo": "Lab 303",
    "trainerName": "Dr. Michael Chen",
    "trainerType": "Internal",
    "certification": "IoT Specialist",
    "trainingStatus": "Y",
    "examinationStatus": "Pending",
    "employeeId": "EMP006",
    "fdp": "Internet of Things Workshop"
  }
}
*/

// TEST 11: Update Batch Training (Admin/Superadmin only)
// Variables: See below
// Expected: Updates record and returns updated data
mutation UpdateBatchTraining($input: UpdateBatchTrainingInput!) {
    updateBatchTraining(input: $input) {
        id
        trainingStatus
        examinationStatus
        strength
        updatedAt
    }
}
/* Variables for TEST 11:
{
  "input": {
    "id": "1",
    "trainingStatus": "Y",
    "examinationStatus": "Completed",
    "strength": 38
  }
}
*/

// TEST 12: Filter by Batch
// Variables: { "batch": "Batch A" }
// Expected: Returns all trainings for Batch A
query GetBatchTrainingsByBatch($batch: String!) {
    batchTrainingsByBatch(batch: $batch) {
        id
        batch
        departments
        technology
        trainerName
        startTrainingDate
        endTrainingDate
    }
}

// TEST 13: Filter by Department
// Variables: { "department": "Computer Science" }
// Expected: Returns all trainings for Computer Science department
query GetBatchTrainingsByDepartment($department: String!) {
    batchTrainingsByDepartment(department: $department) {
        id
        batch
        departments
        yearSem
        technology
        trainerName
    }
}

// TEST 14: Filter by Technology
// Variables: { "technology": "Machine Learning" }
// Expected: Returns all Machine Learning trainings
query GetBatchTrainingsByTechnology($technology: String!) {
    batchTrainingsByTechnology(technology: $technology) {
        id
        batch
        departments
        technology
        trainerName
        trainingStatus
        examinationStatus
    }
}

// TEST 15: Delete Batch Training (Admin/Superadmin only)
// Variables: { "id": "1" }
// Expected: Returns true if deleted successfully
mutation DeleteBatchTraining($id: ID!) {
    deleteBatchTraining(id: $id)
}

// ============================================
// COMBINED TESTS
// ============================================

// TEST 16: Get Both Center and Batch Trainings
// Expected: Returns data from both tables
query GetAllTrainings {
  centerTrainings {
        id
        center
        technology
        trainerName
        trainingStatus
    }
  batchTrainings {
        id
        batch
        departments
        technology
        trainerName
        trainingStatus
    }
}

// ============================================
// ERROR HANDLING TESTS
// ============================================

// TEST 17: Query without Authentication
// Remove Authorization header
// Expected: Error "Authentication required"

// TEST 18: Create without Admin Role
// Login as regular user
// Expected: Error "Insufficient permissions"

// TEST 19: Query Non-existent ID
// Variables: { "id": "99999" }
// Expected: Returns null or error
query GetNonExistentCenterTraining {
    centerTraining(id: "99999") {
        id
        center
    }
}

// TEST 20: Invalid Date Range
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

Batch Training:
[ ] 8. Get all batch trainings
[ ] 9. Get single batch training by ID
[ ] 10. Create new batch training
[ ] 11. Update batch training
[ ] 12. Delete batch training
[ ] 13. Filter by batch
[ ] 14. Filter by department
[ ] 15. Filter by technology

Combined:
[ ] 16. Query both types together

Error Handling:
[ ] 17. Authentication error
[ ] 18. Authorization error
[ ] 19. Not found error
[ ] 20. Validation error

NOTES:
- Run database migration first: db/migrations/create_training_tables.sql
- Get JWT token by logging in first
- Set Authorization header for all requests
- Admin/Superadmin role required for mutations
- Check server logs for detailed error messages
*/
