const jwt = require('jsonwebtoken')

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

    res.status(200).send(students)
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

    const students = await models.students.findOne({ where: { id: id } })

    if (!students) {
      return res.status(404).send({
        error: {
          message: 'Nenhum estudante foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    res.status(200).send(students)
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

    const modifyCourses = findClass.classTheme.map(({ name, totalClasses }) => {
      return {
        name,
        totalClasses,
        classesGiven: 0,
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

      res.status(201).send({
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

      res.status(200).send(await models.students.findOne({ where: { id: id } }))
    } else {
      res.status(404).send({
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