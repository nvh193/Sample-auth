import { generateToken, validPassword, generateHash } from "../lib/utils"
import redisClient from './../lib/redis'
import Traveller from "../models/Traveller"
import { v4 as uuidv4 } from 'uuid';
import config from 'config';
import _ from 'lodash';
import { TRAVELLER_STATUS } from "../lib/constants";


export const login = async (req, res, next) => {
  const { identifier, password } = req.body

  try {
    const foundTraveller = await Traveller.findOne({
      $or: [
        {
          userName: identifier
        },
        {
          email: identifier
        }
      ]
    })

    if (
      !foundTraveller ||
      !foundTraveller.password ||
      !validPassword(password, foundTraveller.password)
    ) {
      return next([
        400,
        'LOGIN_FAILED',
        'Traveller or password is not correct!'
      ])
    }
    if (foundTraveller.status != TRAVELLER_STATUS.Active) {
      return next([400, 'TRAVELLER_NOT_ACTIVE', 'Traveller is not active.'])
    }

    const user = _.omit(foundTraveller, [])
    const sessionId = uuidv4()

    const token = generateToken({
      sessionId
    })

    await redisClient.select(config.redis.db.traveller)
    await Promise.all([
      redisClient.set(
        `TRAVELLER_SESS:${sessionId}`,
        JSON.stringify({
          user
        })
      ),
      redisClient.set(`TRAVELLER_SESS_ID:${user._id}`, token, 'EX', config.application.tokenExpiresIn)
    ])

    res.status(200).json({
      user,
      token,
      message: 'Login successfully'
    })
    next()
  } catch (e) {
    console.log("login -> e", e)
    next([500, 'SERVER ERROR', '', e])
  }
}

export const register = async (req, res, next) => {
  const params = req.body;
  try {

    const foundTraveller = await Traveller.findOne({
      $or: [
        {
          userName: req.body.userName
        },
        {
          email: req.body.email
        }
      ]
    })

    if (foundTraveller) {
      return next([400, 'TRAVELLER_EXISTED', 'Traveller existed'])
    }

    params.password = generateHash(params.password)

    const traveller = await Traveller.create(params)
    const activeToken = uuidv4()
    await redisClient.select(config.redis.db.traveller)
    const setTokenResult = redisClient.set(
      `ACTIVE_TOKEN:${activeToken}`,
      traveller._id.toString(),
      'EX',
      config.application.activeTokenExpiresIn
    )
    return res.status(200).json({
      user: _.omit(traveller.toJSON(), ['password']),
      message:
        'Your registration is successfull, please check your email to activate your account, thank you.'
    })
  } catch (e) {
    console.log("register -> e", e)
    if (e.code === 11000) {
      return next([400, 'TRAVELLER_EXISTED', 'Traveller existed', e])
    }
    next([500, 'SERVER ERROR', '', e])
  }
}

export const checkAuth = (req, res, next) => {
  res.status(200).json({
    message: 'Logined'
  })
}