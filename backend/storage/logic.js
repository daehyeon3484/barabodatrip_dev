class LocalStorage {
  constructor() {
    this.suffix = '_deadtime'
  }

  static canUse() {
    const TEST_KEY = generateTestKey()

    // 사용자가 쿠키를 차단 하는 경우 LocalStorage '접근' 시에 예외가 발생합니다.
    try {
      localStorage.setItem(TEST_KEY, "test")
      localStorage.removeItem(TEST_KEY)
      return true
    } catch {
      return false
    }
  }

  get(key) {
    if (!key) {
      return ""
    }
    return String(localStorage.getItem(key))
  }

  /**
   * @param key 스토리지 키값
   * @param value 스토리지에 저장될 값
   * @param expires 유효기간 (Optional) - 시간 단위
   */
  set(key, value, expires) {
    if (!(key && value)) {
      return
    }

    localStorage.setItem(key, value)

    if (expires) {
      this.set(
        `${key}_deadtime`,
        String(Date.parse(String(new Date())) + expires * 3600000)
      )
    }
  }

  getExpiration(key) {
    return this.get(key + this.suffix)
  }

  removeExpiration(key) {
    this.remove(key + this.suffix)
  }

  isExpired(key) {
    const expiration = Number(this.getExpiration(key) || 0)
    return expiration - Date.parse(String(new Date())) <= 2000
  }

  remove(key) {
    if (!key) {
      return
    }

    localStorage.removeItem(key)
  }
}

class SessionStorage {
  constructor() {
    this.suffix = '_deadtime'
  }

  static canUse() {
    const TEST_KEY = generateTestKey()

    // sessionStorage를 사용할 수 없는 경우
    try {
      sessionStorage.setItem(TEST_KEY, "test")
      sessionStorage.removeItem(TEST_KEY)
      return true
    } catch (err) {
      return false
    }
  }

  get(key) {
    return sessionStorage.getItem(key) || ""
  }

  /**
   * @param key 스토리지 키값
   * @param value 스토리지에 저장될 값
   * @param expires 유효기간 (Optional) - 시간 단위
   */
  set(key, value, expires) {
    if (!(key && value)) {
      return
    }

    sessionStorage.setItem(key, value)

    if (expires) {
      this.set(
        `${key}${this.suffix}`,
        String(Date.parse(String(new Date())) + expires * 3600000)
      )
    }
  }

  getExpiration(key) {
    return this.get(key + this.suffix)
  }

  removeExpiration(key) {
    this.remove(key + this.suffix)
  }

  isExpired(key) {
    const expiration = Number(this.getExpiration(key) || 0)
    return expiration - Date.parse(String(new Date())) <= 2000
  }

  remove(key) {
    if (!key) {
      return
    }

    sessionStorage.removeItem(key)
  }
}

class MemoStorage {
  constructor() {
    this.suffix = '_deadtime'
    this.storage = new Map()
  }

  get(key) {
    return this.storage.get(key) || ""
  }

  set(key, value) {
    this.storage.set(key, value)
  }

  getExpiration(key) {
    return this.get(key + this.suffix)
  }

  removeExpiration(key) {
    this.remove(key + this.suffix)
  }

  isExpired(key) {
    const expiration = Number(this.getExpiration(key) || 0)
    return expiration - Date.parse(String(new Date())) <= 2000
  }

  remove(key) {
    this.storage.delete(key)
  }
}

function generateTestKey() {
  return new Array(4)
    .fill(null)
    .map(() =>
      Math.random()
        .toString(36)
        .slice(2)
    )
    .join("")
}

module.exports = {LocalStorage, SessionStorage, MemoStorage}