// 存数据
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key,value)
}

// 取数据
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data || '')
  } catch (e) {
    return data || ''
  }
}

// 删数据
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}