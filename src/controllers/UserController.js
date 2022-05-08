const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')

const logger = require('../resources/logger')
const normalizer = require('../resources/normalizer')
const dataValidator = require('../resources/dataValidator')

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

    res.status(200).send(users)

  } catch (err) {
    logger.error(`Failed to list users - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => { }

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

    if(ra) {
      ra = normalizer.removeMask(ra)
    }

    const token = req.headers.authorization

    const findForCPF = await models.users.findAll({ where: { cpf: cpf } })
    const findForEmail = await models.users.findAll({ where: { email: email } })

    if (findForCPF.length === 0 && findForEmail.length === 0) {
      if(dataValidator.validateCPF(cpf)) {
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
  
          res.status(201).send({
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

exports.update = async (req, res) => { }

exports.destroy = async (req, res) => { }

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
          expiresIn: "1h"
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