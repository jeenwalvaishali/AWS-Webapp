const winston = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');

const options = {
  file: {
    level: 'info',
    filename: '/home/ubuntu/webapp/logs/csye6225.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File(options.file),
    new CloudWatchTransport({
      logGroupName: 'csye6225', 
      logStreamName: 'webapp',
      createLogGroup: true,
      createLogStream: true,
      submissionInterval: 100,
      submissionRetryCount: 1,
      batchSize: 5,
      awsConfig: {
        region: 'us-east-1',
      },
      formatLog: item =>
        `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`
    }),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
})

// const logger = winston.createLogger({
//   levels: winston.config.npm.levels,
//   transports: [
//     new CloudWatchTransport({
//       logGroupName: 'csye6225', 
//       logStreamName: 'webapp',
//       createLogGroup: true,
//       createLogStream: true,
//       submissionInterval: 100,
//       submissionRetryCount: 1,
//       batchSize: 5,
//       awsConfig: {
//         region: 'us-east-1',
//       },
//       formatLog: item =>
//         `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`
//     }),
//   ],
//   exitOnError: false
// })

module.exports = logger