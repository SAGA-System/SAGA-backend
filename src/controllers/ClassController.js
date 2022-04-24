const logger = require('../resources/logger')
const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`ClassController/index - list all classes`)

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
          message: 'Nenhuma instituição foi encontrada. Verifique as informações e tente novamente'
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
      teachers,
      students,
      lessons,
      block,
      classNumber,
      classTheme
    } = req.body

    if (!period || !course || !schoolYear || !teachers || !students || !lessons || !block || !classNumber || !classTheme) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    let findClasses

    try {
      findClasses = await models.class_.findAll({
        where: {
          period: period,
          block: block,
          classNumber: classNumber
        }
      })
    } catch (err) {
      logger.error(`Failed to check if the class is available - Error: ${err.message}`)

      return res.status(500).send({
        error: {
          message: 'Ocorreu um erro interno do servidor'
        }
      })
    }

    const classIsAvailable = findClasses.length === 0 ? true : false;

    if (classIsAvailable) {
      const newClass = await models.class_.create({
        period: period,
        course: course,
        schoolYear: schoolYear,
        teachers: teachers,
        students: students,
        lessons: lessons,
        block: block,
        classNumber: classNumber,
        classTheme: classTheme
      })

      res.status(201).send({
        message: 'Instituição criada com sucesso',
        newClass
      })
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
    logger.info(`ClassController/show - update class by id`)

    const id = req.params.id

    const {
      period,
      course,
      schoolYear,
      teachers,
      students,
      lessons,
      block,
      classNumber,
      classTheme
    } = req.body

    let findClass

    try {
      findClass = await models.class_.findAll({ where: { id: id } })
    } catch (err) {
      logger.error(`Failed to check if the class exists - Error: ${err.message}`)

      return res.status(500).send({
        error: {
          message: 'Ocorreu um erro interno do servidor'
        }
      })
    }

    const classExists = findClass.length !== 0 ? true : false;

    if (classExists) {
      await models.class_.update({
        period: period,
        course: course,
        schoolYear: schoolYear,
        teachers: teachers,
        students: students,
        lessons: lessons,
        block: block,
        classNumber: classNumber,
        classTheme: classTheme
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
    logger.info(`ClassController/show - delete class by id`)

    const id = req.params.id

    let findClass

    try {
      findClass = await models.class_.findAll({ where: { id: id } })
    } catch (err) {
      logger.error(`Failed to check if the class exists - Error: ${err.message}`)

      return res.status(500).send({
        error: {
          message: 'Ocorreu um erro interno do servidor'
        }
      })
    }

    const classExists = findClass.length !== 0 ? true : false;

    if (classExists) {
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

    let classExists
    let findClass

    if (!students.name || (!students.id && typeof students.id === 'number') || (!students.ra && typeof students.ra === 'number')) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    try {
      findClass = await models.class_.findOne({ where: { id: idClass } })

      classExists = findClass ? true : false;
    } catch (err) {
      logger.error(`Failed to check if the class exists - Error: ${err.message}`)

      return res.status(500).send({
        error: {
          message: 'Ocorreu um erro interno do servidor'
        }
      })
    }

    if (classExists) {
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
        }, {
          where: {
            id: idClass
          }
        })
  
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

exports.StudentsToExistingClass = (req, res) => {
  try {
    logger.info(`ClassController/show - delete class by id`)

  } catch (err) {
    logger.error(`Failed to delete class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.StudentsToExistingClass = (req, res) => {
  try {
    logger.info(`ClassController/show - delete class by id`)

  } catch (err) {
    logger.error(`Failed to delete class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.StudentsToExistingClass = (req, res) => {
  try {
    logger.info(`ClassController/show - delete class by id`)

  } catch (err) {
    logger.error(`Failed to delete class by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}