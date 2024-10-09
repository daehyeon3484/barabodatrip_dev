const winston = require("winston");
const { format, transports, createLogger } = winston;
const path = require("path");
const winstonDaily = require('winston-daily-rotate-file'); // 로그파일 일자별로 생성
const appRoot = require('app-root-path'); // app root 경로를 가져오는 lib
const process = require('process');
const dotenv = require("dotenv");
dotenv.config({path: './.server.env'});
const logDir = `${process.env.VUE_APP_LOG_FILE_PATH}/logs`; //logs 디렉토리 하위에 로그파일저장
// const logDir = `${appRoot}/logs/`; //logs 디렉토리 하위에 로그파일저장
// const consoleloggerLevel = process.env.NODE_ENV == 'production' ? 'info' : 'debug';
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({
    format : 'YYYY-MM-DD HH:mm:ss',
  }),
  format.align(),
  format.json(),
  format.printf((info) => {
    return `${info.timestamp} ${info.level} : ${JSON.stringify(info.metadata)}`;
  })
);

const fileFormat = format.combine(
  format.timestamp({
    format : 'YYYY-MM-DD HH:mm:ss',
  }),
  format.metadata({ fillExcept: ["timestamp","level","message"]}),
  format.json(),
  format.printf((info) => {
    return `${info.timestamp} ${info.level} : ${JSON.stringify(info.metadata)}`;
  })
);

const logger = createLogger({
  level: "info",
  // defaultMeta: { service: "some-random-service" },
  format: fileFormat,
  transports: [
    new winstonDaily({
      level : 'info',
      datePattern : 'YYYY-MM-DD',
      dirname: logDir+`\/info`,
      filename : `%DATE%.log`,
      maxFiles : 30, // 30일치 로그 파일 저장
      zippedArchive : true,
      // filename: path.join(__dirname, "../logs/error.log"),
    }),
    new winstonDaily({
      level : 'error',
      datePattern : 'YYYY-MM-DD',
      dirname: logDir+`\/error`,
      filename : `%DATE%.error.log`,
      maxFiles : 30, // 30일치 로그 파일 저장
      zippedArchive : true,
    }),
    new winstonDaily({
      level : 'debug',
      datePattern : 'YYYY-MM-DD',
      dirname: logDir+`\/degug`,
      filename : `%DATE%.degug.log`,
      maxFiles : 30, // 30일치 로그 파일 저장
      zippedArchive : true,
    }),
  ],
  exceptionHandlers : [ // uncaughtException 발생시
    new winstonDaily({
      level : 'error',
      datePattern : 'YYYY-MM-DD',
      dirname: logDir+`\/error`,
      filename : `%DATE%.error.log`,
      maxFiles : 30,
      zippedArchive : true,
    })
  ]
});

if(process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
      // format : winston.format.combine(
      //     winston.format.colorize(), // 색깔 넣어서 출력
      //     winston.format.simple(), // `${info.level}: ${info.message} JSON.stringfy({...rest})` 포멧으로
      // )
      format : consoleFormat
  }));
}

module.exports = logger;