const jwt = require('jsonwebtoken')
const moment = require('moment')

const logger = require('../resources/logger')
const normalizer = require('../resources/normalizer')

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
      const courseData = findInstitution.courses.filter((item) => normalizer.convertToSlug(item.name) === normalizer.convertToSlug(course))

      if (period.toLowerCase() === courseData[0].period.toLowerCase()) {
        const newClass = await models.class_.create({
          idInstitution: findInstitution.id,
          period: period,
          course: course,
          schoolYear: schoolYear,
          teachers: [],
          students: [],
          lessons: courseData[0].lessons,
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

    const findClass = await models.class_.findAll({ where: { id: id } })

    if (findClass.length !== 0) {
      await models.class_.update({
        period: period,
        course: course,
        schoolYear: schoolYear,
        block: block,
        classNumber: classNumber,
      }, {
        where: {
          id: id
        }
      })

      return res.status(200).send(await models.class_.findOne({ where: { id: id } }))
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
      let studentExistsInClass = false

      for (let i = 0; i < findClass.students.length; i++) {
        if (findClass.students[i].id === Number(idUser)) {
          studentExistsInClass = true
        }
      }

      if (studentExistsInClass) {
        const studentsUpdated = findClass.students.map(({ id, ra, name }) => {
          return id === Number(idUser) ? {
            id,
            ra: (dataForUpdate.ra) && (ra !== dataForUpdate.ra) ? dataForUpdate.ra : ra,
            name: (dataForUpdate.name) && (name !== dataForUpdate.name) ? dataForUpdate.name : name
          } : {
            id,
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

    if (!teachers.id || !teachers.classTheme || !teachers.gang) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findClass) {
      let teachersExistsInClass = false

      for (let i = 0; i < findClass.teachers.length; i++) {
        if (
          (findClass.teachers[i].id === teachers.id) &&
          (findClass.teachers[i].classTheme === teachers.classTheme) &&
          (findClass.teachers[i].gang === teachers.gang)
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
              id: teachers.id
            }
          }
        })

        teachers.name = user.idUser_user.name
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

    const { gang, classTheme } = req.body
    const dataForUpdate = { gang, classTheme }

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      let teacherExistsInClass = false

      for (let i = 0; i < findClass.teachers.length; i++) {
        if (findClass.teachers[i].id === Number(idUser)) {
          teacherExistsInClass = true
        }
      }

      if (teacherExistsInClass) {
        const teachersUpdated = findClass.teachers.map(({ id, classTheme, name, gang }) => {
          return id === Number(idUser) ? {
            id,
            name,
            gang: (dataForUpdate.gang) && (gang !== dataForUpdate.gang) ? dataForUpdate.gang : gang,
            classTheme: (dataForUpdate.classTheme) && (classTheme !== dataForUpdate.classTheme) ? dataForUpdate.classTheme : classTheme,
          } : {
            id,
            name,
            gang,
            classTheme
          }
        })

        await models.class_.update({
          teachers: teachersUpdated,
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
    logger.error(`Failed to update student in class - Error: ${err.message}`)

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

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      let teacherExistsInClass = {
        value: false,
        id: null
      }

      for (let i = 0; i < findClass.teachers.length; i++) {
        if (findClass.teachers[i].id === Number(idUser)) {
          teacherExistsInClass = {
            value: true,
            id: i
          }
        }
      }

      if (teacherExistsInClass.value) {
        const updatedTeachers = findClass.teachers.filter((_, index) => index !== teacherExistsInClass.id)

        await models.class_.update({
          teachers: updatedTeachers,
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

    const {
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday
    } = req.body

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      await models.class_.update({
        lessons: {
          Monday,
          Tuesday,
          Wednesday,
          Thursday,
          Friday,
          Saturday
        }
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

exports.updateClassThemes = async (req, res) => {
  try {
    logger.info(`ClassController/updateClassThemes - update class themes to existing class`)

    const idClass = req.params.idClass

    const {
      classTheme
    } = req.body

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      await models.class_.update({
        classTheme: classTheme
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
    logger.error(`Failed to update class themes by id - Error: ${err.message}`)

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
        let x = normalizer.convertToSlug(a.name).toLowerCase()
        let y = normalizer.convertToSlug(b.name).toLowerCase()

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

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    let students = frequency.gang ?
      await models.studentclasses.findAll({ where: { idClass: idClass, gang: frequency.gang } }) :
      await models.studentclasses.findAll({ where: { idClass: idClass } })

    if (!frequency.classTheme || !frequency.classesGiven || !frequency.date || !frequency.description || !frequency.absences) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para realizar a chamada. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    let updatedStudents = []
    for (s of students) {
      const studentExists = frequency.absences.filter(({ idStudent }) => idStudent === s.idStudent)

      if (studentExists.length !== 0) {
        updatedStudents.push(s)
      }
    }

    students = updatedStudents

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
            idUser: tokenDecoded.id,
            idClass: idClass,
            classTheme: frequency.classTheme,
            gang: frequency.gang || "",
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