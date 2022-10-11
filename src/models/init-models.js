var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _bulletin = require("./bulletin");
var _class_ = require("./class");
var _classLessons = require("./classLessons");
var _evaluations = require("./evaluations");
var _frequency = require("./frequency");
var _institution = require("./institution");
var _permissions = require("./permissions");
var _permissionsrole = require("./permissionsrole");
var _roles = require("./roles");
var _schoolcalls = require("./schoolcalls");
var _sequelizemeta = require("./sequelizemeta");
var _studentclasses = require("./studentclasses");
var _students = require("./students");
var _teacherClasses = require("./teacherClasses");
var _teacherLessons = require("./teacherLessons");
var _teachers = require("./teachers");
var _users = require("./users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var bulletin = _bulletin(sequelize, DataTypes);
  var class_ = _class_(sequelize, DataTypes);
  var classLessons = _classLessons(sequelize, DataTypes);
  var evaluations = _evaluations(sequelize, DataTypes);
  var frequency = _frequency(sequelize, DataTypes);
  var institution = _institution(sequelize, DataTypes);
  var permissions = _permissions(sequelize, DataTypes);
  var permissionsrole = _permissionsrole(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var schoolcalls = _schoolcalls(sequelize, DataTypes);
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes);
  var studentclasses = _studentclasses(sequelize, DataTypes);
  var students = _students(sequelize, DataTypes);
  var teacherClasses = _teacherClasses(sequelize, DataTypes);
  var teacherLessons = _teacherLessons(sequelize, DataTypes);
  var teachers = _teachers(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  classLessons.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass" });
  class_.hasMany(classLessons, { as: "classLessons", foreignKey: "idClass" });
  schoolcalls.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass" });
  class_.hasMany(schoolcalls, { as: "schoolcalls", foreignKey: "idClass" });
  studentclasses.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass" });
  class_.hasMany(studentclasses, { as: "studentclasses", foreignKey: "idClass" });
  teacherClasses.belongsTo(class_, { as: "idClass_class", foreignKey: "idClass" });
  class_.hasMany(teacherClasses, { as: "teacherClasses", foreignKey: "idClass" });
  users.belongsTo(institution, { as: "idInstitution_institution", foreignKey: "idInstitution" });
  institution.hasMany(users, { as: "users", foreignKey: "idInstitution" });
  permissionsrole.belongsTo(permissions, { as: "idPermission_permission", foreignKey: "idPermission" });
  permissions.hasMany(permissionsrole, { as: "permissionsroles", foreignKey: "idPermission" });
  permissionsrole.belongsTo(roles, { as: "idRole_role", foreignKey: "idRole" });
  roles.hasMany(permissionsrole, { as: "permissionsroles", foreignKey: "idRole" });
  users.belongsTo(roles, { as: "idRole_role", foreignKey: "idRole" });
  roles.hasMany(users, { as: "users", foreignKey: "idRole" });
  evaluations.belongsTo(schoolcalls, { as: "idSchoolCall_schoolcall", foreignKey: "idSchoolCall" });
  schoolcalls.hasMany(evaluations, { as: "evaluations", foreignKey: "idSchoolCall" });
  frequency.belongsTo(studentclasses, { as: "idStudentClasses_studentclass", foreignKey: "idStudentClasses" });
  studentclasses.hasMany(frequency, { as: "frequencies", foreignKey: "idStudentClasses" });
  studentclasses.belongsTo(students, { as: "idStudent_student", foreignKey: "idStudent" });
  students.hasMany(studentclasses, { as: "studentclasses", foreignKey: "idStudent" });
  schoolcalls.belongsTo(teachers, { as: "idTeacher_teacher", foreignKey: "idTeacher" });
  teachers.hasMany(schoolcalls, { as: "schoolcalls", foreignKey: "idTeacher" });
  teacherClasses.belongsTo(teachers, { as: "idTeacher_teacher", foreignKey: "idTeacher" });
  teachers.hasMany(teacherClasses, { as: "teacherClasses", foreignKey: "idTeacher" });
  teacherLessons.belongsTo(teachers, { as: "idTeacher_teacher", foreignKey: "idTeacher" });
  teachers.hasMany(teacherLessons, { as: "teacherLessons", foreignKey: "idTeacher" });
  students.belongsTo(users, { as: "idUser_user", foreignKey: "idUser" });
  users.hasMany(students, { as: "students", foreignKey: "idUser" });
  teachers.belongsTo(users, { as: "idUser_user", foreignKey: "idUser" });
  users.hasMany(teachers, { as: "teachers", foreignKey: "idUser" });

  return {
    SequelizeMeta,
    bulletin,
    class_,
    classLessons,
    evaluations,
    frequency,
    institution,
    permissions,
    permissionsrole,
    roles,
    schoolcalls,
    sequelizemeta,
    studentclasses,
    students,
    teacherClasses,
    teacherLessons,
    teachers,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
