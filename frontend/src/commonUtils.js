/*
1) 모든 파라미터의 key, value값을 각 프로그래밍 언어에서 지원하는 sorting 정렬하여 A 데이터를 생성합니다.
2) secretkey와 A 데이터를 “?”로 연결하여 B 데이터를 생성합니다.
3) B 데이터를 SHA-256 함수를 통해 Hashing 하여 C 데이터를 생성합니다.
4) C 데이터를 대문자로 변경하여 D 데이터를 생성합니다.
*/
const utils = require('./SHA256Utils.js');

module.exports = {
  $randomString : function() {
    const moment = require('moment');
    let toDateFormat = moment().format("YYYYMMDDHHmmSS");
    // let refno = toDateFormat.random().toString().substr(2, 10)
    let refno = "DDP"+toDateFormat+ Math.random().toString().substring(2, 10);
    return {
        refno
    }
  },
  $makeAllParam : function (obj,SECKEY) {
    // let ke1 = Object.keys(obj)
    // let key2 = Object.getOwnPropertyNames(obj)
    let dataStr = ""
    for (key in obj){
      // console.log(key+' : '+obj[key]);
      dataStr += key+"="+obj[key]+"&"
    }
    dataStr.substring(dataStr.length-1)
    // console.log("dataStr : ",dataStr)
    let sortData = dataStr.split('').sort().join("");
    // console.log("sortData : ",sortData);
    let beforStr =  SECKEY +"?"+sortData  ;
    // console.log("beforStr : ",beforStr);
    let afterStr = utils.SHA256(beforStr);
    // console.log("afterStr : ",afterStr);
    let upperCaseStr = afterStr.toUpperCase();
    // console.log("upperCaseStr : ",upperCaseStr);

    obj['fgkey'] = upperCaseStr
    return obj;
  },
  $base64(file) {
    return new Promise(resolve => {
        var a = new FileReader();
        a.onload = e => resolve(e.target.result);
        a.readAsDataURL(file);
    });
  },
  
  
}