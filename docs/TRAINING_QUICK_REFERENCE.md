# Training Management - Quick Reference

## 🔑 Authentication Header
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

---

## 📋 CENTER TRAINING (Tab 1)

### GET ALL
```graphql
query { centerTrainings { id center technology trainerName } }
```

### GET ONE
```graphql
query { centerTraining(id: "1") { id center technology } }
```

### CREATE
```graphql
mutation {
  createCenterTraining(input: {
    startTrainingDate: "2024-03-01"
    endTrainingDate: "2024-04-01"
    center: "Main Campus"
    strength: 30
    technology: "React.js"
    trainerName: "John Doe"
    trainerType: "Internal"
    certification: "AWS Certified"
    trainingStatus: "Y"
    examinationStatus: "Pending"
    employeeId: "EMP001"
    fdp: "Web Development"
  }) { id }
}
```

### UPDATE
```graphql
mutation {
  updateCenterTraining(input: {
    id: "1"
    trainingStatus: "Y"
    examinationStatus: "Completed"
  }) { id updatedAt }
}
```

### DELETE
```graphql
mutation { deleteCenterTraining(id: "1") }
```

### FILTER BY CENTER
```graphql
query { centerTrainingsByCenter(center: "Main Campus") { id technology } }
```

### FILTER BY TECHNOLOGY
```graphql
query { centerTrainingsByTechnology(technology: "React.js") { id center } }
```

---

## 🎓 BATCH TRAINING (Tab 2)

### GET ALL
```graphql
query { batchTrainings { id batch departments technology } }
```

### GET ONE
```graphql
query { batchTraining(id: "1") { id batch departments } }
```

### CREATE
```graphql
mutation {
  createBatchTraining(input: {
    startTrainingDate: "2024-03-01"
    endTrainingDate: "2024-04-01"
    batch: "Batch A"
    departments: "Computer Science"
    yearSem: "3rd Year - Sem 5"
    strength: 35
    technology: "Machine Learning"
    labNo: "Lab 101"
    trainerName: "Dr. Robert Brown"
    trainerType: "Internal"
    certification: "ML Certified"
    trainingStatus: "Y"
    examinationStatus: "Pending"
    employeeId: "EMP003"
    fdp: "AI Workshop"
  }) { id }
}
```

### UPDATE
```graphql
mutation {
  updateBatchTraining(input: {
    id: "1"
    trainingStatus: "Y"
    examinationStatus: "Completed"
  }) { id updatedAt }
}
```

### DELETE
```graphql
mutation { deleteBatchTraining(id: "1") }
```

### FILTER BY BATCH
```graphql
query { batchTrainingsByBatch(batch: "Batch A") { id technology } }
```

### FILTER BY DEPARTMENT
```graphql
query { batchTrainingsByDepartment(department: "Computer Science") { id batch } }
```

### FILTER BY TECHNOLOGY
```graphql
query { batchTrainingsByTechnology(technology: "Machine Learning") { id batch } }
```

---

## 📊 ALL FIELDS

### Center Training Fields
```
id, startTrainingDate, endTrainingDate, center, strength, 
technology, trainerName, trainerType, certification, 
trainingStatus, examinationStatus, employeeId, fdp, 
createdAt, updatedAt
```

### Batch Training Fields
```
id, startTrainingDate, endTrainingDate, batch, departments, 
yearSem, strength, technology, labNo, trainerName, 
trainerType, certification, trainingStatus, examinationStatus, 
employeeId, fdp, createdAt, updatedAt
```

---

## 🔒 Permissions
- **Queries**: All authenticated users
- **Mutations**: Admin & Superadmin only

---

## 📅 Date Format
`YYYY-MM-DD` (e.g., `2024-03-15`)
