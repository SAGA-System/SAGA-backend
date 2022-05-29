var DataTypes = require("sequelize").DataTypes;
var _bulletin = require("./bulletin");
var _class_ = require("./class");
var _evaluation = require("./evaluation");
var _files = require("./files");
var _institution = require("./institution");
var _permissions = require("./permissions");
var _schoolcalls = require("./schoolcalls");
var _studentclasses = require("./studentclasses");
var _students = require("./students");
var _teachers = require("./teachers");
var _userpermissions = require("./userpermissions");
var _users = require("./users");

function initModels(sequelize) {
  var bulletin = _bulletin(sequelize, DataTypes);
  var class_ = _class_(sequelize, DataTypes);
  var evaluation = _evaluation(sequelize, DataTypes);
  var files = _files(sequelize, DataTypes);
  var institution = _institution(sequelize, DataTypes);
  var permissions = _permissions(sequelize, DataTypes);
  var schoolcalls = _schoolcalls(sequelize, DataTypes);
  var studentclasses = _studentclasses(sequelize, DataTypes);
  var students = _students(sequelize, DataTypes);
  var teachers = _teachers(sequelize, DataTypes);
  var userpermissions = _userpermissions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  bulletin.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass"});
  class_.hasMany(bulletin, { as: "bulletins", foreignKey: "idClass"});
  evaluation.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass"});
  class_.hasMany(evaluation, { as: "evaluations", foreignKey: "idClass"});
  schoolcalls.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass"});
  class_.hasMany(schoolcalls, { as: "schoolcalls", foreignKey: "idClass"});
  studentclasses.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass"});
  class_.hasMany(studentclasses, { as: "studentclasses", foreignKey: "idClass"});
  class_.belongsTo(institution, { as: "idInstitution_institution", foreignKey: "idInstitution"});
  institution.hasMany(class_, { as: "classes", foreignKey: "idInstitution"});
  users.belongsTo(institution, { as: "idInstitution_institution", foreignKey: "idInstitution"});
  institution.hasMany(users, { as: "users", foreignKey: "idInstitution"});
  userpermissions.belongsTo(permissions, { as: "idPermissions_permission", foreignKey: "idPermissions"});
  permissions.hasMany(userpermissions, { as: "userpermissions", foreignKey: "idPermissions"});
  bulletin.belongsTo(students, { as: "idStudent_student", foreignKey: "idStudent"});
  students.hasMany(bulletin, { as: "bulletins", foreignKey: "idStudent"});
  studentclasses.belongsTo(students, { as: "idStudent_student", foreignKey: "idStudent"});
  students.hasMany(studentclasses, { as: "studentclasses", foreignKey: "idStudent"});
  bulletin.belongsTo(teachers, { as: "idTeacher_teacher", foreignKey: "idTeacher"});
  teachers.hasMany(bulletin, { as: "bulletins", foreignKey: "idTeacher"});
  evaluation.belongsTo(teachers, { as: "idTeacher_teacher", foreignKey: "idTeacher"});
  teachers.hasMany(evaluation, { as: "evaluations", foreignKey: "idTeacher"});
  files.belongsTo(users, { as: "idUser_user", foreignKey: "idUser"});
  users.hasMany(files, { as: "files", foreignKey: "idUser"});
  schoolcalls.belongsTo(users, { as: "idUser_user", foreignKey: "idUser"});
  users.hasMany(schoolcalls, { as: "schoolcalls", foreignKey: "idUser"});
  students.belongsTo(users, { as: "idUser_user", foreignKey: "idUser"});
  users.hasMany(students, { as: "students", foreignKey: "idUser"});
  teachers.belongsTo(users, { as: "idUser_user", foreignKey: "idUser"});
  users.hasMany(teachers, { as: "teachers", foreignKey: "idUser"});
  userpermissions.belongsTo(users, { as: "idUser_user", foreignKey: "idUser"});
  users.hasMany(userpermissions, { as: "userpermissions", foreignKey: "idUser"});

  return {
    bulletin,
    class_,
    evaluation,
    files,
    institution,
    permissions,
    schoolcalls,
    studentclasses,
    students,
    teachers,
    userpermissions,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
