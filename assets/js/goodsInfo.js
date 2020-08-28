import { fetchGoodInfo,fetchRelated,fetchHasGood,fetchAddCart } from '../../api/index.js';
import { isLogin,getLocalCart } from '../../util/index.js'
// 更改面包屑 导航

// // 加载页面的时候
// const layerLoadId=layer.open({
//     type :3,
//     offset : ['50%','960px'],
//     shade:[1,'#fff'],
// });
//获取 商品 id
const goodsId=location.search.slice(1).split('=')[1]-0 || 1;
// 获取面包屑
const breadcrumb=document.querySelector('.breadcrumbs .breadcrumb');

// 获取图片盒子
const detailImgBox=document.querySelector('.site-main .details-thumd');
// 获取 描述盒子
const detailInfoBox=document.querySelector('.site-main .details-infor')
// 商品数据 其他地方可能会用到
let goodsInfo=null;
fetchGoodInfo(goodsId).then(data=>{
    if(data.status==200){
        goodsInfo=data.data;
        (()=>{
            // 定义一个 随机分类
            const randomMenu=['家具','电器','装饰品','器具'];
            breadcrumb.innerHTML=`<li class="trail-item trail-begin">
                <a href="首页.html">首页</a>
            </li>
            <li class="trail-item">
              <a href="#">${randomMenu[Math.floor(Math.random()*randomMenu.length)]}</a>
            </li>
            <li class="trail-item trail-end active">
                  ${data.data.oneLineTitle}
            </li>`
        })(); 
        // // 修改图片
        const img=detailImgBox.querySelector('#img_zoom');
        img.style.width='530px';
        img.style.height='530px'
        img.src=data.data.goodsImg;
        img.setAttribute('data-zoom-image',data.data.goodsImg);
        const smallimgs=detailImgBox.querySelectorAll('#thumbnails a');
        smallimgs.forEach(small=>{
            small.setAttribute('data-image',data.data.goodsImg);
            small.setAttribute('data-large-image',data.data.goodsBigImg);
            small.setAttribute('data-zoom-image',data.data.goodsBigImg)
            small.firstElementChild.src=data.data.goodsImg;
            small.firstElementChild.setAttribute('data-large-image',data.data.goodsImg)
        })
    
        //更新视图 elevate-zoom
        window.onload=()=>{
            // console.log(document.querySelector('.zoomContainer .zoomWindowContainer div'));
            document.querySelector('.zoomContainer .zoomWindowContainer div').style.backgroundImage=`url(${data.data.goodsBigImg})`;
        }
        
    
        // 修改文字
        detailInfoBox.querySelector('.product-title').innerHTML=data.data.goodsTitle;
        // 修改星 数
        const star=detailInfoBox.querySelector('span.star-5');
        star.classList.remove('star-5');
        star.classList.add('star-'+(Math.round(Math.random()*3)+2));
        // 修改价格
        detailInfoBox.querySelector('.price span').innerHTML='$ '+data.data.price
        // 修改  数量
        detailInfoBox.querySelector('.count-star').innerHTML=`（ ${Math.round(Math.random()*56)+43} ）`;
        // 修改 商品描述
        document.getElementById('product-descriptions').innerHTML=`<p>${data.data.goodsDesc}<p>`
    }else{
        // 无商品
        location.href='404.html'
    }
});

// 给尺寸和颜色添加点击事件
(()=>{
    let outColor = detailInfoBox.querySelector('.list-color a.active');
    detailInfoBox.querySelector('.variations .list-color').addEventListener('click',e=>{
        e.preventDefault();
        const target=e.target || e.srcElement;
        if(target.nodeName.toLowerCase()=='a'){
            if(target==outColor) return;
            target.classList.add('active');
            outColor.classList.remove('active');
            outColor=target;
        }
    });
    let outSize=detailInfoBox.querySelector('.list-size a.active');
    detailInfoBox.querySelector('.variations .list-size').addEventListener('click',e=>{
        e.preventDefault();
        const target=e.target || e.srcElement;
        if(target.nodeName.toLowerCase()=='a'){
            if(target==outSize) return;
            target.classList.add('active');
            outSize.classList.remove('active');
            outSize=target;
        }
    })
})();


// 加入购物车
// 获取加入购物车的按钮
const addCarBtn=document.getElementById('addCart');
// 获取 修改数量的 盒子
const opationCar=document.getElementById('optionNum');
// 判断用户是否登录  如果登录 判读用户购物车是否有这商品
if(isLogin()){
    //登录了
    fetchHasGood(localStorage.getItem('userId')-0,goodsId).then(res=>{
        if(res.status==200){
            if(res.inCart){
                // 商品存在用户购物车中
                // 禁用按钮
                addCarBtn.disabled=true;
                //背景置灰
                addCarBtn.style.background='#AFAFAF';
                addCarBtn.innerHTML='此商品以存在购物车中'
                addCarBtn.onclick=null;
            }
        }
    })
}else{
    // 没有登录 从 本地获取数据
    if(getLocalCart().find(item=>item.goodsId==goodsId)){
        //本地商品存在
        // 禁用按钮
         addCarBtn.disabled=true;
         //背景置灰
         addCarBtn.style.background='#AFAFAF';
         addCarBtn.innerHTML='此商品以存在购物车中'
         addCarBtn.onclick=null;        
    }
}

(()=>{
    // 设置一个变量 来监听 请求是否完成
    let isFull=true;
    addCarBtn.onclick=()=>{
        if(goodsInfo==null) return;
        // 判断数据是否合法
        if(Object.is(parseInt(opationCar.value),NaN)){
            // 数据不合法
            layer.open({
                icon :5,
                title : '警告',
                content :'小猪 请检查你的商品数量是否合法'
            })
            return;
        }
        if(!isFull){
            // 请求还未完成  
            layer.open({
                icon : 5,
                title : '警告',
                content : '小主莫急, 正在使用吸奶的力气 去请求数据了'
            });
            return;
        }
        isFull=false;
        if(isLogin()){
            //登录的话  添加 商品 就添加到数据库中 并同步到 本地数据中
            fetchAddCart(localStorage.getItem('userId'),goodsId,parseInt(opationCar.value)).then(res=>{
                if(res.status==200){
                    // 添加购物车成功;
                    layer.open({
                        icon : 1,
                        title : '成功',
                        content : '添加购物车成功 要去看看吗',
                        btn:['哪..看看吧','不看'],
                        btn1 :()=>{
                            location.href='购物车.html'
                        },
                    });
                    // 同步 本地的备份

                    //禁用按钮
                    addCarBtn.disabled=true;
                    //背景置灰
                    addCarBtn.style.background='#AFAFAF';
                    addCarBtn.innerHTML='此商品以存在购物车中'
                    addCarBtn.onclick=null;
                    
                }else{
                    // 添加购物车失败
                    layer.open({
                        icon : 5,
                        title : '错误',
                        content : '服务器在开小差呢 小猪'
                    })
                    isFull=true;
                }
            })
        }else{
            // 如果没有登录
            // 存到本地
            // 加工 数据
            goodsInfo.num=opationCar.value;
            localStorage.setItem('localCar',$.base64.encode(JSON.stringify(getLocalCart().concat([goodsInfo]))))
                // 添加购物车成功;
                layer.open({
                    icon : 1,
                    title : '成功',
                    content : '添加购物车成功 要去看看吗',
                    btn:['哪..看看吧','不看'],
                    btn1 :()=>{
                        location.href='购物车.html'
                    },
                });

                //禁用按钮
                addCarBtn.disabled=true;
                //背景置灰
                addCarBtn.style.background='#AFAFAF';
                addCarBtn.innerHTML='此商品以存在购物车中'
                addCarBtn.onclick=null;
        }
    }
})();


//修改推荐


// 获取推荐 盒子
const relatedBox=document.getElementById('relatedBox');
(()=>{

    fetchRelated(10).then(data=>{
        if(data.status==200){
                let fragment = document.createDocumentFragment();
                const list=relatedBox.querySelector('.slick-track');
                let child;
                let num=0;
                while(child=list.firstElementChild){
                    Math.round(Math.random()*1)==1?child.querySelector('.product-top').innerHTML=`<div class="flash">
                                    <span class="onnew">
                                    <span class="text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                        新
                                    </font></font></span>
                                    </span>
                                    </div>`:child.querySelector('.product-top').innerHTML='';
                    child.querySelector('.thumb-inner img').src=data.data[num].goodsImg;
                    child.querySelector('.thumb-inner a').href='商品详情.html?goodsId='+data.data[num].goodsId;
                    child.querySelector('.thumb-group').remove();
                    child.querySelector('.product-info .product_title').innerHTML=data.data[num].oneLineTitle;
                    child.querySelector('.star-rating span').className='star-'+(Math.round(Math.random()*2)+3);
                    child.querySelector('.stars-rating .count-star').innerHTML=`（ ${Math.round(Math.random()*65)+45} ）`;
                    child.querySelector('.price del').innerHTML='$ '+(data.data[num].price*1.2).toFixed(1);
                    child.querySelector('.price ins').innerHTML='$ '+data.data[num].price
                    num++;
                    fragment.appendChild(child);
                }

                list.appendChild(fragment);
        }
    })


})();

// setTimeout(() => {
//     layer.close(layerLoadId)
// }, 3000);
