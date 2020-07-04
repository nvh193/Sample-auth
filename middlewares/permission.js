import path from 'path'
import debug from 'debug'
import * as Util from './../lib/utils'
import redisClient from './../lib/redis'
const debuglog = debug('thanktrip:permission')

export default (req, res, next) => {
  const url = path.join(req.baseUrl, req.route.path)
  debuglog('url ', url)
  const method = req.method.toLowerCase()
  const token = req.headers['x-access-token']
  if (!token) return next()

  try {
    const decoded = Util.decodeToken(token)
    debuglog('decoded.sessionId ', decoded.sessionId)
    redisClient.get(`TRAVELLER_SESS:${decoded.sessionId}`, (err, session) => {
      if (err || !session) {
        return next(
          !permission
            ? null
            : [401, 'PERMISSION_DENIED', 'Invalid access token']
        )
      }
      req.session = JSON.parse(session)
      req.user = req.session.user
      req.sessionId = decoded.sessionId
      req.lang = req.session.user.lang || 'VI'
      next()
    })
  } catch (err) {
    return next(
      !permission ? null : [401, 'PERMISSION_DENIED', 'Invalid access token']
    )
  }
}
