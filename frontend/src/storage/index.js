import { LocalStorage, SessionStorage, MemoStorage } from './logic'

/**
 * @description
 * 안전한 local storage accessor를 생성.
 * local storage를 사용할 수 없는 경우 inmemory storage를 생성
 *
 * @example
 * ```js
 * const localStorage = generateStorage()
 * localStorage.set('someKey', 'someValue')
 * localStorage.get('someKey') // 'someValue'
 * ```
 */
export function generateStorage() {
  if (LocalStorage.canUse()) {
    return new LocalStorage()
  }
  return new MemoStorage()
}

/**
 * @description
 * session storage accessor를 생성.
 * session storage를 사용할 수 없는 경우 inmemory storage를 생성
 *
 * @example
 * ```js
 * const sessionStorage = generateSessionStorage()
 * sessionStorage.set('someKey', 'someValue')
 * sessionStorage.get('someKey') // 'someValue'
 * ```
 */
export function generateSessionStorage() {
  if (SessionStorage.canUse()) {
    return new SessionStorage()
  }
  return new MemoStorage()
}

