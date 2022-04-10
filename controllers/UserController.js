const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../resources/logger')

exports.index = (req, res) => {
  mysql.getConnection((err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }
    logger.info(`UserController/show - list all institutions`)

    connection.query(
      "SELECT * FROM users",
      (err, result, fields) => {
        if (err) { 
          logger.error(`Failed to list users - Error: ${err.message}`)

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }

        if (result.length === 0) {
          return res.status(404).send({
            error: {
              message: 'Nenhum usuário foi encontrado na plataforma'
            }
          })
        }

        res.status(200).send(result.map(({ idInstitution,
          name,
          allPermissions,
          flowType,
          email,
          phone,
          street,
          number,
          district,
          complement,
          city }) => {
          return {
            institution: idInstitution,
            name: name,
            allPermissions: allPermissions,
            flowType: flowType,
            email: email,
            phone: phone,
            street: street,
            number: number,
            district: district,
            complement: complement,
            city: city
          }
        }))
        connection.release()
      }
    )
  })
}

exports.show = (req, res) => {}

exports.store = (req, res) => {
  mysql.getConnection((err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }
    logger.info(`UserController/store - create user`)

    try {
      let {
        idInstitution,
        name,
        password,
        allPermissions,
        flowType,
        email,
        phone,
        street,
        number,
        district,
        complement,
        city
      } = req.body

      bcrypt.hash(password, 10, (errBcrypt, hash) => {
        if (errBcrypt) {
          return res.status(500).send({
            error: {
              message: errBcrypt
            }
          })
        }

        connection.query(
          `INSERT INTO users (idInstitution, name, password, allPermissions, flowType, email, phone, street, number, district, ${!complement ? '' : 'complement,'} city) VALUES (?,?,?,?,?,?,?,?,?,?,${!complement ? '' : '?,'}?)`,
          !complement ? [idInstitution, name, hash, JSON.stringify(allPermissions), flowType, email, phone, street, number, district, city] : [idInstitution, name, password, JSON.stringify(allPermissions), flowType, email, phone, street, number, district, complement, city],
          (err, result, fields) => {
            if (err) { 
            logger.error(`Failed to list users - Error: ${err.message}`)
  
            return res.status(500).send({
              error: {
                message: 'Ocorreu um erro interno do servidor'
              }
            }) 
          }
  
            res.status(201).send({
              message: "Usuário criado com sucesso",
              user: {
                institution: idInstitution,
                name: name,
                allPermissions: allPermissions,
                flowType: flowType,
                email: email,
                phone: phone,
                street: street,
                number: number,
                district: district,
                complement: complement,
                city: city
              }
            })
            connection.release()
          }
        )
      })

    } catch (err) {
      return res.status(500).send({
        error: {
          message: err.message
        }
      })
    }
  })
}

exports.update = (req, res) => {}

exports.destroy = (req, res) => {}

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