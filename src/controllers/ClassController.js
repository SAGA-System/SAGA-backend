const jwt = require('jsonwebtoken')
const moment = require('moment')

const logger = require('../resources/logger')
const { convertToSlug } = require('../resources/normalizer')
const api = require('../../config/api')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`ClassController/index - list all classes`)
    //await models.class_.sync({alter: true})

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const classes = await models.class_.findAll({ where: { idInstitution: findUser.idInstitution } })

    if (classes.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada na plataforma'
        }
      })
    }

    return res.status(200).send(classes)
  } catch (err) {
    logger.error(`Failed to list classes - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`ClassController/show - list class by id`)

    const id = req.params.id

    const class_ = await models.class_.findOne({ where: { id: id } })

    if (!class_) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Verifique as informações e tente novamente'
        }
      })
    }

    return res.status(200).send(class_)
  } catch (err) {
    logger.error(`Failed to list class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`ClassController/store - create class`)

    const {
      period,
      course,
      schoolYear,
      block,
      classNumber,
    } = req.body

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })
    const findInstitution = await models.institution.findOne({ where: { id: findUser.idInstitution } })

    if (!period || !course || !schoolYear || !block || !classNumber) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const findClasses = await models.class_.findAll({
      where: {
        idInstitution: findUser.idInstitution,
        period: period,
        block: block,
        classNumber: classNumber
      }
    })

    if (findClasses.length === 0) {
      const courseData = findInstitution.courses.filter((item) => convertToSlug(item.name) === convertToSlug(course))

      if (period.toLowerCase() === courseData[0].period.toLowerCase()) {
        let lessons = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
        }

        for (let i = 0; i < courseData[0].lessonsPerDay; i++) {
          lessons.Monday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Tuesday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Wednesday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Thursday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Friday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Saturday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
        }

        const newClass = await models.class_.create({
          idInstitution: findInstitution.id,
          period: period,
          course: course,
          schoolYear: schoolYear,
          teachers: [],
          students: [],
          lessons: lessons,
          block: block,
          classNumber: classNumber,
          classTheme: courseData[0].classTheme[schoolYear - 1]
        })

        return res.status(201).send({
          message: 'Classe criada com sucesso',
          newClass
        })
      } else {
        return res.status(409).send({
          error: {
            message: 'Não existe modalidade do curso no turno solicitado',
          }
        })
      }
    } else {
      return res.status(409).send({
        error: {
          message: 'Já existe uma classe no local informado',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to create class - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`ClassController/update - update class by id`)

    const id = req.params.id

    const {
      period,
      course,
      schoolYear,
      block,
      classNumber
    } = req.body

    const token = req.headers.authorization
    const tokenDecoded = jwt.decode(token.slice(7))

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })
    const findInstitution = await models.institution.findOne({ where: { id: findUser.idInstitution } })

    const findClass = await models.class_.findOne({ where: { id: id } })
    const findAllTeachers = await models.teachers.findAll({
      include: {
        model: models.users,
        as: 'idUser_user',
        where: {
          idInstitution: findUser.idInstitution
        }
      }
    })

    if (findClass) {
      const courseData = course ?
        findInstitution.courses.filter((item) => convertToSlug(item.name) === convertToSlug(course)) :
        findInstitution.courses.filter((item) => convertToSlug(item.name) === convertToSlug(findClass.course))

      if (courseData.length === 0) {
        return res.status(400).send({
          error: {
            message: 'O curso informado não existe',
          }
        })
      }

      if (period ?
        convertToSlug(period) === convertToSlug(courseData[0].period) :
        convertToSlug(findClass.period) === convertToSlug(courseData[0].period)
      ) {
        let lessons = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
        }

        for (let i = 0; i < courseData[0].lessonsPerDay; i++) {
          lessons.Monday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Tuesday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Wednesday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Thursday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Friday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
          lessons.Saturday[i] = {
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }
        }

        let teacherForDeleteLessons = []

        for (teacher of findClass.teachers) {
          if (!teacherForDeleteLessons.some(({ id }) => teacher.id === id)) {
            teacherForDeleteLessons.push({ id: teacher.id })
          }
        }

        let lessonsForDelete = []

        if (teacherForDeleteLessons.length !== 0) {
          for (let teacher of teacherForDeleteLessons) {
            for (let day of Object.keys(findClass.lessons)) {
              for (item of findClass.lessons[day]) {
                if (Array.isArray(item)) {
                  for (let lessonData of item) {
                    if (lessonData.teacher.id === teacher.id) {
                      lessonsForDelete.push({
                        day: day,
                        period: findClass.period,
                        lesson: lessonData.lesson,
                        idTeacher: teacher.id
                      })
                    }
                  }
                } else {
                  if (item.teacher.id === teacher.id) {
                    lessonsForDelete.push({
                      day: day,
                      period: findClass.period,
                      lesson: item.lesson,
                      idTeacher: teacher.id
                    })
                  }
                }
              }
            }
          }
        }

        let errors = []

        for (let lesson of lessonsForDelete) {
          await api.delete(`/teacher/deleteLessons/${lesson.idTeacher}?day=${lesson.day
            }&period=${lesson.period
            }&lesson=${lesson.lesson}`, { headers: { authorization: token } }
          ).catch(err => {
            logger.error(`Failed to delete lessons in teacher - Error: ${err?.response?.data?.error?.message || err.message}`)

            errors.push(err?.response?.data?.error?.message || err.message)
          });
        }

        if (errors.length > 0) {
          for (let { id } of teacherForDeleteLessons) {
            for (let teacher of findAllTeachers) {
              if (id === teacher.id) {
                await models.teachers.update({
                  lessons: teacher.lessons
                }, { where: { id: id } })
              }
            }
          }

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor',
              errorsRequest: errors
            }
          })
        }

        await models.class_.update({
          period: period,
          course: course,
          schoolYear: schoolYear,
          block: block,
          classNumber: classNumber,
          lessons: lessons,
          classTheme: courseData[0].classTheme[schoolYear - 1]
        }, { where: { id: id } })

        return res.status(200).send(await models.class_.findOne({ where: { id: id } }))
      } else {
        return res.status(409).send({
          error: {
            message: 'Não existe modalidade do curso no turno solicitado',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`ClassController/destroy - delete class by id`)

    const id = req.params.id

    const findClass = await models.class_.findAll({ where: { id: id } })

    if (findClass.length !== 0) {
      await models.class_.destroy({ where: { id: id } })

      return res.status(200).send({
        message: 'Classe deletada com sucesso'
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Classe não encontrada ou já deletada',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.addStudents = async (req, res) => {
  try {
    logger.info(`ClassController/addStudents - add Students To Existing Class`)

    const idClass = req.params.idClass
    const { idUser } = req.body

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if ((!idUser && typeof idUser === 'number')) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findClass) {
      const student = await models.students.findOne({
        include: {
          model: models.users,
          as: 'idUser_user',
          where: {
            id: idUser
          }
        }
      })
      if (student) {
        let studentExistsInClass = false

        for (let i = 0; i < findClass.students.length; i++) {
          if ((findClass.students[i].idUser === idUser) || (findClass.students[i].ra === student.ra)) {
            studentExistsInClass = true
          }
        }

        if (!studentExistsInClass) {
          const newStudent = {
            idUser: idUser,
            ra: student.ra,
            name: student.idUser_user.name,
            gang: '',
          }

          findClass.students.push(newStudent)

          const studentClasses = await models.studentclasses.findOne({ where: { idStudent: student.id, idClass: idClass } })

          if (!studentClasses) {
            const modifyCourses = findClass.classTheme.map(({ name, totalClasses }) => {
              return {
                name,
                totalClasses,
                classesGiven: 0,
                absence: 0
              }
            })

            Object.assign(findClass, { classTheme: modifyCourses });

            await models.studentclasses.create({
              idStudent: student.id,
              idClass: idClass,
              gang: '',
              frequency: findClass.classTheme
            })
          }

          await models.class_.update({
            students: findClass.students,
          }, { where: { id: idClass } })

          return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
        } else {
          return res.status(409).send({
            error: {
              message: 'Já existe um aluno nessa sala para as informações fornecidas',
            }
          })
        }
      } else {
        return res.status(409).send({
          error: {
            message: 'O usuário informado não é um estudante',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to add students in class - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateStudent = async (req, res) => {
  try {
    logger.info(`ClassController/updateStudent - update a student from an existing class`)

    const idClass = req.params.idClass
    const idUser = req.params.idUser

    const { name, ra } = req.body
    const dataForUpdate = { name, ra }

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      if (findClass.students.filter(({ idUser: userID }) => userID === Number(idUser)).length !== 0) {
        const studentsUpdated = findClass.students.map(({ idUser: userID, ra, name, gang }) => {
          return userID === Number(idUser) ? {
            idUser: Number(userID),
            gang,
            ra: (dataForUpdate.ra) && (ra !== dataForUpdate.ra) ? dataForUpdate.ra : ra,
            name: (dataForUpdate.name) && (name !== dataForUpdate.name) ? dataForUpdate.name : name
          } : {
            idUser: Number(userID),
            gang,
            ra,
            name
          }
        })

        await models.class_.update({
          students: studentsUpdated,
        }, { where: { id: idClass } })

        return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        return res.status(404).send({
          error: {
            message: 'Não existe um aluno nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to update student in class - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.deleteStudent = async (req, res) => {
  try {
    logger.info(`ClassController/deleteStudent - delete a student from an existing class`)

    const idClass = req.params.idClass
    const idUser = req.params.idUser

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      let studentExistsInClass = {
        value: false,
        id: null
      }

      for (let i = 0; i < findClass.students.length; i++) {
        if (findClass.students[i].idUser === Number(idUser)) {
          studentExistsInClass = {
            value: true,
            id: i
          }
        }
      }

      if (studentExistsInClass.value) {
        const updatedStudents = findClass.students.filter((_, index) => index !== studentExistsInClass.id)

        await models.class_.update({
          students: updatedStudents,
        }, { where: { id: idClass } })

        const student = await models.students.findOne({
          include: {
            model: models.users,
            as: 'idUser_user',
            where: {
              id: idUser
            }
          }
        })

        await models.studentclasses.destroy({ where: { idStudent: student.id, idClass: idClass } })

        return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        return res.status(404).send({
          error: {
            message: 'Não existe um aluno nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.addTeachers = async (req, res) => {
  try {
    logger.info(`ClassController/addTeacher - add Teacher to Existing Class`)

    const idClass = req.params.idClass
    const { teachers } = req.body

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (!teachers.idUser || !teachers.id || !teachers.classTheme) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findClass) {
      let teachersExistsInClass = false

      for (let teacher of findClass.teachers) {
        if (
          (teacher.id === teachers.id) &&
          (convertToSlug(teacher.classTheme) === convertToSlug(teachers.classTheme)) &&
          (convertToSlug(teacher.gang) === convertToSlug(teachers.gang))
        ) {
          teachersExistsInClass = true
        }
      }

      if (!teachersExistsInClass) {
        const user = await models.teachers.findOne({
          include: {
            model: models.users,
            as: 'idUser_user',
            where: {
              id: teachers.idUser
            }
          }, where: {
            id: teachers.id
          }
        })

        if (!user) {
          return res.status(400).send({
            error: {
              message: 'O professor informado não está cadastrado no sistema'
            }
          })
        }

        teachers.name = user.idUser_user.name
        teachers.gang = teachers.gang.toUpperCase()

        const ClassThemes = findClass.classTheme.map(({ name }) => { return convertToSlug(name) })

        if (!ClassThemes.includes(convertToSlug(teachers.classTheme))) {
          return res.status(400).send({
            error: {
              message: 'A matéria informada não está prevista nesse curso'
            }
          })
        }

        findClass.teachers.push(teachers)

        await models.class_.update({
          teachers: findClass.teachers,
        }, { where: { id: idClass } })

        return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        return res.status(409).send({
          error: {
            message: 'Já existe um professor nessa sala com as informações fornecidas',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to add students in class - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateTeacher = async (req, res) => {
  try {
    logger.info(`ClassController/updateTeacher - update a teacher from an existing class`)

    const idClass = req.params.idClass
    const idUser = req.params.idUser

    const dataForUpdate = req.body

    const token = req.headers.authorization

    const findTeacher = await models.teachers.findOne({ where: { idUser: idUser } })
    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (!dataForUpdate.oldClassTheme) {
      return res.status(400).send({
        error: {
          message: 'informe os dados antigos para localização do professor na plataforma'
        }
      })
    }

    if (!dataForUpdate.oldGang && dataForUpdate.gang) {
      return res.status(400).send({
        error: {
          message: 'informe a turma antiga para poder atualizar a turma do professor na plataforma'
        }
      })
    }

    if (findClass) {
      let teacherUpdatedData
      if (dataForUpdate.classTheme) {
        const ClassThemes = findClass.classTheme.map(({ name }) => { return convertToSlug(name) })

        if (!ClassThemes.includes(convertToSlug(dataForUpdate.classTheme))) {
          return res.status(400).send({
            error: {
              message: 'A matéria informada não está prevista nesse curso'
            }
          })
        }
      }

      if (findClass.teachers.filter((item) => item.idUser === Number(idUser) &&
        (!dataForUpdate.oldClassTheme || item.classTheme === convertToSlug(dataForUpdate.oldClassTheme)) &&
        (!dataForUpdate.oldGang || item.gang === dataForUpdate.oldGang.toUpperCase())).length === 0) {
        return res.status(400).send({
          error: {
            message: 'Não existe nenhum professor com as credenciais informadas'
          }
        })
      }

      if (findClass.teachers.filter((item) => item.idUser === Number(idUser) &&
        (!dataForUpdate.oldClassTheme || item.classTheme === convertToSlug(dataForUpdate.oldClassTheme)) &&
        (!dataForUpdate.oldGang || item.gang === dataForUpdate.oldGang.toUpperCase())).length > 1) {
        return res.status(400).send({
          error: {
            message: 'Especifique melhor o professor que deseja editar'
          }
        })
      }

      if (dataForUpdate.gang && dataForUpdate.classTheme &&
        findClass.teachers.filter((item) => item.classTheme === dataForUpdate.classTheme && item.gang === dataForUpdate.gang).length !== 0
      ) {
        return res.status(400).send({
          error: {
            message: 'Já existe um professor definido para a matéria e turma informadas'
          }
        })
      }

      if (findClass.teachers.filter((item) => item.idUser === Number(idUser) &&
        (!dataForUpdate.oldClassTheme || item.classTheme === convertToSlug(dataForUpdate.oldClassTheme)) &&
        (!dataForUpdate.oldGang || item.gang === dataForUpdate.oldGang.toUpperCase()))[0].gang === '' && dataForUpdate.gang) {
        return res.status(400).send({
          error: {
            message: 'Não é possível atribuir turma para um professor cuja matéria já não era dividida por turmas anteriormente'
          }
        })
      }

      if (findClass.teachers.filter((item) => item.idUser === Number(idUser)).length !== 0) {
        const teachersUpdated = findClass.teachers.map(({ id, idUser: userID, classTheme, name, gang }) => {
          if (userID === Number(idUser) && (
            (!dataForUpdate.oldClassTheme || classTheme === convertToSlug(dataForUpdate.oldClassTheme)) &&
            (!dataForUpdate.oldGang || gang === dataForUpdate.oldGang.toUpperCase()))
          ) {
            teacherUpdatedData = {
              id,
              idUser: userID,
              name,
              gang: (dataForUpdate.gang) && (gang !== dataForUpdate.gang) ? dataForUpdate.gang.toUpperCase() : gang.toUpperCase(),
              classTheme: (dataForUpdate.classTheme) && (classTheme !== dataForUpdate.classTheme) ? dataForUpdate.classTheme : classTheme,
            }
          }

          return userID === Number(idUser) && (
            (!dataForUpdate.oldClassTheme || classTheme === convertToSlug(dataForUpdate.oldClassTheme)) &&
            (!dataForUpdate.oldGang || gang === dataForUpdate.oldGang.toUpperCase())
          ) ? {
            id,
            idUser: userID,
            name,
            gang: (dataForUpdate.gang) && (gang !== dataForUpdate.gang) ? dataForUpdate.gang.toUpperCase() : gang.toUpperCase(),
            classTheme: (dataForUpdate.classTheme) && (classTheme !== dataForUpdate.classTheme) ? dataForUpdate.classTheme : classTheme,
          } : {
            id,
            idUser: userID,
            name,
            gang,
            classTheme
          }
        })

        let lessonsForUpdate = []
        let classLessonsUpdated = findClass.lessons

        for (let day of Object.keys(findClass.lessons)) {
          classLessonsUpdated[day] = findClass.lessons[day].map(item => {
            if (Array.isArray(item)) {
              for (let { teacher, classTheme, gang } of item) {
                if (teacher.idUser === Number(idUser) && (
                  (convertToSlug(classTheme) === convertToSlug(dataForUpdate.oldClassTheme)) &&
                  (!dataForUpdate.oldGang || gang.toUpperCase() === dataForUpdate.oldGang.toUpperCase()))
                ) {
                  lessonsForUpdate.push({
                    day: day,
                    period: findClass.period,
                    lesson: item.filter(secondItem => secondItem.teacher.idUser === Number(idUser))[0].lesson
                  })
                }
              }

              return item.map(data => {
                return data.teacher.idUser === Number(idUser) && (
                  (convertToSlug(data.classTheme) === convertToSlug(dataForUpdate.oldClassTheme)) &&
                  (!dataForUpdate.oldGang || data.gang.toUpperCase() === dataForUpdate.oldGang.toUpperCase())
                ) ? {
                  ...data,
                  classTheme: teacherUpdatedData.classTheme,
                  gang: teacherUpdatedData.gang,
                  teacher: {
                    ...data.teacher,
                    name: teacherUpdatedData.name,
                  }
                } : data
              })
            } else {
              if (item.teacher.idUser === Number(idUser) && (
                (convertToSlug(item.classTheme) === convertToSlug(dataForUpdate.oldClassTheme))
              )) {
                lessonsForUpdate.push({
                  day: day,
                  period: findClass.period,
                  lesson: item.lesson,
                })
              }

              return item.teacher.idUser === Number(idUser) && (
                (convertToSlug(item.classTheme) === convertToSlug(dataForUpdate.oldClassTheme))
              ) ? {
                ...item,
                classTheme: teacherUpdatedData.classTheme,
                gang: teacherUpdatedData.gang,
                teacher: {
                  ...item.teacher,
                  name: teacherUpdatedData.name,
                }
              } : item
            }
          })
        }

        let errors = []

        for (lesson of lessonsForUpdate) {
          await api.put(`/teacher/updateLessons/${teacherUpdatedData.id}
            ?day=${lesson.day
            }&period=${lesson.period
            }&lesson=${lesson.lesson}`, {
            gang: teacherUpdatedData.gang,
            classTheme: teacherUpdatedData.classTheme
          }, { headers: { authorization: token } }).catch(err => {
            logger.error(`Failed to delete lessons in teacher - Error: ${err?.response?.data?.error?.message || err.message}`)

            errors.push(err?.response?.data?.error?.message || err.message)
          });
        }

        if (errors.length > 0) {
          await models.teachers.update({
            lessons: findTeacher.lessons
          }, { where: { idUser: idUser } })

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }

        await models.class_.update({
          teachers: teachersUpdated,
          lessons: classLessonsUpdated
        }, { where: { id: idClass } })

        return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        return res.status(404).send({
          error: {
            message: 'Não existe um professor nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to update teacher in class - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.deleteTeacher = async (req, res) => {
  try {
    logger.info(`ClassController/deleteTeacher - delete a teacher from an existing class`)

    const idClass = req.params.idClass
    const idUser = req.params.idUser

    const token = req.headers.authorization

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    const findTeacher = await models.teachers.findOne({ where: { idUser: idUser } })

    if (findClass) {
      const teacherForDelete = findClass.teachers.filter((item) => item.idUser === Number(idUser))

      let lessonsForDelete = []

      let lessonsUpdated = findClass.lessons

      if (teacherForDelete.length !== 0) {
        for (let day of Object.keys(findClass.lessons)) {
          lessonsUpdated[day] = findClass.lessons[day].map(item => {
            if (Array.isArray(item)) {
              lessonsForDelete.push({
                day: day,
                period: findClass.period,
                lesson: item.filter(secondItem => secondItem.teacher.idUser === Number(idUser))[0].lesson
              })

              return item.filter(secondItem => secondItem.teacher.idUser !== Number(idUser))
            } else {
              if (item.teacher.idUser === Number(idUser)) {
                lessonsForDelete.push({
                  day: day,
                  period: findClass.period,
                  lesson: item.lesson
                })
              }

              return item.teacher.idUser === Number(idUser) ? {
                lesson: item.lesson,
                teacher: {},
                classTheme: ''
              } : item
            }
          })
        }

        let errors = []

        for (lesson of lessonsForDelete) {
          await api.delete(`/teacher/deleteLessons/${teacherForDelete[0].id}
            ?day=${lesson.day
            }&period=${lesson.period
            }&lesson=${lesson.lesson}`, { headers: { authorization: token } }).catch(err => {
              logger.error(`Failed to delete lessons in teacher - Error: ${err?.response?.data?.error?.message || err.message}`)

              errors.push(err?.response?.data?.error?.message || err.message)
            });
        }

        if (errors.length > 0) {
          await models.teachers.update({
            lessons: findTeacher.lessons
          }, { where: { idUser: idUser } })

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }

        const updatedTeachers = findClass.teachers.filter((item) => item.idUser !== Number(idUser))

        await models.class_.update({
          teachers: updatedTeachers,
          lessons: lessonsUpdated
        }, { where: { id: idClass } })

        return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        return res.status(404).send({
          error: {
            message: 'Não existe um professor nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateLessons = async (req, res) => {
  try {
    logger.info(`ClassController/updateLessons - update lessons to existing class`)

    const idClass = req.params.idClass

    const { lessons } = req.body

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    const token = req.headers.authorization
    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })
    const findInstitution = await models.institution.findOne({ where: { id: findUser.idInstitution } })

    const findAllTeachers = await models.teachers.findAll({
      include: {
        model: models.users,
        as: 'idUser_user',
        where: {
          idInstitution: findUser.idInstitution
        }
      }
    })

    if (!lessons.Monday || !lessons.Tuesday || !lessons.Wednesday || !lessons.Thursday || !lessons.Friday || !lessons.Saturday) {
      return res.status(400).send({
        error: {
          message: 'Faltam dias para definir as aulas. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findClass) {
      const courseData = findInstitution.courses.filter((item) => convertToSlug(item.name) === convertToSlug(findClass.course))

      if (courseData.length === 0) {
        return res.status(400).send({
          error: {
            message: 'Não foi possível encontrar o curso da classe na instituição'
          }
        })
      }

      const ClassThemes = findClass.classTheme.map(({ name }) => { return convertToSlug(name) })

      if (Object.keys(lessons).map(item => {
        return lessons[item].length === courseData[0].lessonsPerDay
      }).includes(false)) {
        return res.status(400).send({
          error: {
            message: 'O número de aulas por dia está incorreto. Verifique a quantidade de aulas por dia e tente novamente'
          }
        })
      }

      if (Object.keys(lessons).map(item => {
        return lessons[item].map(item => {
          if (Array.isArray(item)) {
            if (!item[0].gang.toUpperCase() || !item[1].gang.toUpperCase()) return false
            if (item[0].gang.toUpperCase() === item[1].gang.toUpperCase()) return false

            return item.map(({ gang }) => {
              return gang ? true : false
            }).includes(true)
          }
        }).includes(false)
      }).includes(true)) {
        return res.status(400).send({
          error: {
            message: 'As aulas informadas que são para turmas diferentes não possuem as turmas definidas'
          }
        })
      }

      if (Object.keys(lessons).map(item => {
        return lessons[item].map(item => {
          if (!Array.isArray(item)) {
            return item.classTheme ? ClassThemes.includes(convertToSlug(item.classTheme)) : ''
          } else {
            return item.map(({ classTheme }) => {
              return classTheme ? ClassThemes.includes(convertToSlug(classTheme)) : ''
            }).includes(false) ? false : true
          }
        }).includes(false)
      }).includes(true)) {
        return res.status(400).send({
          error: {
            message: 'As aulas informadas não estão previstas nesse curso. Verifique as informações enviadas e tente novamente'
          }
        })
      }

      for (let day of Object.keys(lessons)) {
        lessons[day] = lessons[day].map((item) => {
          if (!item.gang && !Array.isArray(item)) {
            return {
              ...item,
              gang: ''
            }
          } else {
            return item
          }
        })
      }

      let errors = []

      for (let day of Object.keys(lessons)) {
        lessons[day] = lessons[day].map((item, i) => {
          if (!Array.isArray(item)) {
            if (!item.classTheme) return {
              lesson: i + 1,
              teacher: {},
              classTheme: ''
            };

            const teacherData = findClass.teachers.filter(({ classTheme, gang }) =>
              (convertToSlug(item.classTheme) === convertToSlug(classTheme) && item.gang === gang)
            )[0]

            if (!teacherData) {
              errors.push(`Não foi encontrado um professor para a matéria ${item.classTheme
                }${item.gang ? `, para a turma ${item.gang}` : ', sem turma definida'}`)
              return
            }

            return {
              ...item,
              teacher: {
                name: teacherData.name,
                id: teacherData.id,
                idUser: teacherData.idUser,
              }
            }
          } else {
            return item.map(secondItem => {
              const teacherData = findClass.teachers.filter(({ classTheme, gang }) =>
                (convertToSlug(secondItem.classTheme) === convertToSlug(classTheme) && secondItem.gang.toUpperCase() === gang.toUpperCase())
              )[0]

              if (!teacherData) {
                errors.push(`Não foi encontrado um professor para a matéria ${secondItem.classTheme
                  }${secondItem.gang ? `, para a turma ${secondItem.gang}` : ', sem turma definida'}`)
                return
              }

              return {
                ...secondItem,
                gang: secondItem.gang.toUpperCase(),
                teacher: {
                  name: teacherData.name,
                  id: teacherData.id,
                  idUser: teacherData.idUser,
                }
              }
            })
          }
        })
      }

      if (errors.length > 0) {
        return res.status(400).send({
          error: {
            message: 'Alguns professores não foram encontrados para as aulas informadas dentro da classe. ' +
              'Verifique se existem professores cadastrados na classe para as matérias necessárias e tente novamente',
            errorsRequest: errors
          }
        })
      }

      // organize lessons in order
      for (let day of Object.keys(lessons)) {
        lessons[day] = lessons[day].sort((a, b) => {
          let x = Array.isArray(a) ? a[0].lesson : a.lesson
          let y = Array.isArray(b) ? b[0].lesson : b.lesson

          return x === y ? 0 : x > y ? 1 : -1
        })
      }

      const allTeachersClassroom = findAllTeachers.filter(({ id }) => findClass.teachers.some(elem => elem.id === id))

      let errorsUpdateTeacher = []

      async function addLessonsInTeacher({ day, i, index = '' }) {
        await api.post(`/teacher/addLessons/${index.toString() ?
          lessons[day][i][index].teacher.id :
          lessons[day][i].teacher.id}`, {
          lessons: {
            classTheme: index.toString() ? lessons[day][i][index].classTheme : lessons[day][i].classTheme,
            day: day,
            gang: index.toString() ? lessons[day][i][index].gang : lessons[day][i].gang,
            lesson: index.toString() ? lessons[day][i][index].lesson : lessons[day][i].lesson,
            period: findClass.period,
            classBlock: findClass.block,
            classNumber: findClass.classNumber,
          }
        }, { headers: { authorization: token } }).catch(err => {
          logger.error(`Failed to add lesson in teacher - Error: ${err?.response?.data?.error?.message || err.message}`)

          errorsUpdateTeacher.push(err?.response?.data?.error?.message || err.message)
        });
      }

      async function deleteLessonsInTeacher({ day, i, index = '' }) {
        await api.delete(`/teacher/deleteLessons/${index.toString() ?
          findClass.lessons[day][i][index].teacher.id :
          findClass.lessons[day][i].teacher.id
          }?day=${day
          }&period=${findClass.period
          }&lesson=${index.toString() ?
            findClass.lessons[day][i][index].lesson :
            findClass.lessons[day][i].lesson}`, { headers: { authorization: token } }
        ).catch(err => {
          logger.error(`Failed to delete lessons in teacher - Error: ${err?.response?.data?.error?.message || err.message}`)

          errorsUpdateTeacher.push(err?.response?.data?.error?.message || err.message)
        });
      }

      // logic for update teachers table, lessons column
      for (let day of Object.keys(lessons)) {
        for (let i = 0; i < findClass.lessons[day].length; i++) {
          //checks if this class existed previously, if not, it just continues with the registration
          if (!Array.isArray(findClass.lessons[day][i]) && JSON.stringify(findClass.lessons[day][i]) === JSON.stringify({
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }) && JSON.stringify(lessons[day][i]) !== JSON.stringify({
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          })) {
            //checks if current classes are divided into gangs at that day and time
            if (Array.isArray(lessons[day][i])) {
              for (let index = 0; index < lessons[day][i].length; index++) {
                const teacherLessonData = allTeachersClassroom.filter(item => item.id === lessons[day][i][index].teacher.id)[0]
                if (teacherLessonData.lessons[day][i]) {
                  errorsUpdateTeacher.push(`O professor ${teacherLessonData.idUser_user.name} já possui uma aula na ${day === 'Monday' ? 'Segunda-feira' :
                    day === 'Tuesday' ? 'Terça-feira' :
                      day === 'Wednesday' ? 'Quarta-feira' :
                        day === 'Thursday' ? 'Quinta-feira' :
                          day === 'Friday' ? 'Sexta-feira' :
                            day === 'Saturday' ? 'Sábado' : ''
                    }, na aula ${i + 1}`)
                } else {
                  await addLessonsInTeacher({ day, i, index })
                }
              }
            } else {
              const teacherLessonData = allTeachersClassroom.filter(item => item.id === lessons[day][i].teacher.id)[0]
              if (teacherLessonData.lessons[day][i]) {
                errorsUpdateTeacher.push(`O professor ${teacherLessonData.idUser_user.name} já possui uma aula na ${day === 'Monday' ? 'Segunda-feira' :
                  day === 'Tuesday' ? 'Terça-feira' :
                    day === 'Wednesday' ? 'Quarta-feira' :
                      day === 'Thursday' ? 'Quinta-feira' :
                        day === 'Friday' ? 'Sexta-feira' :
                          day === 'Saturday' ? 'Sábado' : ''
                  }, na aula ${i + 1}`)
              } else {
                await addLessonsInTeacher({ day, i })
              }
            }
          } else if (Array.isArray(findClass.lessons[day][i]) && Array.isArray(lessons[day][i]) &&
            lessons[day][i].length !== findClass.lessons[day][i].length
          ) {
            //delete current lessons in teachers
            for (let index = 0; index < findClass.lessons[day][i].length; index++) {
              await deleteLessonsInTeacher({ day, i, index })
            }
            //add new lessons in teachers
            for (let index = 0; index < lessons[day][i].length; index++) {
              await addLessonsInTeacher({ day, i, index })
            }
            //logic to check if a class existed before that is currently removed
          } else if (JSON.stringify(findClass.lessons[day][i]) !== JSON.stringify({
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          }) && JSON.stringify(lessons[day][i]) === JSON.stringify({
            lesson: i + 1,
            teacher: {},
            classTheme: ''
          })) {

            //checks if old classes are divided into gangs on that day and time
            if (Array.isArray(findClass.lessons[day][i])) {
              for (let index = 0; index < findClass.lessons[day][i].length; index++) {
                await deleteLessonsInTeacher({ day, i, index })
              }
            } else {
              await deleteLessonsInTeacher({ day, i })
            }

            //if old lesson is Array and new lesson isn't array
          } else if (Array.isArray(findClass.lessons[day][i]) && !Array.isArray(lessons[day][i])) {
            for (let index = 0; index < findClass.lessons[day][i].length; index++) {
              await deleteLessonsInTeacher({ day, i, index })
            }
            await addLessonsInTeacher({ day, i })

            //if old lesson is't Array and new lesson is array
          } else if (!Array.isArray(findClass.lessons[day][i]) && Array.isArray(lessons[day][i])) {
            await deleteLessonsInTeacher({ day, i })
            for (let index = 0; index < lessons[day][i].length; index++) {
              await addLessonsInTeacher({ day, i, index })
            }

            //logic to check if there is any class on the current day that is different from what it was
          } else if (Array.isArray(findClass.lessons[day][i]) ?
            findClass.lessons[day][i].map((item, index) => {
              return item.teacher.id === lessons[day][i][index].teacher.id &&
                convertToSlug(item.classTheme) === convertToSlug(lessons[day][i][index].classTheme) ? true : false
            }).includes(false)
            : findClass.lessons[day][i].teacher.id !== lessons[day][i].teacher.id ||
              convertToSlug(findClass.lessons[day][i].classTheme) !== convertToSlug(lessons[day][i].classTheme) ? true : false
          ) {

            //checks if old classes are divided into gangs on that day and time
            if (Array.isArray(findClass.lessons[day][i])) {
              for (let index = 0; index < findClass.lessons[day][i].length; index++) {
                await deleteLessonsInTeacher({ day, i, index })
              }
            } else {
              await deleteLessonsInTeacher({ day, i })
            }

            //checks if current classes are divided into gangs at that day and time
            if (Array.isArray(lessons[day][i])) {
              for (let index = 0; index < lessons[day][i].length; index++) {
                await addLessonsInTeacher({ day, i, index })
              }
            } else {
              await addLessonsInTeacher({ day, i })
            }
          }
        }
      }

      if (errorsUpdateTeacher.length > 0) {
        for (let teacher of allTeachersClassroom) {
          await models.teachers.update({
            lessons: teacher.lessons
          }, { where: { id: teacher.id } })
        }

        await models.institution.update({
          courses: findInstitution.courses
        }, { where: { id: idClass } })

        return res.status(500).send({
          error: {
            message: 'Ocorreu um erro interno do servidor',
            errorsRequest: errorsUpdateTeacher
          }
        })
      }

      await models.class_.update({
        lessons
      }, { where: { id: idClass } })

      return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update lessons by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.defineGangs = async (req, res) => {
  try {
    logger.info(`ClassController/defineGangs - define gangs in class`)

    const idClass = req.params.idClass

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      findClass.students.sort((a, b) => {
        let x = convertToSlug(a.name).toLowerCase()
        let y = convertToSlug(b.name).toLowerCase()

        return x === y ? 0 : x > y ? 1 : -1
      })


      const updatedStudents = findClass.students.map((item, index) => {
        item.gang = (index + 1) <= Math.floor(findClass.students.length / 2) ? "A" : "B"
        return item
      })

      for (u of updatedStudents) {
        const student = await models.studentclasses.findOne({
          where: { idClass: idClass },
          include: {
            model: models.students,
            as: 'idStudent_student',
            where: {
              idUser: u.idUser
            }
          }
        })

        if (student && student.idClass === Number(idClass) && (student.gang === '' || student.gang !== u.gang)) {
          await models.studentclasses.update({
            gang: u.gang
          }, { where: { id: student.id, idClass: idClass } })
        }
      }

      await models.class_.update({
        students: updatedStudents,
      }, { where: { id: idClass } })

      return res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível definir as turmas',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to define gangs in class - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateFrequency = async (req, res) => {
  try {
    logger.info(`ClassController/updateFrequency - making the school call`)

    const idClass = req.params.idClass
    let { frequency } = req.body

    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))

    if (!frequency.classTheme || !frequency.bimester || !frequency.classesGiven || !frequency.date || !frequency.description || !frequency.absences) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para realizar a chamada. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const idTeacher = await models.teachers.findOne({ where: { idUser: tokenDecoded.id }})

    if (!idTeacher) {
      return res.status(400).send({
        error: {
          message: 'Para realizar a chamada, é necessário um perfil professor ou acima'
        }
      })
    }

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass.teachers.filter(item => item.classTheme === frequency.classTheme).length > 1 && !frequency.gang) {
      return res.status(400).send({
        error: {
          message: 'A matéria informada é separada em turmas, mas a turma onde a chamada foi realizada não foi informada'
        }
      })
    }

    let students = frequency.gang ?
      await models.studentclasses.findAll({ where: { idClass: idClass, gang: frequency.gang.toUpperCase() } }) :
      await models.studentclasses.findAll({ where: { idClass: idClass } })

    for (let absentStudent of frequency.absences) {
      if (!students.some(elem => elem.idStudent === absentStudent.idStudent)) {
        return res.status(400).send({
          error: {
            message: 'Existem estudantes informados como ausentes que não fazem parte dessa classe'
          }
        })
      }
    }
    
    frequency.date = new Date(frequency.date).setHours(0, 0, 0, 0)
    frequency.date = moment(frequency.date).format('YYYY-MM-DD HH:mm:ss')

    if (students.length !== 0) {
      const classThemeFrequency = students[0].frequency.filter(item =>
        (item.name === frequency.classTheme)
      )

      if (classThemeFrequency.length !== 0) {
        classThemeFrequency[0].classesGiven += frequency.classesGiven

        for (s of students) {
          const updatedFrequency = s.frequency.map(item => {
            return item.name === classThemeFrequency[0].name ? (
              frequency.absences.map(({ idStudent, absence }) =>
                idStudent === s.idStudent && (
                  !absence ? {
                    name: item.name,
                    classesGiven: classThemeFrequency[0].classesGiven,
                    absence: item.absence + 0,
                    totalClasses: item.totalClasses
                  } : {
                    name: item.name,
                    classesGiven: classThemeFrequency[0].classesGiven,
                    absence: item.absence + absence,
                    totalClasses: item.totalClasses
                  }
                )
              ).filter(item => item !== false)[0]
            ) : item
          })

          await models.studentclasses.update({
            frequency: updatedFrequency,
          }, { where: { idStudent: s.idStudent, idClass: idClass } })
        }

        const absentStudents = []
        for (abs of frequency.absences) {
          if (abs.absence && students.filter(({ idStudent }) => idStudent === abs.idStudent).length !== 0) {
            absentStudents.push({
              idStudent: abs.idStudent,
              absence: abs.absence,
              justification: ""
            })
          }
        }

        const schoolCall = await models.schoolcalls.findOne({
          where: {
            idClass: idClass,
            date: frequency.date,
            classTheme: frequency.classTheme,
            gang: frequency.gang || ""
          }
        })

        if (schoolCall) {
          const updatedDescription = schoolCall.description === frequency.description ?
            schoolCall.description :
            schoolCall.description + '\n' + frequency.description

          let updatedAbsents = schoolCall.absents.map(({ idStudent, absence }) => {
            for (item of frequency.absences) {
              if (idStudent === item.idStudent && absentStudents.filter(abs => idStudent === abs.idStudent).length !== 0) {
                return {
                  idStudent: idStudent,
                  justification: "",
                  absence: absence + item.absence,
                }
              }
            }
          }).filter(item => !!item)

          for (student of frequency.absences) {
            if (
              students.filter(item => student.idStudent === item.idStudent && item.gang === frequency.gang).length !== 0 &&
              updatedAbsents.filter(({ idStudent }) => idStudent === student.idStudent).length === 0 &&
              student.absence
            ) {
              updatedAbsents.push({
                idStudent: student.idStudent,
                absence: student.absence,
                justification: ""
              })
            }
          }

          await models.schoolcalls.update({
            description: updatedDescription,
            absents: updatedAbsents
          }, { where: { id: schoolCall.id } })
        } else {
          await models.schoolcalls.create({
            idTeacher: idTeacher,
            idClass: idClass,
            classTheme: frequency.classTheme,
            gang: frequency.gang || "",
            bimester: frequency.bimester,
            date: frequency.date,
            description: frequency.description,
            absents: absentStudents
          })
        }

        res.status(200).send({ message: "Chamada realizada!" })
      } else {
        res.status(409).send({
          error: {
            message: 'Essa matéria não existe para essa turma',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhum aluno foi encontrado. Não foi possível concluir a chamada',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update frequency - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.generateBulletins = async (req, res) => {
  try {
    logger.info(`ClassController/generateBulletins - bulletin generation`)

    const idClass = req.params.idClass

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (!findClass) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada. Não foi possível gerar os boletins',
        }
      })
    }

    if (findClass.students.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Não existe nenhum aluno na classe. Não foi possível gerar os boletins',
        }
      })
    }

    let classThemeTeachers = []

    for (let { name } of findClass.classTheme) {
      const teacherExists = findClass.teachers.filter(({ classTheme }) => convertToSlug(name) === convertToSlug(classTheme))
      if (teacherExists.length !== 0) {
        if (teacherExists.length > 1) {
          for (let teacher of teacherExists) {
            classThemeTeachers.push({
              classTheme: name,
              teacherId: teacher.id,
              gang: teacher.gang
            })
          }
        } else {
          classThemeTeachers.push({
            classTheme: name,
            teacherId: teacherExists[0].id,
            gang: ''
          })
        }
      }
    }

    let classThemeTeachersNoGang = []
    let errors = []

    for (let teacher of classThemeTeachers) {
      if (!classThemeTeachersNoGang.some(({ classTheme }) => convertToSlug(classTheme) === convertToSlug(teacher.classTheme))) {
        if (!teacher.gang) {
          classThemeTeachersNoGang.push(teacher)
        } else if (classThemeTeachers.filter(({ classTheme }) => classTheme === teacher.classTheme).length !== 2) {
          errors.push('Matéria dividida em turmas mas faltando professores para uma das turmas ou ambas')
        } else {
          classThemeTeachersNoGang.push(teacher)
        }
      }
    }

    if (errors.length !== 0 || (findClass.classTheme.length !== classThemeTeachersNoGang.length)) {
      return res.status(400).send({
        error: {
          message: 'Não é possível gerar o boletim de uma matéria que não possui um professor atribuído a ela',
        }
      })
    }

    const studentClasses = await models.studentclasses.findAll({ where: { idClass: idClass } })

    for (let student of studentClasses) {
      const bulletin = await models.bulletin.findAll({ where: { idStudentClasses: student.id } })
      if (bulletin.length !== 0) {
        return res.status(400).send({
          error: {
            message: 'O boletim já foi gerado nessa sala',
          }
        })
      }
    }

    for (let student of studentClasses) {
      for (let classTheme of classThemeTeachers) {
        const totalClasses = student.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme.classTheme)
        )[0].totalClasses || 0

        const classesGiven = student.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme.classTheme)
        )[0].classesGiven || 0

        const absence = student.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme.classTheme)
        )[0].absence || 0

        const frequency = student.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme.classTheme)
        )[0].frequency || 0

        if (!classTheme.gang) {
          await models.bulletin.create({
            idInstitution: findClass.idInstitution,
            idTeacher: classTheme.teacherId,
            idStudentClasses: student.id,
            classTheme: classTheme.classTheme,
            totalClasses,
            classesGiven,
            absence,
            frequency,
          })
        } else if (student.gang.toUpperCase() === classTheme.gang.toUpperCase()) {
          await models.bulletin.create({
            idInstitution: findClass.idInstitution,
            idTeacher: classTheme.teacherId,
            idStudentClasses: student.id,
            classTheme: classTheme.classTheme,
            totalClasses,
            classesGiven,
            absence,
            frequency,
          })
        }
      }
    }

    return res.status(201).send({ message: "Boletim gerado com sucesso!" })
  } catch (err) {
    logger.error(`Failed to generate bulletins - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}