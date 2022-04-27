const mysql = require('../../mysql').pool;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../resources/logger')
const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)
const normalizer = require('../resources/normalizer')

exports.index = async (req, res) => {
  try {
    //await models.users.sync({alter: true})
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
      city
      //for students

      //for teachers

    } = req.body

    // criação do usuário - flowType
    // 1 - admin
    // 2 - diretor
    // 3 - coordenação
    // 4 - professor
    // 5 - pais
    // 6 - aluno

    rg = normalizer.removeMask(rg)
    cpf = normalizer.removeMask(cpf)
    phone = normalizer.removeMask(phone)

    const findForCPF = await models.users.findAll({ where: { cpf: cpf } })

    if(findForCPF.length === 0) {
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
  
        for (let i = 0; i < user.length; i++) {
          delete user[i].dataValues.password;
        }
  
        res.status(201).send({
          message: "Usuário criado com sucesso",
          user
        })
      })
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

exports.login = (req, res) => {
  mysql.getConnection((err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }

    const {
      id,
      password,
    } = req.body

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (err, result, fields) => {
        if (err) { return res.status(500).send({ error: err }) }

        if (result.length < 1) { return res.status(401).send({ message: 'Email ou senha incorretos' }) }

        bcrypt.compare(password, result[0].password, (err, results) => {
          if (err) {
            return res.status(401).send({
              error: {
                message: 'Falha na autenticação'
              }
            })
          }
          if (results) {
            const token = jwt.sign({
              id: result[0].id,
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

        connection.release()
      }
    )
  })
}