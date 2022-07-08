const jwt = require('jsonwebtoken')

const logger = require('../resources/logger')

const initModels = require('../models/init-models')
const db = require('../models/db')
const { convertToSlug } = require('../resources/normalizer')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`TeachersController/index - list all teachers`)

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const teachers = await models.teachers.findAll({
      include: {
        model: models.users,
        as: 'idUser_user',
        where: {
          idInstitution: findUser.idInstitution
        }
      }
    })

    if (!teachers) {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado na plataforma'
        }
      })
    }

    for (let teacher of teachers) {
      delete teacher.dataValues.idUser_user
    }

    return res.status(200).send(teachers)
  } catch (err) {
    logger.error(`Failed to list teachers - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`TeachersController/show - list teacher by id`)

    const id = req.params.id

    const teachers = await models.teachers.findOne({ where: { id: id } })

    if (!teachers) {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    return res.status(200).send(teachers)
  } catch (err) {
    logger.error(`Failed to list teacher by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`TeachersController/store - create teacher`)

    const {
      idUser,
      speciality
    } = req.body

    if (!idUser || !speciality) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    let lessons = {
      "Monday": [],
      "Tuesday": [],
      "Wednesday": [],
      "Thursday": [],
      "Friday": [],
      "Saturday": [],
    }

    //{ "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": []}

    const newTeacher = await models.teachers.create({
      idUser: idUser,
      speciality: speciality,
      lessons: lessons,
    })

    return res.status(201).send({
      message: 'Professor criado com sucesso',
      newTeacher
    })

  } catch (err) {
    logger.error(`Failed to create teacher - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`TeachersController/update - update teacher by id`)

    const id = req.params.id

    const { speciality } = req.body

    const findTeacher = await models.teachers.findAll({ where: { id: id } })

    if (findTeacher.length !== 0) {
      await models.teachers.update({
        speciality: speciality,
      }, {
        where: {
          id: id
        }
      })

      return res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhuma Professor foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update teacher by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.addLessons = async (req, res) => {
  try {
    logger.info(`TeachersController/addLessons - add lessons to existing teacher`)

    const id = req.params.id

    let { lessons } = req.body

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const findTeacher = await models.teachers.findOne({ where: { id: id } })

    if (!lessons.classTheme || !lessons.day || !lessons.lesson || !lessons.period || !lessons.classBlock || !lessons.classNumber) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    //capital first letter 
    lessons.day = lessons.day[0].toUpperCase() + lessons.day.substring(1);
    lessons.gang = lessons.gang ? lessons.gang.toUpperCase() : ''
    lessons.classBlock = lessons.classBlock.toUpperCase()
    lessons.period = lessons.period.toLowerCase()

    if (findTeacher) {
      if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(lessons.day)) {
        return res.status(400).send({
          error: {
            message: 'O dia informado não é válido para o cadastro de aulas',
          }
        })
      }

      const classExists = await models.class_.findOne({
        where: {
          idInstitution: findUser.idInstitution,
          period: lessons.period,
          block: lessons.classBlock,
          classNumber: lessons.classNumber
        }
      })

      if (!classExists) {
        return res.status(400).send({
          error: {
            message: 'A classe informada não existe',
          }
        })
      }

      const classThemes = classExists.classTheme.map(({ name }) => { return convertToSlug(name) })

      if (!classThemes.includes(convertToSlug(lessons.classTheme))) {
        return res.status(400).send({
          error: {
            message: 'A matéria informada não está prevista no curso atribuído a classe informada',
          }
        })
      }

      if (findTeacher.lessons[lessons.day].filter(item => item.period === lessons.period && item.lesson === lessons.lesson).length === 0) {
        findTeacher.lessons[lessons.day].push({
          classTheme: lessons.classTheme,
          gang: lessons.gang || '',
          lesson: lessons.lesson,
          period: lessons.period,
          classBlock: lessons.classBlock,
          classNumber: lessons.classNumber,
        })

        if (findTeacher.lessons[lessons.day].length > 1) {
          findTeacher.lessons[lessons.day].sort((a, b) => {
            let x = a.lesson
            let y = b.lesson

            return x === y ? 0 : x > y ? 1 : -1
          })
        }

        await models.teachers.update({
          lessons: findTeacher.lessons,
        }, { where: { id: id } })

        return res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
      } else {
        return res.status(409).send({
          error: {
            message: 'Esse professor já possui uma aula no horário e dia informados',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Não foi possível concluir o cadastro',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to add lessons in teachers - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateLessons = async (req, res) => {
  try {
    logger.info(`TeachersController/updateLessons - update a lesson from an existing teacher`)

    const id = req.params.id
    let { day, period: periodParams, lesson: lessonParams } = req.query

    let { classTheme, classBlock, classNumber, gang } = req.body

    if (!day || !periodParams || !lessonParams) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para localizar a aula e editá-la.'
        }
      })
    }

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const findTeacher = await models.teachers.findOne({ where: { id: id } })

    day = day[0].toUpperCase() + day.substring(1);
    periodParams = periodParams.toLowerCase()
    gang = gang && gang.toUpperCase()
    classBlock = classBlock && classBlock.toUpperCase()

    if (findTeacher) {
      if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(day)) {
        return res.status(400).send({
          error: {
            message: 'O dia informado não é válido para localizar a aula',
          }
        })
      }

      if (classBlock && !classNumber || classNumber && !classBlock) {
        return res.status(400).send({
          error: {
            message: 'Não é possível atualizar a classe onde será a aula com apenas um parâmetro informado',
          }
        })
      }

      const lessonExists = findTeacher.lessons[day].filter((item) => item.period === periodParams && item.lesson === Number(lessonParams))

      if (lessonExists.length !== 0) {
        const classExists = classBlock && classNumber ? await models.class_.findOne({
          where: {
            idInstitution: findUser.idInstitution,
            period: periodParams,
            block: classBlock,
            classNumber: classNumber
          }
        }) : await models.class_.findOne({
          where: {
            idInstitution: findUser.idInstitution,
            period: periodParams,
            block: lessonExists[0].classBlock,
            classNumber: lessonExists[0].classNumber
          }
        })

        if (!classExists) {
          return res.status(400).send({
            error: {
              message: 'A classe informada não existe',
            }
          })
        }

        const classThemes = classExists.classTheme.map(({ name }) => { return convertToSlug(name) })

        if (!classThemes.includes(convertToSlug(classTheme))) {
          return res.status(400).send({
            error: {
              message: 'A matéria informada não está prevista no curso atribuído a classe informada',
            }
          })
        }

        let lessonsUpdated = findTeacher.lessons

        const lessonInDayUpdated = findTeacher.lessons[day].map(({ lesson, period, classTheme: oldClassTheme, classBlock: oldClassBlock, classNumber: oldClassNumber, gang: oldGang }) => {
          return period === periodParams && lesson === Number(lessonParams) ? {
            classTheme: (classTheme) && (classTheme !== oldClassTheme) ? classTheme : oldClassTheme,
            gang: (gang) && (gang !== oldGang) ? gang : oldGang,
            lesson,
            period,
            classBlock: (classBlock) && (classBlock !== oldClassBlock) ? classBlock : oldClassBlock,
            classNumber: (classNumber) && (classNumber !== oldClassNumber) ? classNumber : oldClassNumber,
          } : {
            classTheme: oldClassTheme,
            gang: oldGang,
            lesson,
            period,
            classBlock: oldClassBlock,
            classNumber: oldClassNumber,
          }
        })

        lessonsUpdated[day] = lessonInDayUpdated

        await models.teachers.update({
          lessons: lessonsUpdated,
        }, { where: { id: id } })

        return res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
      } else {
        return res.status(404).send({
          error: {
            message: 'Não existe uma aula com esse professor com as credenciais informadas',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update lessons in teachers - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.deleteLessons = async (req, res) => {
  try {
    logger.info(`TeachersController/deleteLessons - delete a lesson from an existing teacher`)

    const id = req.params.id
    let { day, period: periodParams, lesson: lessonParams } = req.query

    day = day[0].toUpperCase() + day.substring(1);
    periodParams = periodParams.toLowerCase()

    const findTeacher = await models.teachers.findOne({ where: { id: id } })

    if (findTeacher) {
      if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(day)) {
        return res.status(400).send({
          error: {
            message: 'O dia informado não é válido para localizar a aula',
          }
        })
      }

      if (findTeacher.lessons[day].filter((item) => item.period === periodParams && item.lesson === Number(lessonParams)).length !== 0) {
        let lessonsUpdated = findTeacher.lessons

        const lessonInDayUpdated = findTeacher.lessons[day].filter((item) =>
          (item.period === periodParams && item.lesson !== Number(lessonParams)) ||
          (item.period !== periodParams && item.lesson !== Number(lessonParams))
        )

        lessonsUpdated[day] = lessonInDayUpdated

        await models.teachers.update({
          lessons: lessonsUpdated,
        }, { where: { id: id } })

        return res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
      } else {
        return res.status(404).send({
          error: {
            message: 'Aula não encontrada ou já deletada',
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Não foi possível concluir a remoção',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete lessons by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}