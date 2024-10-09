import { defineRule } from 'vee-validate'
import { commaizeNumber } from '@system/utils/primitive'

/**
 * @description vee-validate를 이용한 유효성 검사 (https://vee-validate.logaretm.com/v4/guide/global-validators/)
 *  <v-text-field/> 에 hide-details 있으면 error-message 출력X (hide-details="auto" 로 하거나 hide-details 제거)
 *  <v-text-field/> @keydown.enter="function" 이 있으면 해당 유효성이 적용X. @keydown.enter가 없어도 엔터를 누르면 유효성이 적용되어 submit.
 *  <Form>에 버튼이 여러 개일 경우 모든 버튼 타입 지정 필요. <button type="[submit | button | reset]">
 *  rules="" 자리에 해당하는 유효성 변수 이름. 여러 개일 경우 | 로 추가 (띄어쓰기X)
 * 
 * @example 
 * <Form id="formId" @submit="submitFunction">
 *  <Field 
 *    name='fieldName' 
 *    v-model="modelName" 
 *    v-slot='{ handleChange, errors }' 
 *    rules="required|onlyNumber|length:10|businessNumber">
 *    <v-text-field 
 *      v-model="modelName" 
 *      @update:modelValue='handleChange' 
 *      :error-messages='errors' /> 
 *  </Field>
 * </Form>
 * <button form="formId">submit button</button>
 * 
 * ```js
 * import { Field, Form } from 'vee-validate'
 * import '@system/utils/validation/rules' 
 *
 */

defineRule('required', value => {
  if (!value || !value.length) {
    return '필수 입력 사항입니다'
  }
  return true
})

defineRule('onlyNumber', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^[0-9]+$/
  if (!regex.test(value)) {
    return '숫자만 입력해 주세요'
  }
  return true
})

// rules="minLength:10" 
defineRule('minLength', (value, [limit]) => {
  if (!value || !value.length) {
    return true
  }
  if (value.length < limit) {
    return `최소 ${limit}자 입력해 주세요`
  }
  return true
})

// rules="maxLength:10" 
defineRule('maxLength', (value, [limit]) => {
  if (!value || !value.length) {
    return true
  }
  if (value.length > limit) {
    return `최대 ${limit}자 입력 가능합니다`
  }
  return true
})

// rules="length:10" 
defineRule('length', (value, [limit]) => {
  if (!value || !value.length) {
    return true
  }
  if (value.length != limit) {
    return `${limit}자 입력해 주세요`
  }
  return true
})

// rules="afterStartTime:@startTime"
// @startTime: 시작 시간 Field의 name
// type="time"인 경우 사용
defineRule('afterStartTime', (value, [otherValue]) => {
  if (!value || !value.length) {
    return true
  }

  const startTime = new Date(`2000-01-01T${value}`)
  const endTime = new Date(`2000-01-01T${otherValue}`)

  if (!(startTime > endTime)) {
    return `종료 시간(${value})은 시작 시간(${otherValue})보다 늦게 설정해 주세요.`
  }
  return true
})

// rules="afterStartDay:@startDay"
// @startDay: 시작일자 Field의 name
// 날짜 형식이 (YYYYMMDD)인 경우 사용
defineRule('afterStartDay', (value, [otherValue]) => {
  if (!value || !value.length) {
    return true
  }

  const startDay = parseDateString(value)
  const endDay = parseDateString(otherValue)

  if (!(startDay >= endDay)) {
    return `종료 일자(${value})를 시작 일자(${otherValue})보다 늦게 설정해 주세요.`
  }
  return true
})

function parseDateString(dateString) {
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  return new Date(`${year}-${month}-${day}`)
}

defineRule('businessNumber', value => {
  if (!value || !value.length) {
    return true
  }
  if (!validBusinessNumber(value)) {
    return '올바른 사업자 번호를 입력해 주세요'
  }
  return true
})

defineRule('companyName', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^[가-힣a-zA-Z0-9\s]+$/
  if (!regex.test(value)) {
    return '회사명을 확인해 주세요'
  }
  return true
})

defineRule('name', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^[가-힣a-zA-Z\s]+$/
  if (!regex.test(value)) {
    return '이름을 확인해 주세요'
  }
  return true
})

defineRule('mobileNumber', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
  if (!regex.test(value)) {
    return '휴대폰 번호를 확인해 주세요'
  }
  return true
})

defineRule('faxNumber', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^([0-9]{2,3})-?([0-9]{4})-?([0-9]{4})$/
  if (!regex.test(value)) {
    return '팩스번호를 확인해 주세요'
  }
  return true
})

defineRule('id', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^(?=.*[a-z])[a-z\d]{6,}$/
  if (!regex.test(value)) {
    return '아이디는 영문 소문자와 숫자로 6자 이상 입력해 주세요'
  }
  return true
})

defineRule('password', value => {
  if (!value || !value.length) {
    return true
  }
  const regex1 = /^[0-9a-z!@#$%-]+$/
  const regex2 = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%-])[a-z\d!@#$%-]{8,}$/
  const regex3 = /[a-z]/g
  if (!regex1.test(value)) {
    return '비밀번호는 영문(소), 숫자, 특수문자(!@#$%-)만 입력해 주세요'
  }
  if (!regex2.test(value)) {
    return '비밀번호는 영문(소), 숫자, 특수문자(!@#$%-)가 포함 8자 이상 되어야 합니다'
  }
  if (!continuousPwd(value, 4)) {
    return '비밀번호에 4자 이상 연속된 영문(소) 또는 숫자는 사용할 수 없습니다 (예시: abcd / 1234 / 1111)'
  }
  return true
})

//rules="confirmed:@password"
//@password는 비교대상 Field의 name
defineRule('passwordConfirm', (value, [target]) => {
  if (value === target) {
    return true
  }
  return '비밀번호가 일치하지 않습니다'
})

defineRule('companyTel', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^0[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}$/
  if (!regex.test(value)) {
    return '대표 전화 번호를 확인해 주세요'
  }
  return true
})

defineRule('email', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  if (!regex.test(value)) {
    return '이메일 형식으로 입력해 주세요'
  }
  return true
})

defineRule('birthday', value => {
  if (!value || !value.length) {
    return true
  }
  const regex = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/
  if (!regex.test(value)) {
    return '생년월일 8자리를 확인해 주세요'
  }
  return true
})

/**
 * @description 금액 입력시 comma 추가 (commaizeValue, decommaizeValue)
 * @example  
 * <v-text-field v-model="tempValue" @input="tempValue = commaizeValue(tempValue)" />
 * ```js decommaize 필요 (decommaizeValue(tempValue.value))
 * import { commaizeValue, decommaizeValue } from '@system/utils/validation/rules'
 * const tempValue = ref()
 * const value = ref()
 * function submitFunction() {
 * value.value = decommaizeValue(tempValue.value)
 * }
*/
export function commaizeValue(value) {
  value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
  return commaizeNumber(value)
}
export function decommaizeValue(value) {
  return value.replace(/,/g, '')
}

/**
 * @description 숫자만 입력 가능
 * @example  
 * <v-text-field v-model="modelName" @input="modelName = limitNumber(modelName)" />
 * 
 * ```js
 * import { limitNumber } from '@system/utils/validation/rules'
 * 
 */
export function limitNumber(value) {
  return value.replace(/[^0-9]/g, '')
}

//사업자 등록번호 검증
function validBusinessNumber(value) {
  const numberMap = value.replace(/-/gi, '').split('').map(function (d) {
    return parseInt(d, 10)
  })
  if (numberMap.length === 10) {
    const keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    let chk = 0
    keyArr.forEach(function (d, i) {
      chk += d * numberMap[i]
    })
    chk += parseInt((keyArr[8] * numberMap[8]) / 10, 10)
    return Math.floor(numberMap[9]) === ((10 - (chk % 10)) % 10)
  }
  return false
}

/* 연속된 문자 숫자 4자리(limit) 체크, 같은 문자 숫자 체크 */
function continuousPwd(str, limit) {
  let o, d, p, n = 0
  const l = limit == null ? 4 : limit
  const pattern = /[!@#$%-]/
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    if (pattern.test(String.fromCharCode(c))) {
      continue
    }
    if (i > 0 && (p = o - c) > -2 && p < 2 && (n = p == d ? n + 1 : 0) > l - 3) {
      return false
    }
    d = p, o = c
  }
  return true
}
