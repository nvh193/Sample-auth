// import * as mailer from "./../lib/mailer";
// import config from "config";
import debug from 'debug'
const debuglog = debug('thanktriips:errorHandler')

export default (error, req, res, next) => {
  debuglog('error', error)
  req.logger && req.logger.error('ErrorHandler.error', error, req.requestId)

  const message = error[2]
    ? error[2].message
      ? error[2].message
      : error[2].valueOf()
        ? error[2].valueOf()
        : error[2].toString()
          ? error[2].toString()
          : error[3].message
            ? error[3].message
            : error[3].valueOf()
              ? error[3].valueOf()
              : error[3].toString()
    : ''

  const statusCode = error[0] || 500

  res.status(statusCode).json({
    success: false,
    code: error[1],
    message,
    data: error[3] || error[2],
    traceId: req.requestId
  })
}
