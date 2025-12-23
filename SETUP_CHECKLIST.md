# 🚀 Training Management System - Setup Checklist

## ✅ Pre-Implementation Checklist
- [x] Models created (CenterTraining.js, BatchTraining.js)
- [x] GraphQL schema defined (training.schema.js)
- [x] Resolvers implemented (training.js)
- [x] Service layer created (trainingService.js)
- [x] Main schema updated (schema.js)
- [x] Database migration SQL created
- [x] Documentation written
- [x] Test cases prepared

---

## 📋 Setup & Deployment Checklist

### **Step 1: Database Setup**
- [ ] **Open MySQL client** (MySQL Workbench, phpMyAdmin, or CLI)
- [ ] **Execute migration file**: `db/migrations/create_training_tables.sql`
- [ ] **Verify tables created**:
  ```sql
  SHOW TABLES LIKE '%training%';
  -- Should show: center_training, batch_training
  ```
- [ ] **Check sample data**:
  ```sql
  SELECT COUNT(*) FROM center_training;
  SELECT COUNT(*) FROM batch_training;
  -- Each should return 2 rows
  ```

### **Step 2: Server Verification**
- [ ] **Server is running**: `npm run dev`
- [ ] **Check console** for any errors
- [ ] **Verify GraphQL endpoint**: http://localhost:4000/graphql
- [ ] **No schema compilation errors**

### **Step 3: Authentication Setup**
- [ ] **Get JWT token** by logging in:
  ```graphql
  mutation {
    login(input: {
      email: "your-email@example.com"
      password: "your-password"
    }) {
      token
      user { id role }
    }
  }
  ```
- [ ] **Copy the token** from response
- [ ] **Verify user role** (should be admin or superadmin for mutations)

### **Step 4: GraphQL Playground Setup**
- [ ] **Open**: http://localhost:4000/graphql
- [ ] **Set HTTP Headers**:
  ```json
  {
    "Authorization": "Bearer <paste-your-token-here>"
  }
  ```
- [ ] **Test connection** with simple query:
  ```graphql
  query { me { id email role } }
  ```

---

## 🧪 Testing Checklist

### **Basic Read Operations**
- [ ] **Test 1**: Get all center trainings
  ```graphql
  query { centerTrainings { id center technology } }
  ```
- [ ] **Test 2**: Get all batch trainings
  ```graphql
  query { batchTrainings { id batch departments } }
  ```
- [ ] **Expected**: Should return 2 records each (from sample data)

### **Single Record Queries**
- [ ] **Test 3**: Get center training by ID
  ```graphql
  query { centerTraining(id: "1") { id center } }
  ```
- [ ] **Test 4**: Get batch training by ID
  ```graphql
  query { batchTraining(id: "1") { id batch } }
  ```
- [ ] **Expected**: Should return single record

### **Filter Operations**
- [ ] **Test 5**: Filter center trainings by center
  ```graphql
  query { centerTrainingsByCenter(center: "Main Campus") { id } }
  ```
- [ ] **Test 6**: Filter batch trainings by department
  ```graphql
  query { batchTrainingsByDepartment(department: "Computer Science") { id } }
  ```
- [ ] **Expected**: Should return filtered results

### **Create Operations** (Admin/Superadmin only)
- [ ] **Test 7**: Create new center training
  ```graphql
  mutation {
    createCenterTraining(input: {
      startTrainingDate: "2024-05-01"
      endTrainingDate: "2024-06-01"
      center: "Test Center"
      strength: 20
      technology: "Testing"
      trainerName: "Test Trainer"
      trainerType: "Internal"
      certification: "Test Cert"
      trainingStatus: "Y"
      examinationStatus: "Pending"
      employeeId: "TEST001"
      fdp: "Test FDP"
    }) { id }
  }
  ```
- [ ] **Test 8**: Create new batch training (similar structure)
- [ ] **Expected**: Should return new ID

### **Update Operations** (Admin/Superadmin only)
- [ ] **Test 9**: Update center training
  ```graphql
  mutation {
    updateCenterTraining(input: {
      id: "1"
      examinationStatus: "Completed"
    }) { id examinationStatus }
  }
  ```
- [ ] **Test 10**: Update batch training (similar structure)
- [ ] **Expected**: Should return updated data

### **Delete Operations** (Admin/Superadmin only)
- [ ] **Test 11**: Delete a test record
  ```graphql
  mutation { deleteCenterTraining(id: "3") }
  ```
- [ ] **Expected**: Should return true

### **Error Handling**
- [ ] **Test 12**: Query without auth token
  - Remove Authorization header
  - **Expected**: "Authentication required" error
  
- [ ] **Test 13**: Mutation with regular user role
  - Login as regular user
  - **Expected**: "Insufficient permissions" error
  
- [ ] **Test 14**: Query non-existent ID
  ```graphql
  query { centerTraining(id: "99999") { id } }
  ```
  - **Expected**: null or not found error

---

## 📊 Verification Checklist

### **Database Verification**
- [ ] Tables exist in database
- [ ] Sample data is present
- [ ] Indexes are created
- [ ] Timestamps are working (created_at, updated_at)

### **API Verification**
- [ ] All 10+ queries work correctly
- [ ] All 6 mutations work correctly
- [ ] Filters return correct results
- [ ] Authentication is enforced
- [ ] Authorization is enforced

### **Code Quality**
- [ ] No console errors
- [ ] No GraphQL schema errors
- [ ] Proper error messages returned
- [ ] Field mapping works (snake_case ↔ camelCase)

---

## 🎯 Post-Deployment Checklist

### **Documentation Review**
- [ ] Read `TRAINING_SYSTEM_SUMMARY.md`
- [ ] Review `docs/TRAINING_API.md`
- [ ] Check `docs/TRAINING_QUICK_REFERENCE.md`
- [ ] Understand `docs/TRAINING_IMPLEMENTATION.md`

### **Integration**
- [ ] Test with frontend application (if applicable)
- [ ] Verify CORS settings
- [ ] Check response times
- [ ] Monitor server logs

### **Security**
- [ ] JWT tokens are validated
- [ ] Role-based access works
- [ ] SQL injection protection (parameterized queries)
- [ ] Input validation works

---

## 🐛 Troubleshooting Guide

### **Issue: "Cannot find module 'training.schema.js'"**
**Solution**: 
- Check file exists: `src/graphql/training.schema.js`
- Restart server: `npm run dev`

### **Issue: "Table 'center_training' doesn't exist"**
**Solution**:
- Run migration: `db/migrations/create_training_tables.sql`
- Verify database connection in `.env`

### **Issue: "Authentication required"**
**Solution**:
- Get JWT token via login mutation
- Add to headers: `{ "Authorization": "Bearer <token>" }`

### **Issue: "Insufficient permissions"**
**Solution**:
- Check user role: `query { me { role } }`
- User must be admin or superadmin for mutations

### **Issue: Server won't start**
**Solution**:
- Check for syntax errors in new files
- Verify all imports are correct
- Check console for specific error messages

---

## ✨ Success Criteria

Your implementation is successful when:

- ✅ All database tables are created
- ✅ Server starts without errors
- ✅ All queries return data
- ✅ All mutations work (with proper auth)
- ✅ Filters return correct results
- ✅ Authentication is enforced
- ✅ Authorization is enforced
- ✅ Error handling works properly

---

## 📞 Quick Reference

| Resource | Location |
|----------|----------|
| API Docs | `docs/TRAINING_API.md` |
| Quick Reference | `docs/TRAINING_QUICK_REFERENCE.md` |
| Implementation Guide | `docs/TRAINING_IMPLEMENTATION.md` |
| Test Cases | `tests/training-graphql-tests.js` |
| Database Schema | `db/migrations/create_training_tables.sql` |
| Summary | `TRAINING_SYSTEM_SUMMARY.md` |

---

## 🎉 Next Steps After Setup

1. **Integrate with Frontend**: Use the GraphQL queries in your React/Vue/Angular app
2. **Add More Features**: Extend with additional filters or analytics
3. **Optimize**: Add caching, pagination if needed
4. **Monitor**: Set up logging and monitoring
5. **Deploy**: Deploy to production environment

---

**Status**: Ready for testing and deployment! 🚀

**Last Updated**: December 23, 2024
