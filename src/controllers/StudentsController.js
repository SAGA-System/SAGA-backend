const jwt = require('jsonwebtoken')
const moment = require('moment')

const logger = require('../resources/logger')
const normalizer = require('../resources/normalizer')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`studentsController/index - list all students`)

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    let students = await models.students.findOne({
      include: {
        model: models.users,
        as: 'idUser_user',
        where: {
          idInstitution: findUser.idInstitution
        }
      }
    })

    if (!students) {
      return res.status(404).send({
        error: {
          message: 'Nenhum estudante foi encontrado na plataforma'
        }
      })
    }

    delete students.dataValues.idUser_user

    return res.status(200).send(students)
  } catch (err) {
    logger.error(`Failed to list students - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`studentsController/show - list student by id`)

    const id = req.params.id

    const students = await models.students.findOne({
      include: {
        model: models.studentclasses,
        as: 'studentclasses',
      },
      where: { id: id }
    })

    if (!students) {
      return res.status(404).send({
        error: {
          message: 'Nenhum estudante foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    return res.status(200).send(students)
  } catch (err) {
    logger.error(`Failed to list student by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`studentsController/store - create student`)

    let {
      idUser,
      idClass,
      ra,
      schoolYear,
      situation,
    } = req.body

    ra = normalizer.removeMask(ra)

    if (!idUser || !idClass || !ra || !schoolYear || !situation) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    const modifyCourses = findClass.classTheme.map(({ name: classTheme, totalClasses }) => {
      return {
        classTheme,
        totalClasses,
        classGiven: 0,
        absence: 0
      }
    })

    Object.assign(findClass, { classTheme: modifyCourses });

    const studentExists = await models.students.findAll({ where: { ra: ra } })

    if (studentExists.length === 0) {
      const newStudent = await models.students.create({
        idUser: idUser,
        ra: ra,
        schoolYear: schoolYear,
        situation: situation,
      })

      await models.studentclasses.create({
        idStudent: newStudent.id,
        idClass: idClass,
        gang: '',
        frequency: findClass.classTheme
      })

      for (let classTheme of findClass.classTheme) {
        await models.frequency.create({
          idStudent: newStudent.id,
          ...classTheme
        })
      }

      return res.status(201).send({
        message: 'Estudante criado com sucesso',
        newStudent
      })
    } else {
      return res.status(409).send({
        error: {
          message: 'Já existe um usuário na plataforma com o ra informado'
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to create student - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`studentsController/update - update student by id`)

    const id = req.params.id

    const { schoolYear, situation } = req.body

    const findStudent = await models.students.findAll({ where: { id: id } })

    if (findStudent.length !== 0) {
      await models.students.update({
        schoolYear: schoolYear,
        situation: situation,
      }, { where: { id: id } })

      return res.status(200).send(await models.students.findOne({ where: { id: id } }))
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma estudante foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update student by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.justifyAbsences = async (req, res) => {
  try {
    logger.info(`studentsController/justifyAbsences - justify absences on specific days`)

    const idStudent = req.params.idStudent
    const idClass = req.params.idClass

    let { startDate, endDate, justify } = req.body

    startDate = new Date(startDate).setHours(0, 0, 0, 0)
    startDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss')

    endDate = new Date(endDate).setHours(0, 0, 0, 0)
    endDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss')

    const findStudent = await models.students.findAll({ where: { id: idStudent } })
    const findAbsences = await models.schoolcalls.findAll({ where: { idClass: idClass } })

    if (findStudent.length !== 0) {
      if (findAbsences.length !== 0) {
        let absences = findAbsences.filter(item =>
          moment(item.date).format('YYYY-MM-DD HH:mm:ss') >= startDate &&
          moment(item.date).format('YYYY-MM-DD HH:mm:ss') <= endDate &&
          item.absents.map(item => {
            item.idStudent === Number(idStudent) ? true : false
          })
        )

        absences.map(({ absents }) => {
          for (a of absents) {
            if (a.idStudent === Number(idStudent)) {
              a.justification = justify
            } else {
              a
            }
          }
        })

        for (a of absences) {
          await models.schoolcalls.update({
            absents: a.absents
          }, { where: { id: a.id } })
        }

        return res.status(200).send({ message: 'Faltas justificadas com sucesso!' })
      } else {
        return res.status(404).send({
          error: {
            message: 'Nenhuma falta foi encontrada para ser justificada.',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum estudante foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to justify absences in student by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}