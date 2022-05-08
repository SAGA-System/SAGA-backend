const logger = require('../resources/logger')
const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)
const jwt = require('jsonwebtoken')
const normalizer = require('../resources/normalizer')

exports.index = async (req, res) => {
  try {
    logger.info(`ClassController/index - list all classes`)
    //await models.class_.sync({alter: true})

    const classes = await models.class_.findAll()

    if (classes.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi encontrada na plataforma'
        }
      })
    }

    res.status(200).send(classes)
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

    res.status(200).send(class_)
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
      console.log(courseData)

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
          classTheme: courseData[0].classTheme[schoolYear-1]
        })

        res.status(201).send({
          message: 'Classe criada com sucesso',
          newClass
        })
      } else {
        res.status(409).send({
          error: {
            message: 'Não existe modalidade do curso no turno solicitado',
          }
        })
      }
    } else {
      res.status(409).send({
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

      res.status(200).send(await models.class_.findOne({ where: { id: id } }))
    } else {
      res.status(404).send({
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

      res.status(200).send({
        message: 'Classe deletada com sucesso'
      })
    } else {
      res.status(404).send({
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
    const { students } = req.body

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (!students.name || (!students.id && typeof students.id === 'number') || (!students.ra && typeof students.ra === 'string')) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findClass) {
      let studentExistsInClass = false

      for (let i = 0; i < findClass.students.length; i++) {
        if ((findClass.students[i].id === students.id) || (findClass.students[i].ra === students.ra)) {
          studentExistsInClass = true
        }
      }

      if (!studentExistsInClass) {
        findClass.students.push(students)

        await models.class_.update({
          students: findClass.students,
        }, { where: { id: idClass } })

        res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        res.status(409).send({
          error: {
            message: 'Já existe um aluno nessa sala para as informações fornecidas',
          }
        })
      }
    } else {
      res.status(404).send({
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

        res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Não existe um aluno nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      res.status(404).send({
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
        if (findClass.students[i].id === Number(idUser)) {
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

        res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Não existe um aluno nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      res.status(404).send({
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

    if (!teachers.name || !teachers.id || !teachers.classTheme || !teachers.gang) {
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
        findClass.teachers.push(teachers)

        await models.class_.update({
          teachers: findClass.teachers,
        }, { where: { id: idClass } })

        res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        res.status(409).send({
          error: {
            message: 'Já existe um professor nessa sala com as informações fornecidas',
          }
        })
      }
    } else {
      res.status(404).send({
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

    const { name, gang, classTheme } = req.body
    const dataForUpdate = { name, gang, classTheme }

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
            gang: (dataForUpdate.gang) && (gang !== dataForUpdate.gang) ? dataForUpdate.gang : gang,
            classTheme: (dataForUpdate.classTheme) && (classTheme !== dataForUpdate.classTheme) ? dataForUpdate.classTheme : classTheme,
            name: (dataForUpdate.name) && (name !== dataForUpdate.name) ? dataForUpdate.name : name
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

        res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Não existe um professor nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      res.status(404).send({
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

        res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Não existe um professor nessa classe com as credenciais informadas',
          }
        })
      }
    } else {
      res.status(404).send({
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
    logger.info(`ClassController/addLessons - add lessons to existing class`)

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

      res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))

    } else {
      res.status(404).send({
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

exports.updateClassThemes = async (req, res) => {
  try {
    logger.info(`ClassController/addLessons - add lessons to existing class`)

    const idClass = req.params.idClass

    const {
      classTheme
    } = req.body

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    if (findClass) {
      await models.class_.update({
        classTheme: classTheme
      }, { where: { id: idClass } })

      res.status(200).send(await models.class_.findOne({ where: { id: idClass } }))

    } else {
      res.status(404).send({
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