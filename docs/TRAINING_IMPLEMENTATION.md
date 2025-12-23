# Training Management System - Implementation Guide

This document explains the complete implementation of the Training Management System with GraphQL CRUD operations.

## 📋 Overview

The system manages two types of training records:
1. **Center Training (Tab 1)** - Training conducted at various centers
2. **Batch Training (Tab 2)** - Training for specific batches/departments

## 🏗️ Architecture

The implementation follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         GraphQL Resolvers               │
│    (src/resolvers/training.js)          │
│  - Authentication & Authorization       │
│  - Request/Response handling            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Service Layer (Optional)        │
│    (src/services/trainingService.js)    │
│  - Business logic validation            │
│  - Complex operations                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            Models Layer                 │
│  (src/models/CenterTraining.js)         │
│  (src/models/BatchTraining.js)          │
│  - Database operations                  │
│  - Data mapping                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Database (MySQL)               │
│  - center_training table                │
│  - batch_training table                 │
└─────────────────────────────────────────┘
```

## 📁 Files Created

### 1. Models
- `src/models/CenterTraining.js` - Center training data model
- `src/models/BatchTraining.js` - Batch training data model

### 2. GraphQL Schema
- `src/graphql/training.schema.js` - Type definitions for training entities

### 3. Resolvers
- `src/resolvers/training.js` - GraphQL resolvers with auth/authz

### 4. Services (Optional)
- `src/services/trainingService.js` - Business logic layer

### 5. Database
- `db/migrations/create_training_tables.sql` - Database schema

### 6. Documentation
- `docs/TRAINING_API.md` - Complete API documentation with examples

## 🗄️ Database Schema

### Center Training Table
```sql
CREATE TABLE center_training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_training_date DATE NOT NULL,
  end_training_date DATE NOT NULL,
  center VARCHAR(255) NOT NULL,
  strength INT NOT NULL,
  technology VARCHAR(255) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  trainer_type VARCHAR(100) NOT NULL,
  certification VARCHAR(255) NOT NULL,
  training_status VARCHAR(50) NOT NULL,
  examination_status VARCHAR(50) NOT NULL,
  employee_id VARCHAR(100) NOT NULL,
  fdp VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Batch Training Table
```sql
CREATE TABLE batch_training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_training_date DATE NOT NULL,
  end_training_date DATE NOT NULL,
  batch VARCHAR(100) NOT NULL,
  departments VARCHAR(255) NOT NULL,
  year_sem VARCHAR(50) NOT NULL,
  strength INT NOT NULL,
  technology VARCHAR(255) NOT NULL,
  lab_no VARCHAR(100) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  trainer_type VARCHAR(100) NOT NULL,
  certification VARCHAR(255) NOT NULL,
  training_status VARCHAR(50) NOT NULL,
  examination_status VARCHAR(50) NOT NULL,
  employee_id VARCHAR(100) NOT NULL,
  fdp VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 Setup Instructions

### Step 1: Run Database Migration

Execute the SQL migration file to create the tables:

```bash
# Using MySQL CLI
mysql -u your_username -p your_database < db/migrations/create_training_tables.sql

# Or using a MySQL client
# Copy and paste the contents of create_training_tables.sql
```

### Step 2: Verify Installation

The following files should already be updated:
- ✅ `src/graphql/schema.js` - Includes training schema and resolvers
- ✅ All models, resolvers, and schemas are created

### Step 3: Restart Your Server

```bash
npm run dev
```

### Step 4: Test the API

Navigate to your GraphQL playground (typically `http://localhost:4000/graphql`) and try the queries from `docs/TRAINING_API.md`.

## 🔐 Authentication & Authorization

### Authentication
All queries and mutations require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Authorization
- **Read Operations (Queries)**: All authenticated users
- **Write Operations (Mutations)**: Only `admin` and `superadmin` roles

## 📊 Available Operations

### Center Training (Tab 1)

#### Queries
- `centerTrainings` - Get all center training records
- `centerTraining(id)` - Get a specific center training by ID
- `centerTrainingsByCenter(center)` - Filter by center
- `centerTrainingsByTechnology(technology)` - Filter by technology

#### Mutations
- `createCenterTraining(input)` - Create new center training
- `updateCenterTraining(input)` - Update existing center training
- `deleteCenterTraining(id)` - Delete center training

### Batch Training (Tab 2)

#### Queries
- `batchTrainings` - Get all batch training records
- `batchTraining(id)` - Get a specific batch training by ID
- `batchTrainingsByBatch(batch)` - Filter by batch
- `batchTrainingsByDepartment(department)` - Filter by department
- `batchTrainingsByTechnology(technology)` - Filter by technology

#### Mutations
- `createBatchTraining(input)` - Create new batch training
- `updateBatchTraining(input)` - Update existing batch training
- `deleteBatchTraining(id)` - Delete batch training

## 📝 Example Usage

### Create Center Training
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
    fdp: "Advanced Web Development"
  }) {
    id
    center
    technology
    trainerName
  }
}
```

### Query All Batch Trainings
```graphql
query {
  batchTrainings {
    id
    batch
    departments
    yearSem
    technology
    trainerName
    trainingStatus
    examinationStatus
  }
}
```

### Update Training Status
```graphql
mutation {
  updateCenterTraining(input: {
    id: "1"
    trainingStatus: "Y"
    examinationStatus: "Completed"
  }) {
    id
    trainingStatus
    examinationStatus
    updatedAt
  }
}
```

## 🔍 Field Mappings

### Database → GraphQL Field Mapping

| Database Column | GraphQL Field | Type |
|----------------|---------------|------|
| start_training_date | startTrainingDate | String |
| end_training_date | endTrainingDate | String |
| trainer_name | trainerName | String |
| trainer_type | trainerType | String |
| training_status | trainingStatus | String |
| examination_status | examinationStatus | String |
| employee_id | employeeId | String |
| year_sem | yearSem | String (Batch only) |
| lab_no | labNo | String (Batch only) |

## 🛠️ Extending the System

### Adding New Filters

To add a new filter (e.g., by trainer name):

1. **Add method to Model** (`src/models/CenterTraining.js`):
```javascript
async findByTrainerName(trainerName) {
  const [rows] = await this.connection.query(
    'SELECT * FROM center_training WHERE trainer_name = ?',
    [trainerName]
  );
  return rows;
}
```

2. **Add to Schema** (`src/graphql/training.schema.js`):
```graphql
extend type Query {
  centerTrainingsByTrainer(trainerName: String!): [CenterTraining!]!
}
```

3. **Add Resolver** (`src/resolvers/training.js`):
```javascript
centerTrainingsByTrainer: async (_, { trainerName }, { user }) => {
  if (!user) throw new Error('Authentication required');
  const model = new CenterTraining(pool);
  return await model.findByTrainerName(trainerName);
}
```

### Adding Validation

Add custom validation in the service layer (`src/services/trainingService.js`):

```javascript
validateStrength(strength) {
  if (strength < 1 || strength > 100) {
    throw new Error('Strength must be between 1 and 100');
  }
}
```

## 🧪 Testing

### Manual Testing
Use the GraphQL Playground at `http://localhost:4000/graphql`

### Sample Test Data
The migration file includes sample data for both tables. You can use these IDs for testing:
- Center Training: IDs 1, 2
- Batch Training: IDs 1, 2

## 📚 Additional Resources

- Full API documentation: `docs/TRAINING_API.md`
- Database schema: `db/migrations/create_training_tables.sql`
- GraphQL schema: `src/graphql/training.schema.js`

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication required" error**
   - Ensure you're sending the JWT token in the Authorization header
   - Verify the token is valid and not expired

2. **"Insufficient permissions" error**
   - Check that your user has `admin` or `superadmin` role
   - Only these roles can create/update/delete training records

3. **Database connection errors**
   - Verify database credentials in `.env` file
   - Ensure MySQL server is running
   - Check that tables are created successfully

4. **GraphQL schema errors**
   - Restart the server after making schema changes
   - Clear any GraphQL caches

## 📞 Support

For issues or questions, refer to:
1. API Documentation: `docs/TRAINING_API.md`
2. This README
3. Source code comments in model and resolver files

---

**Last Updated**: December 2024
**Version**: 1.0.0
