import User from './User.js';
import CenterTraining from './CenterTraining.js';
import Employee from './Employee.js';

const createModels = (connection) => ({
  User: new User(connection),
  CenterTraining: new CenterTraining(connection),
  Employee: new Employee(connection),
});

export default createModels;
