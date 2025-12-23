# Training Management System - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATION                              │
│                    (GraphQL Playground / Frontend)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Request
                                    │ Authorization: Bearer <JWT>
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GRAPHQL ENDPOINT                                │
│                      http://localhost:4000/graphql                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         APOLLO SERVER                                   │
│                        (src/app.js)                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Context Middleware                                               │ │
│  │  - Verify JWT Token                                               │ │
│  │  - Extract User Info                                              │ │
│  │  - Attach to Context                                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GRAPHQL SCHEMA                                  │
│                      (src/graphql/schema.js)                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Type Definitions:                                                │ │
│  │  - baseTypeDefs (User, Auth)                                      │ │
│  │  - userTypeDefs (User operations)                                 │ │
│  │  - trainingTypeDefs (Training operations) ← NEW                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     TRAINING SCHEMA             │   │     OTHER SCHEMAS               │
│ (src/graphql/training.schema.js)│   │  (user.schema.js, etc.)         │
│                                 │   │                                 │
│ Types:                          │   │                                 │
│ - CenterTraining                │   │                                 │
│ - BatchTraining                 │   │                                 │
│                                 │   │                                 │
│ Inputs:                         │   │                                 │
│ - CreateCenterTrainingInput     │   │                                 │
│ - UpdateCenterTrainingInput     │   │                                 │
│ - CreateBatchTrainingInput      │   │                                 │
│ - UpdateBatchTrainingInput      │   │                                 │
│                                 │   │                                 │
│ Queries: 10+                    │   │                                 │
│ Mutations: 6                    │   │                                 │
└─────────────────────────────────┘   └─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         RESOLVERS LAYER                                 │
│                    (src/resolvers/training.js)                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Query Resolvers:                                                 │ │
│  │  ✓ centerTrainings          ✓ batchTrainings                     │ │
│  │  ✓ centerTraining(id)       ✓ batchTraining(id)                  │ │
│  │  ✓ centerTrainingsByCenter  ✓ batchTrainingsByBatch              │ │
│  │  ✓ centerTrainingsByTech    ✓ batchTrainingsByDepartment         │ │
│  │                             ✓ batchTrainingsByTechnology          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Mutation Resolvers:                                              │ │
│  │  ✓ createCenterTraining     ✓ createBatchTraining                │ │
│  │  ✓ updateCenterTraining     ✓ updateBatchTraining                │ │
│  │  ✓ deleteCenterTraining     ✓ deleteBatchTraining                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Authorization Checks:                                            │ │
│  │  - Queries: Require authentication                                │ │
│  │  - Mutations: Require admin/superadmin role                       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER (Optional)                           │
│                   (src/services/trainingService.js)                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Business Logic:                                                  │ │
│  │  - Date validation                                                │ │
│  │  - Complex operations                                             │ │
│  │  - Analytics & reporting                                          │ │
│  │  - Data aggregation                                               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     CENTER TRAINING MODEL       │   │     BATCH TRAINING MODEL        │
│ (src/models/CenterTraining.js)  │   │  (src/models/BatchTraining.js)  │
│                                 │   │                                 │
│ Methods:                        │   │ Methods:                        │
│ ✓ create(data)                  │   │ ✓ create(data)                  │
│ ✓ findById(id)                  │   │ ✓ findById(id)                  │
│ ✓ getAll()                      │   │ ✓ getAll()                      │
│ ✓ update(id, fields)            │   │ ✓ update(id, fields)            │
│ ✓ delete(id)                    │   │ ✓ delete(id)                    │
│ ✓ findByCenter(center)          │   │ ✓ findByBatch(batch)            │
│ ✓ findByTechnology(tech)        │   │ ✓ findByDepartment(dept)        │
│                                 │   │ ✓ findByTechnology(tech)        │
└─────────────────────────────────┘   └─────────────────────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATABASE CONNECTION POOL                           │
│                           (src/db.js)                                   │
│                         MySQL Connection                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MYSQL DATABASE                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  TABLE: center_training                                           │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │ id, start_training_date, end_training_date, center,         │ │ │
│  │  │ strength, technology, trainer_name, trainer_type,           │ │ │
│  │  │ certification, training_status, examination_status,         │ │ │
│  │  │ employee_id, fdp, created_at, updated_at                    │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │  Indexes: center, technology, employee_id, training_dates       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  TABLE: batch_training                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │ id, start_training_date, end_training_date, batch,          │ │ │
│  │  │ departments, year_sem, strength, technology, lab_no,        │ │ │
│  │  │ trainer_name, trainer_type, certification, training_status, │ │ │
│  │  │ examination_status, employee_id, fdp, created_at, updated_at│ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │  Indexes: batch, departments, technology, employee_id, dates    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: Query All Center Trainings

```
Client Request:
  query { centerTrainings { id center technology } }
  
  ↓ Apollo Server (verify JWT)
  ↓ Schema (route to resolver)
  ↓ Resolver (check authentication)
  ↓ Model.getAll()
  ↓ Database Query: SELECT * FROM center_training
  ↓ Map snake_case → camelCase
  ↑ Return data
  
Client Response:
  { data: { centerTrainings: [...] } }
```

### Example 2: Create Center Training (Mutation)

```
Client Request:
  mutation { createCenterTraining(input: {...}) { id } }
  
  ↓ Apollo Server (verify JWT)
  ↓ Schema (route to resolver)
  ↓ Resolver (check authentication + authorization)
  ↓ Service (validate business rules)
  ↓ Model.create(data)
  ↓ Database Query: INSERT INTO center_training
  ↓ Get inserted ID
  ↓ Model.findById(id)
  ↓ Map snake_case → camelCase
  ↑ Return created record
  
Client Response:
  { data: { createCenterTraining: { id: "3" } } }
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    INCOMING REQUEST                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Extract JWT from Authorization Header             │
│  Authorization: Bearer eyJhbGc...                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Verify JWT Token                                  │
│  - Check signature                                          │
│  - Check expiration                                         │
│  - Decode payload                                           │
└─────────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
        ┌───────────────┐   ┌───────────────┐
        │  Valid Token  │   │ Invalid Token │
        └───────────────┘   └───────────────┘
                │                   │
                ▼                   ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  Step 3: Load User      │   │  Return 401 Error       │
│  from Database          │   │  "Authentication        │
│  by userId from token   │   │   required"             │
└─────────────────────────┘   └─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Attach User to Context                            │
│  context = { user: {...}, db: {...} }                      │
└─────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Resolver Checks                                   │
│  - Query: if (!user) throw Error                           │
│  - Mutation: if (!['admin','superadmin'].includes(role))   │
└─────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Execute Operation                                 │
│  - Call model methods                                      │
│  - Return data                                             │
└─────────────────────────────────────────────────────────────┘
```

## Field Mapping Flow

```
Database (snake_case)          GraphQL (camelCase)
─────────────────────          ───────────────────
start_training_date      ←→    startTrainingDate
end_training_date        ←→    endTrainingDate
trainer_name             ←→    trainerName
trainer_type             ←→    trainerType
training_status          ←→    trainingStatus
examination_status       ←→    examinationStatus
employee_id              ←→    employeeId
year_sem                 ←→    yearSem
lab_no                   ←→    labNo
created_at               ←→    createdAt
updated_at               ←→    updatedAt
```

## File Dependencies

```
src/app.js
  ├── imports src/graphql/schema.js
  │     ├── imports src/graphql/training.schema.js ← NEW
  │     ├── imports src/graphql/user.schema.js
  │     ├── imports src/resolvers/training.js ← NEW
  │     │     ├── imports src/models/CenterTraining.js ← NEW
  │     │     ├── imports src/models/BatchTraining.js ← NEW
  │     │     └── imports src/db.js
  │     ├── imports src/resolvers/user.js
  │     └── imports src/resolvers/auth.js
  └── imports src/db.js
```

---

**Legend:**
- ← NEW: Newly created files
- ✓: Implemented feature
- ↓: Data flow down
- ↑: Data flow up
- ←→: Bidirectional mapping
