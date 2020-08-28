//获取token 
const token=localStorage.getItem('token') || ''
$.ajaxSetup({
    header:{
        Authorization : 'APPCODE '+token
    },
    xhrFields:{
        withCredentials:true,
    },
    crossDomain:true
})

// $.ajaxSetup({
//     beforeSend(xhr){
//         // 判断本地时候存在 token
//         if(localStorage.getItem('userId')&&localStorage.getItem('token')){
//             xhr.setRequestHeader('Authorization','APPCODE '+localStorage.getItem('token'))
//         }
//     }
// })


export function fetchCar(userid){
    return $.get('http://localhost:3002/usercart',{userId:userid})
}

export function fetchGoods(size,page){
    return $.get('http://localhost:3002/goods',{page : page,size:size})
}

export function fetchLogin(username,pwd){
    return  $.post('http://localhost:3002/login',{username : username , pwd : pwd})
}

export function fetchRegister(username,pwd,email){
    return $.post('http://localhost:3002/register',{username:username,pwd:pwd,email:email})
}

export function fetchHasEmail(email){
    return $.post('http://localhost:3002/hasemail',{email : email})
}
// 这里需要 同步请求
export function fetchCount(){
    return $.ajax({
        url : 'http://localhost:3002/count',
        async :false
    })
}

export function fetchGoodInfo(goodsId){
    return $.get('http://localhost:3002/goodInfo',{goodsId:goodsId})
}

// 获取 推荐
export function fetchRelated(size){
    return $.get('http://localhost:3002/related',{size})
}

export function fetchHasGood(userId,goodsId){
    return $.post('http://localhost:3002/hasgood',{userId,goodsId})
}

export function fetchAddCart(userId,goodsId,num){
    return $.post('http://localhost:3002/addCart',{userId,goodsId,num})
}

export function fetchUserCart(userId){
    return $.ajax({
        method : 'get',
        url : 'http://localhost:3002/usercart',
        data : {userId},
        async :false
    })
}


export function fetchUpdateCar(userId,goodsId,num){
    return $.post('http://localhost:3002/updatecar',{userId,goodsId,num})
}


export function fetchDeleteCar(userId,goodsId){
    return $.post('http://localhost:3002/delectcar',{userId,goodsId});
}