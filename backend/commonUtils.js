/*
1) 모든 파라미터의 key, value값을 각 프로그래밍 언어에서 지원하는 sorting 정렬하여 A 데이터를 생성합니다.
2) secretkey와 A 데이터를 “?”로 연결하여 B 데이터를 생성합니다.
3) B 데이터를 SHA-256 함수를 통해 Hashing 하여 C 데이터를 생성합니다.
4) C 데이터를 대문자로 변경하여 D 데이터를 생성합니다.
*/
const utils = require('./SHA256Utils.js');
const MobileDetect = require('mobile-detect');
const crypto = require('crypto');
module.exports = {
  $randomString : function() {
    const moment = require('moment');
    let toDateFormat = moment().format("YYYYMMDDHHmmss");
    let noParam = Math.floor(Math.random() * 999)
    let refno = "TRIP"+toDateFormat+ noParam
    return refno
  },
  $randomString1 : function() {
    const moment = require('moment');
    let toDateFormat = moment().format("YYYYMMDDHHmmss");
    let noParam = Math.floor(Math.random() * 999)
    let refno = "MEM"+toDateFormat+ noParam
    return refno
  },
  $randomFile : function() {
    const moment = require('moment');
    let toDateFormat = moment().format("YYYYMMDDHHmmss");
    let noParam = Math.floor(Math.random() * 999)
    
    let fileStr = toDateFormat+ noParam
    console.log("fileStr  :",fileStr);
    return fileStr
  },
  $dateFormat (type) {
    const moment = require('moment');
    if(type=='todate'){
      this.strDate = moment().format("YYYYMM");
    } else if(type == 'ymddate') {
      this.strDate = moment().format("YYYYMMDD");
    } else if(type=='filedate'){
      this.strDate = moment().format("YYYYMMDDHHmmss");
    } else if(type =='ymd') {
      this.strDate = moment().format("YYYY-MM-DD");
    } else {
      this.strDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    return this.strDate;
  },

  $resultParam : function (obj) {
    let keys = []
    keys = [
      "ver",
      "mid",
      "refno",
      "reqcur",
      "reqamt",
      "vat",
      "product",
      "transid",
      "servicetype",
      "rescode",
      "resmsg",
      "resdt",
      "transdt",
      "fgkey",
    ]
    // let objStr = ""
    // let paramMap = new Map()
    // let data = ""
    objSplit = obj.split('&')
    let keyStr=[]
    let valueArray=[]
    let result = {}
    for(let k of keys) {
      for(let i = 0; i < objSplit.length; i++) {
        let objJoin = objSplit[i].split('').join("")
        let key = objJoin.substring(0,objJoin.lastIndexOf('='))
        let value = objJoin.substring(objJoin.lastIndexOf('=')+1)
        if(key == k) {
          valueArray.push(value)
        }
      }
    }
    result = {
      ver : valueArray[0],
      mid : valueArray[1],
      refno : valueArray[2],
      reqcur : valueArray[3],
      reqamt : valueArray[4],
      vat : valueArray[5],
      product : valueArray[6],
      transid : valueArray[7],
      servicetype : valueArray[8],
      rescode : valueArray[9],
      resmsg : valueArray[10],
      resdt : valueArray[11],
      transdt : valueArray[12],
      fgkey : valueArray[13],
    }
    
    // result = {
    //   ver : valueArray[0],
    //   mid : valueArray[1],
    //   refno : valueArray[2],
    //   reqcur : valueArray[3],
    //   reqamt : valueArray[4],
    //   vat : valueArray[5],
    //   buyername : valueArray[6],
    //   tel : valueArray[7],
    //   email : valueArray[8].replace('%40','@'),
    //   product : valueArray[9],
    //   transid : valueArray[10],
    //   servicetype : valueArray[11],
    //   rescode : valueArray[12],
    //   resmsg : valueArray[13],
    //   resdt : valueArray[14],
    //   transdt : valueArray[15],
    //   fgkey : valueArray[16],
    //   orgtradeno : valueArray[17],
    //   orgamt : valueArray[18],
    //   orgrate : valueArray[19],
    // }
    return result
  },
  $resultUnionParam : function (obj) {
    const keys1 = [
      "service_code",
      "mid",
      "command",
      "detail_response_code",
      "detail_response_message",
    ]
    objSplit = obj.split('&')
    let keyStr=[]
    let valueArray=[]
    let result = {}
    for(let k of keys1) {
      for(let i = 0; i < objSplit.length; i++) {
        let objJoin = objSplit[i].split('').join("")
        let key = objJoin.substring(0,objJoin.lastIndexOf('='))
        let value = objJoin.substring(objJoin.lastIndexOf('=')+1)
        if(key == k) {
          valueArray.push(value)
        }
      }
    }
    result = {
      service_code :  valueArray[0],
      mid :  valueArray[1],
      command :  valueArray[2],
      detail_response_code :  valueArray[3],
      detail_response_message :  valueArray[4],
      
    }
    return result
  },
  $makeAllParam : function (obj ,SECKEY) {
    let dataStr = ""
    Object.keys(obj).forEach(key => {
      dataStr += key+"="+obj[key]+"&"
    });
    let dataStr1 = dataStr.substring(0, dataStr.length-1)
    let sortData = dataStr1.split('').sort().join("");
    let beforStr =  SECKEY +"?"+sortData  ;
    let afterStr = utils.SHA256(beforStr);
    let upperCaseStr = afterStr.toUpperCase();
    return upperCaseStr;
  },
  $base64(file) {
    return new Promise(resolve => {
        var a = new FileReader();
        a.onload = e => resolve(e.target.result);
        a.readAsDataURL(file);
    });
  },
  $MobileDetect (headerType) {
    let md = new MobileDetect(headerType);
    let isMobile = false
    if (md.is("iPhone")) {     // 아이폰일 경우에 
      isMobile = true
    }
    else if(md.is("Android")) {     // 아이폰일 경우에 
      isMobile = true
    }
    else if(md.is("iPad")) {     // 아이폰일 경우에 
      isMobile = true
    }
    else if(md.is("iPod")) {     // 아이폰일 경우에 
      isMobile = true
    } else {
      isMobile = false
    }
    return isMobile
  },
  $encrypt : function(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
  },
  $decrypt : function(encryptedData, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    
    return decrypted;
  },
  $getSHA1(token, timestamp, nonce, encrypt) {
    try {
      const array = [token, timestamp, nonce, encrypt];
      array.sort();
      const str = array.join('');
      const sha1 = crypto.createHash('sha1');
      sha1.update(str);
      return sha1.digest('hex');
    } catch (error) {
      throw new Error('ComputeSignatureError');
    }
  },
  
  







  // $get : function(key) {
  //   return sessionstorage.getItem(key) || ""
  // },
  // /**
  //  * @param key 스토리지 키값
  //  * @param value 스토리지에 저장될 값
  //  * @param expires 유효기간 (Optional) - 시간 단위
  //  */
  // $set : function(key, value, expires) {
  //   if (!(key && value)) {
  //     return
  //   }
  //   sessionstorage.setItem(key, value)

  //   if (expires) {
  //     this.set(
  //       `${key}${this.suffix}`,
  //       String(Date.parse(String(new Date())) + expires * 3600000)
  //     )
  //   }
  // },
  // $remove : function(key) {
  //   if (!key) {
  //     return
  //   }
  //   sessionstorage.removeItem(key)
  // }
  
  
}