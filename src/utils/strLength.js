// 判断字符占用字节
export const strLength = (str) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c>255) {
          len += 2;
      } else {
          len += 1;
      }
  }
  return len;
  }