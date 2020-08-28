const tokens=[];

export function addToken(token){
    tokens.push(token)
    return tokens
}

export function removeToken(token){
    tokens.splice(tokens.indexOf(token),1);
    return tokens
}

export function hasToken(token){
    return tokens.findIndex(item=>token==item)
}


