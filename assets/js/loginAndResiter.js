import { fetchLogin, fetchRegister, fetchHasEmail } from "../../api/index.js";
import Cookie from '../../util/cookie.js'
// 实现登录




// 获取 登录框

const userInput = document.getElementById("loginUser");
const pwdInput = document.getElementById("loginPwd");
// 获取登录按钮
//获取 记住密码 checkbox
const belive = document.getElementById("cb1");
// 进去页面时 判读 cookie中是否 具有 相应 cookie 
// 有的话填入表单中
if(Cookie.getCookie3('_user')&&Cookie.getCookie3('_pwd')){
    //填入到相应的位置
    console.log(Cookie.getCookie4('_user'),Cookie.getCookie4('_pwd'));
    userInput.value=Cookie.getCookie3('_user');
    pwdInput.value=Cookie.getCookie3('_pwd')
    belive.checked=true;
}



const loginBtn = document.querySelector(
  "form.login .form-row input.button-submit"
);


//登录按钮点击时

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  //请求后台  根据后台的数据 来 显示不同的结果
  // 判断 登录框 密码框是否为空
  if (userInput.value.trim() && pwdInput.value.trim()) {
    // 不为空
    fetchLogin(userInput.value, pwdInput.value).then((res) => {
      if (res.status == 200 && res.data.length != 0) {
        //登录成功
        // 设置token
        localStorage.setItem("token", res.token);
        // 设置userid
        localStorage.setItem('userid',res.userId)
        // 判断 记住我是否选中
        if(belive.checked){
            //选中
            //为选中 状态时 设置cookie   并加密 七天过期
            Cookie.setCookie('_user',userInput.value,60*24*7);
            Cookie.setCookie('_pwd',pwdInput.value,7*24*60);
        }else{
            Cookie.removeCookie('_user');
            Cookie.removeCookie('_pwd')
        }
        // 存userid
        localStorage.setItem('userId',res.data[0].userId)
        layer.open({
          icon : 1,
          title: "提示",
          content: "登录成功",
          btn:['跳转页面'],
          btn1:function(){
            location.href='http://127.0.0.1:5500/product2/首页.html'
        }
        });
      } else if (res.status == 404) {
        layer.open({
          icon: 5,
          title: "提示",
          content: "用户名或者密码错误",
        });
      }
    });
  } else {
    layer.open({
      icon: 5,
      title: "错误",
      content: "用户名或者密码为空( 不能使用空格 )",
    });
  }
});

// 实现注册
//获取元素
const registerEmail = document.getElementById("registerEmail");
const registerUser = document.getElementById("registerName");
const registerPwd = document.getElementById("registerPwd");

//同意条款
const registerOn = document.getElementById("cb2");

//邮箱正则
const emailReg = /^.{2,}\@.{2,6}\.(com|cn)$/;

// 一组条件是否成立的判断
const registerIsOn = {};
// 获取注册点击按钮
const registerBtn = document.querySelector("form.register input.button-submit");
// 邮箱失去焦点 判断格式是否正确
registerEmail.addEventListener("blur", function () {
  registerEmail.nextElementSibling.nextElementSibling.style.display ="none";
  if (registerEmail.value == "") return;
  if (!emailReg.test(registerEmail.value)) {
    // 验证不成功
    registerEmail.nextElementSibling.style.display = "block";
    registerBtn.disabled = "disabled";
    registerIsOn.email = false;
    console.log('失败');
  } else {
    // 验证成功
    registerEmail.nextElementSibling.style.display = "none";
    //验证成功  检测邮箱是否被注册
    fetchHasEmail(registerEmail.value).then((res) => {
      if (res.status !== 200) {
        //邮箱已经被使用
        registerIsOn.email = false;
        registerEmail.nextElementSibling.nextElementSibling.style.display =
          "block";
        // 邮箱被注册 按钮无效
        registerBtn.disabled = "disabled";
        registerIsOn.email = false;
      } else if (res.status == 200) {
        //邮箱可以使用
        registerIsOn.email = true;
        registerEmail.nextElementSibling.nextElementSibling.style.display =
          "none";
        registerBtn.disabled = false;
        registerIsOn.email = true;
      }

    });
  }
});

registerBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(33333);
  // 判断条件是否全部成立
  for (let value of Object.values(registerIsOn)) {
    // 其中有条件不成立
    if (value == false) {
      layer.open({
        icon: 5,
        title: "错误",
        content: "必要选项为空 或者 错误",
      });
      return;
    }
  }
  //条件成立
  // 用户名 密码为空 之间返回
  if (!registerUser.value.trim() && registerPwd.value.trim()) {
    layer.open({
      icon: 5,
      title: "错误",
      content: "必要选项为空 或者 错误",
    });
    return;
  }
  // 同意条款和条件
  if (!registerOn.checked) {
    layer.open({
      icon: 5,
      title: "错误",
      content: "必需同意条款",
    });
    return;
  }
  // 发送注册请求
  fetchRegister(
    registerUser.value,
    registerPwd.value,
    registerEmail.value
  ).then((res) => {
    if(res.status==200){
        //注册成功
        layer.open({
            icon :1,
            title : '成功',
            content : '注册成功 快登录吧'
        })
    }else{
        layer.open({
            icon : 5,
            title : '错误',
            content : '注册失败 请稍后重试'
        })
    }
  });
});
