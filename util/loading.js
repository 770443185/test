const layerLoadId=layer.open({
    type :3,
    offset : ['50%','960px'],
    shade:[1,'#fff'],
});




setTimeout(()=>{
    layer.close(layerLoadId)
},1000)