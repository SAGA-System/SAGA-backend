const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const crypto = require('crypto')

const logger = require('../resources/logger')
const normalizer = require('../resources/normalizer')
const dataValidator = require('../resources/dataValidator')
const mailer = require('../../config/nodemailer')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`UserController/index - list all institutions`)

    const users = await models.users.findAll()

    if (users.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado na plataforma'
        }
      })
    }

    for (let i = 0; i < users.length; i++) {
      delete users[i].dataValues.password;
    }

    return res.status(200).send(users)

  } catch (err) {
    logger.error(`Failed to list users - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`UserController/show - list user by id`)

    const id = req.params.id

    const user = await models.users.findOne({ where: { id: id } })

    if (!user) {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    delete user.dataValues.password

    return res.status(200).send(user)
  } catch (err) {
    logger.error(`Failed to list user by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`UserController/store - create user`)

    let {
      idInstitution,
      name,
      password,
      cpf,
      rg,
      allPermissions,
      flowType,
      email,
      phone,
      street,
      number,
      district,
      complement,
      city,
      //for teachers
      speciality,
      //for students
      idClass,
      ra,
      schoolYear,
      situation,
    } = req.body

    // criação do usuário - flowType
    // 1 - admin
    // 2 - diretor
    // 3 - coordenação
    // 4 - professor
    // 5 - pais
    // 6 - aluno

    if (!idInstitution || !name || !password || !cpf || !rg || !allPermissions ||
      !flowType || !email || !phone || !street || !number || !district || !city ||
      flowType === 4 && (!speciality) || flowType === 6 && (!idClass || !ra || !schoolYear || !situation)) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    //normalize data
    rg = normalizer.removeMask(rg)
    cpf = normalizer.removeMask(cpf)
    phone = normalizer.removeMask(phone)

    if (ra) {
      ra = normalizer.removeMask(ra)
    }

    const token = req.headers.authorization

    const findForCPF = await models.users.findAll({ where: { cpf: cpf } })
    const findForEmail = await models.users.findAll({ where: { email: email } })

    if (findForCPF.length === 0 && findForEmail.length === 0) {
      if (dataValidator.validateCPF(cpf)) {
        bcrypt.hash(password, 10, async (errBcrypt, hash) => {
          if (errBcrypt) {
            return res.status(500).send({
              error: {
                message: errBcrypt
              }
            })
          }

          const user = await models.users.create({
            idInstitution: idInstitution,
            name: name,
            password: hash,
            cpf: cpf,
            rg: rg,
            allPermissions: allPermissions,
            flowType: flowType,
            email: email,
            phone: phone,
            street: street,
            number: number,
            district: district,
            complement: complement,
            city: city
          })

          delete user.dataValues.password;

          try {
            if (flowType === 4) {
              await axios({
                method: 'post',
                url: process.env.URL_CREATE_TEACHERS,
                headers: { authorization: token },
                data: {
                  idUser: user.id,
                  speciality: speciality,
                }
              });
            } else if (flowType === 6) {
              await axios({
                method: 'post',
                url: process.env.URL_CREATE_STUDENTS,
                headers: { authorization: token },
                data: {
                  idUser: user.id,
                  idClass: idClass,
                  ra: ra,
                  schoolYear: schoolYear,
                  situation: situation,
                }
              });
              await axios({
                method: 'post',
                url: `${process.env.URL_ADD_STUDENTS}/${idClass}`,
                headers: { authorization: token },
                data: {
                  students: {
                    id: user.id,
                    name: user.name,
                    ra: ra
                  }
                }
              });
            }
          } catch (err) {
            await models.users.destroy({ where: { id: user.id } })
            logger.error(`Failed to create user - Error: ${err?.response?.data?.error?.message || err.message}`)

            return res.status(500).send({
              error: {
                message: err?.response?.data?.error?.message || 'Ocorreu um erro interno do servidor'
              }
            })
          }

          return res.status(201).send({
            message: "Usuário criado com sucesso",
            user
          })
        })
      } else {
        return res.status(409).send({
          error: {
            message: 'CPF inválido'
          }
        })
      }
    } else {
      return res.status(409).send({
        error: {
          message: 'Já existe um usuário na plataforma com essas credenciais'
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to create user - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`UserController/update - update user by id`)

    const token = req.headers.authorization
    const id = req.params.id

    const {
      name,
      cpf,
      rg,
      flowType,
      phone,
      street,
      number,
      district,
      complement,
      city,
    } = req.body

    const findUser = await models.users.findOne({ where: { id: id } })

    if (findUser) {
      await models.users.update({
        name: name,
        cpf: cpf,
        rg: rg,
        flowType: flowType,
        phone: phone,
        street: street,
        number: number,
        district: district,
        complement: complement,
        city: city
      }, { where: { id: id } })

      const updatedUser = await models.users.findOne({ where: { id: id } })

      if (name !== findUser.dataValues.name) {
        if (updatedUser.dataValues.flowType === 4) {
          const Classes = await models.class_.findAll({ where: { idInstitution: updatedUser.idInstitution } })

          const ids = Classes.filter((item) => item.dataValues.teachers.length > 0 && item.dataValues.teachers.map(item => {
            return item.id === Number(id)
          }).some(elem => elem === true))

          for (let i = 0; i < ids.length; i++) {
            await axios({
              method: 'put',
              url: `${process.env.URL_UPDATE_TEACHERS_FROM_CLASS}/${ids[i].id}/${id}`,
              headers: { authorization: token },
              data: {
                name: name,
              }
            }).catch(err => {
              logger.error(`Failed to update user - Error: ${err?.response?.data?.error?.message || err.message}`)

              return res.status(500).send({
                error: {
                  message: err?.response?.data?.error?.message || 'Ocorreu um erro interno do servidor'
                }
              })
            });
          }
        } else if (updatedUser.dataValues.flowType === 6) {
          const Classes = await models.class_.findAll({ where: { idInstitution: updatedUser.idInstitution } })

          const ids = Classes.filter((item) => item.dataValues.students.length > 0 && item.dataValues.students.map(item => {
            return item.id === Number(id)
          }).some(elem => elem === true))

          for (let i = 0; i < ids.length; i++) {
            await axios({
              method: 'put',
              url: `${process.env.URL_UPDATE_STUDENTS_FROM_CLASS}/${ids[i].id}/${id}`,
              headers: { authorization: token },
              data: {
                name: name,
              }
            }).catch(err => {
              logger.error(`Failed to update user - Error: ${err?.response?.data?.error?.message || err.message}`)

              return res.status(500).send({
                error: {
                  message: err?.response?.data?.error?.message || 'Ocorreu um erro interno do servidor'
                }
              })
            });
          }
        }
      }

      delete updatedUser.dataValues.password

      return res.status(200).send(updatedUser)
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update user by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`UserController/destroy - delete user by id`)

    const id = req.params.id

    const token = req.headers.authorization

    const findUser = await models.users.findAll({ where: { id: id } })

    if ((findUser[0].flowType === 4) || (findUser[0].flowType === 6)) {
      const flowType = findUser[0].flowType
      const Classes = await models.class_.findAll()

      const ids = Classes.filter(({ teachers, students }) => flowType === 4 ? teachers.length > 0 && teachers.map(item => {
        return item.id === Number(id)
      }).some(elem => elem === true) : students.length > 0 && students.map(item => {
        return item.id === Number(id)
      }).some(elem => elem === true))

      for (let i = 0; i < ids.length; i++) {
        await axios({
          method: 'delete',
          url: `${flowType === 4 ? process.env.URL_DELETE_TEACHERS_FROM_CLASS : process.env.URL_DELETE_STUDENTS_FROM_CLASS}/${ids[i].id}/${id}`,
          headers: { authorization: token },
        });
      }
    }

    if (findUser.length > 0) {
      await models.users.destroy({ where: { id: id } })

      return res.status(200).send({
        message: 'Usuário deletado com sucesso'
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Usuário não encontrada ou já deletado'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete user by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.login = async (req, res) => {
  try {
    logger.info(`UserController/login - login`)

    const {
      id,
      password,
    } = req.body

    const findUser = await models.users.findAll({ where: { id: id } })

    if (findUser.length === 0) {
      return res.status(401).send({
        error: {
          message: 'Email ou senha incorretos'
        }
      })
    }

    bcrypt.compare(password, findUser[0].password, (err, results) => {
      if (err) {
        return res.status(401).send({
          error: {
            message: 'Falha na autenticação'
          }
        })
      }
      if (results) {
        const token = jwt.sign({
          id: findUser[0].id,
        }, process.env.JWT_KEY, {
          expiresIn: "3h"
        })
        return res.status(200).send({
          message: 'Autenticado com sucesso',
          token: token
        })
      }
      return res.status(401).send({ message: 'Email ou senha incorretos' })
    })
  } catch (err) {
    logger.error(`Failed to login user - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    logger.info(`UserController/forgotPassword - send a mail to reset password`)
    const { email } = req.body;

    const findUser = await models.users.findOne({ where: { email: email } })

    if (findUser) {
      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date();
      now.setHours(now.getHours() - 2)

      await models.users.update({
        resetPassword: {
          token: token,
          expiresIn: now
        }
      }, { where: { email: email } })

      mailer.sendMail({
        to: email,
        from: 'zulianc09@gmail.com',
        subject: 'Solicitação de Alteração de Senha',
        template: 'forgotPassword',
        context: { token },
      }, (err) => {
        if (err) {
          logger.error(`Can't send email to reset password - Error: ${err.message}`)

          return res.status(400).send({
            error: {
              message: 'Não foi possível mandar o e-mail para reset de senha'
            }
          })
        }

        return res.send()
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado. verifique o email e tente novamente',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to forgot user password - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    logger.info(`UserController/resetPassword - reset password`)
    const { email, token, password } = req.body

    const user = await models.users.findOne({ where: { email: email } })

    if (user) {
      if (token === user.resetPassword.token) {
        const now = new Date()
        now.setHours(now.getHours() - 3)
        const expiresIn = new Date(user.resetPassword.expiresIn)

        if (expiresIn >= now) {
          bcrypt.hash(password, 10, async (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({
                error: {
                  message: errBcrypt
                }
              })
            }

            await models.users.update({
              password: hash
            }, { where: { email: email } })

            return res.status(200).send({
              message: 'Senha atualizada com sucesso!'
            })
          })
        } else {
          return res.status(400).send({
            error: {
              message: 'Token expirado. Solicite novamente o reset de senha'
            }
          })
        }
      } else {
        return res.status(400).send({
          error: {
            message: 'Token inválido'
          }
        })
      }
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado. verifique o email e tente novamente',
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to reset user password - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}