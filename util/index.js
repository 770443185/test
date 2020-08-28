import { fetchCar } from '../api/index.js'
export function isLogin(){
    if(localStorage.getItem('token')&&localStorage.getItem('userId')){
        return true
    }else{
        return false;
    }
}


export function getUserCart(userId){
    if(localStorage.getItem('cart')&&$.isEmptyObject(JSON.parse(localStorage.getItem('cart')))){
        return Promise.resolve(localStorage.getItem('cart'));
    }else{
        return fetchCar(userId)
    }
}

export function getLocalCart(){
    if(!localStorage.getItem('localCar')){
        localStorage.setItem('localCar',$.base64.encode('[]'))
    }
    return JSON.parse($.base64.decode(localStorage.getItem('localCar')))
}