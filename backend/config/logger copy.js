const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file'); // 로그파일 일자별로 생성
const appRoot = require('app-root-path'); // app root 경로를 가져오는 lib
const process = require('process');
const dotenv = require("dotenv");
dotenv.config({path: './.server.env'});
// const logDir = `${process.env.VUE_APP_LOG_FILE_PATH}/logs`; //logs 디렉토리 하위에 로그파일저장
const logDir = `${appRoot}/logs`; //logs 디렉토리 하위에 로그파일저장
const util = require('util')
// npm install winston winston-daily-rotate-file app-root-path process
const {
    combine,
    timestamp,
    label,
    printf
} = winston.format;

const logFormat = printf(({
    level,
    message,
    label,
    timestamp
}) => {
    return `${timestamp} [${label}] ${level}: ${util.format('%o', message)}`; // log 출력 포멧정의
});

/**
 * log Level
 * error : 0, warn : 1, info : 2, http : 3, verbose : 4 . debug : 5, silly : 6
 */
const logger = winston.createLogger({
    format: combine( 
        label({
          label : 'LogSystem',
        }),
        timestamp({
          format : 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat // log 출력 포멧
    ),
    json: true,
    transports : [
        // info 레벨 로그를 저장할 파일 생성
        new winstonDaily({
            level : 'info',
            datePattern : 'YYYY-MM-DD',
            dirname: logDir,
            filename : `%DATE%.log`,
            maxFiles : 30, // 30일치 로그 파일 저장
            zippedArchive : true,
        }),
        // error 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level : 'error',
            datePattern : 'YYYY-MM-DD',
            dirname: logDir,
            filename : `%DATE%.error.log`,
            maxFiles : 30,
            zippedArchive : true,
        })
    ],
    exceptionHandlers : [ // uncaughtException 발생시
        new winstonDaily({
            level : 'error',
            datePattern : 'YYYY-MM-DD',
            dirname: logDir,
            filename : `%DATE%.error.log`,
            maxFiles : 30,
            zippedArchive : true,
        })
    ]
});

// Production 환경이 아닌 경우(dev등)
if(process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format : winston.format.combine(
            winston.format.colorize(), // 색깔 넣어서 출력
            winston.format.simple(), // `${info.level}: ${info.message} JSON.stringfy({...rest})` 포멧으로
        )
    }));
}

module.exports = logger;