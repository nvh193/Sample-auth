import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import config from 'config'
import _ from 'lodash'
import bcrypt from 'bcrypt-nodejs'
import generator from 'generate-password'

export const load = folderPath => {
  const returnObject = {}
  const fileNames = fs.readdirSync(folderPath)
  fileNames.forEach(fileName => {
    if (fs.statSync(path.resolve(folderPath, fileName)).isDirectory()) return
    if (fileName == 'index.js') return
    if (_.startsWith(fileName, '.')) return
    const filePath = path.resolve(folderPath, fileName)
    returnObject[fileName.split('.')[0]] =
      require(filePath).default || require(filePath)
  })
  return returnObject
}

export const generateToken = data => {
  return jwt.sign(data, config.application.secret, {
    expiresIn: config.application.tokenExpiresIn
  })
}

export const decodeToken = token => {
  try {
    return jwt.verify(token, config.application.secret)
  } catch (error) {
    return null
  }
}

export const generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

export const validPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

export const generatePassword = () => {
  return generator.generate({
    length: 12,
    number: true,
    uppercase: true,
    strict: true
  })
}