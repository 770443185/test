export default class Cookie {
  static getCookie(name) {
    const cookie = document.cookie;
    const startIndex = cookie.indexOf(name);
    if (startIndex < 0) return null;
    const endIndex =
      cookie.indexOf(";", startIndex) == -1
        ? cookie.length
        : cookie.indexOf(";", startIndex);
    return cookie.substring(startIndex, endIndex).split("=")[1];
  }
  static getCookie2(name) {
    const cookieObj = document.cookie.split("; ").reduce((totalObj, item) => {
      let a = item.split("=");
      totalObj[a[0]] = a[1];
      return totalObj;
    }, {});
    return cookieObj[name];
  }
  static getCookie3(name) {
    const cookieArr = document.cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
      let a = cookieArr[i].split("=");
      if (name == a[0]) return a[1];
    }
    return null;
  }
  static getCookie4(name) {
    const cookieMap = new Map(
      document.cookie
        .split("; ")
        .map((item) => [item.split("=")[0], item.split("=")[1]])
    );
    return cookieMap.get(name)
  }
  //    过期时间的单位是 分钟
  static setCookie(name,val,exp=0){
      if(exp!=0){
          const d=new Date;
          d.setTime(d.getTime()+exp*60*1000);
          exp=d.toGMTString();
      }
      return document.cookie=`${name}=${val};expires=${exp};path=/;`;
  }
  static removeCookie(name){
    return Cookie.setCookie(name,'',-1);
  }
  static clear(){
    document.cookie.split('; ').forEach(item=>{
        let a=item.split('=');
        Cookie.removeCookie(a[0])
    })
  }
}
