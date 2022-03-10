const secretOrPrivateKey = require("./token_secret");
const jwt = require("jsonwebtoken");
/**
 * 
 * @param {token} token 
 * @returns 
 */
function verifyToken(token) {
  let isToken = false;
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {
      //时间失效的时候 || 伪造的token
    } else {
      isToken = true;
    }
  });
  return isToken;
}
/**
 * 
 * @param {token主信息} payload 
 * @param {过期时间} expiresIn 
 * @returns 
 */
function signToken(payload, expiresIn) {
  return jwt.sign(payload, secretOrPrivateKey, {
    expiresIn, // 1小时过期  以秒为单位
  });
}

module.exports = {
  verifyToken,
  signToken,
};
