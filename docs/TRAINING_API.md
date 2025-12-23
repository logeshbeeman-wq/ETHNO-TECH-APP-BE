# Training Management GraphQL API Documentation

This document provides examples of all GraphQL queries and mutations for managing Center Training and Batch Training records.

## Authentication

All queries and mutations require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Center Training (Tab 1)

### Queries

#### 1. Get All Center Trainings

```graphql
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
```

#### 2. Get Single Center Training by ID

```graphql
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
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "1"
}
```

#### 3. Get Center Trainings by Center

```graphql
query GetCenterTrainingsByCenter($center: String!) {
  centerTrainingsByCenter(center: $center) {
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
```

**Variables:**
```json
{
  "center": "Main Campus"
}
```

#### 4. Get Center Trainings by Technology

```graphql
query GetCenterTrainingsByTechnology($technology: String!) {
  centerTrainingsByTechnology(technology: $technology) {
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
```

**Variables:**
```json
{
  "technology": "React.js"
}
```

### Mutations

#### 1. Create Center Training

```graphql
mutation CreateCenterTraining($input: CreateCenterTrainingInput!) {
  createCenterTraining(input: $input) {
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
  }
}
```

**Variables:**
```json
{
  "input": {
    "startTrainingDate": "2024-03-01",
    "endTrainingDate": "2024-04-01",
    "center": "Main Campus",
    "strength": 30,
    "technology": "React.js",
    "trainerName": "John Doe",
    "trainerType": "Internal",
    "certification": "AWS Certified",
    "trainingStatus": "Y",
    "examinationStatus": "Pending",
    "employeeId": "EMP001",
    "fdp": "Advanced Web Development"
  }
}
```

#### 2. Update Center Training

```graphql
mutation UpdateCenterTraining($input: UpdateCenterTrainingInput!) {
  updateCenterTraining(input: $input) {
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
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "1",
    "trainingStatus": "Y",
    "examinationStatus": "Completed",
    "strength": 35
  }
}
```

#### 3. Delete Center Training

```graphql
mutation DeleteCenterTraining($id: ID!) {
  deleteCenterTraining(id: $id)
}
```

**Variables:**
```json
{
  "id": "1"
}
```

---

## Batch Training (Tab 2)

### Queries

#### 1. Get All Batch Trainings

```graphql
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
```

#### 2. Get Single Batch Training by ID

```graphql
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
```

**Variables:**
```json
{
  "id": "1"
}
```

#### 3. Get Batch Trainings by Batch

```graphql
query GetBatchTrainingsByBatch($batch: String!) {
  batchTrainingsByBatch(batch: $batch) {
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
  }
}
```

**Variables:**
```json
{
  "batch": "Batch A"
}
```

#### 4. Get Batch Trainings by Department

```graphql
query GetBatchTrainingsByDepartment($department: String!) {
  batchTrainingsByDepartment(department: $department) {
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
  }
}
```

**Variables:**
```json
{
  "department": "Computer Science"
}
```

#### 5. Get Batch Trainings by Technology

```graphql
query GetBatchTrainingsByTechnology($technology: String!) {
  batchTrainingsByTechnology(technology: $technology) {
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
  }
}
```

**Variables:**
```json
{
  "technology": "Machine Learning"
}
```

### Mutations

#### 1. Create Batch Training

```graphql
mutation CreateBatchTraining($input: CreateBatchTrainingInput!) {
  createBatchTraining(input: $input) {
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
  }
}
```

**Variables:**
```json
{
  "input": {
    "startTrainingDate": "2024-03-01",
    "endTrainingDate": "2024-04-01",
    "batch": "Batch A",
    "departments": "Computer Science",
    "yearSem": "3rd Year - Sem 5",
    "strength": 35,
    "technology": "Machine Learning",
    "labNo": "Lab 101",
    "trainerName": "Dr. Robert Brown",
    "trainerType": "Internal",
    "certification": "ML Certified",
    "trainingStatus": "Y",
    "examinationStatus": "Pending",
    "employeeId": "EMP003",
    "fdp": "AI and ML Workshop"
  }
}
```

#### 2. Update Batch Training

```graphql
mutation UpdateBatchTraining($input: UpdateBatchTrainingInput!) {
  updateBatchTraining(input: $input) {
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
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "1",
    "trainingStatus": "Y",
    "examinationStatus": "Completed",
    "strength": 40
  }
}
```

#### 3. Delete Batch Training

```graphql
mutation DeleteBatchTraining($id: ID!) {
  deleteBatchTraining(id: $id)
}
```

**Variables:**
```json
{
  "id": "1"
}
```

---

## Permission Requirements

- **Read Operations (Queries)**: All authenticated users
- **Create/Update/Delete Operations (Mutations)**: Only users with `admin` or `superadmin` roles

---

## Error Handling

All queries and mutations may return the following errors:

1. **Authentication Error**: "Authentication required"
   - Occurs when no valid JWT token is provided

2. **Authorization Error**: "Insufficient permissions"
   - Occurs when a user without admin/superadmin role attempts to create/update/delete

3. **Validation Error**: Various messages based on input validation
   - Occurs when required fields are missing or invalid

4. **Not Found Error**: "Failed to find [resource]"
   - Occurs when querying for a non-existent record

---

## Testing with GraphQL Playground

1. Start your server
2. Navigate to `http://localhost:4000/graphql`
3. Set the Authorization header in the HTTP Headers section:
   ```json
   {
     "Authorization": "Bearer <your-jwt-token>"
   }
   ```
4. Copy and paste any of the above queries/mutations
5. Provide the required variables in the Variables section
6. Click the Play button to execute

---

## Date Format

All dates should be in ISO 8601 format: `YYYY-MM-DD`

Example: `2024-03-15`
