import { fetchGoods, fetchAddCart } from '../../api/index.js'
import {isLogin,getLocalCart} from '../../util/index.js'
import {fetchUserCart} from'../../api/index.js';
// document.addEventListener('DOMContentLoaded',function(){

// })


// 制作 懒加载
// 获取容器
const goodsBox=document.querySelector('.site-main .list-products');
// 记录当前页数  初始值为 0
let currentPage=0;

// 定义一页的数据
let size=12;

let cartData=[];
// 获取本地或者 数据库中的 购物车
(()=>{
  if(isLogin()){
    fetchUserCart(localStorage.getItem('userId')-0).then(res=>{
      // 远程的数据
      cartData=res.data;
    })
  }else{
    //未登录
    cartData=getLocalCart();
  }
})();
// 克隆一个 cartData
const cartDataCopy=cartData.slice(0);



//添加购物车



//载入页面的时候加载数据(12 条)   每次请求都返回 12条数据
fetchGoods(size,currentPage).then(res=>JSON.parse(res))
.then(data=>{
    // 判断商品是否在购物车上
    data=data.map(item=>{
      cartDataCopy.forEach(cartDataItem=>{
         if(cartDataItem.goodsId==item.goodsId){
           item.isOnCart=true;
         }
       })
       return item;
    })
    // 商品的html 字符串
    let productStr='';
    data.forEach(v=>{
        productStr+=`<li class="product-item style-list col-lg-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-ts-12">
        <div class="product-inner equal-element" style="height: 274px;">
          <div class="product-top">
            <div class="flash">
              <span class="onnew">
                <span class="text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      新
                    </font></font></span>
              </span>
            </div>
          </div>
          <div class="products-bottom-content">
            <div class="product-thumb">
              <div class="thumb-inner">
                <a href="商品详情.html?goodsId=${v.goodsId}">
                  <img src="${v.goodsImg}" alt="img">
                </a>
                
              </div>
            </div>
            <div class="product-info-left">
              <div class="yith-wcwl-add-to-wishlist">
                <div class="yith-wcwl-add-button">
                  <a href="#">Add to Wishlist</a>
                </div>
              </div>
              <h5 class="product-name product_title">
                <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${v.oneLineTitle || '比特币'}</font></font></a>
              </h5>
              <div class="stars-rating">
                <div class="star-rating">
                  <span class="star-${Math.round(Math.random()*2)+3}"></span>
                </div>
                <div class="count-star">
                  <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      （${Math.floor(Math.random()*100)+20}）
                    </font></font>
                </div>
              </div>
              <ul class="product-attributes">
                <li>
                  <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      材料：
                    </font></font>
                </li>
                <li>
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">塑料</font></font></a>
                </li>
                <li>
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                        伍迪</font></font></a>
                </li>
              </ul>
              <ul class="attributes-display">
                <li class="swatch-color">
                  <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      顏色：
                    </font></font>
                </li>
                <li class="swatch-color">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">黑色</font></font></a>
                </li>
                <li class="swatch-color">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">白色</font></font></a>
                </li>
                <li class="swatch-color">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">棕色</font></font></a>
                </li>
              </ul>
              <ul class="attributes-display">
                <li class="swatch-text-label">
                  <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      花盆尺寸：
                    </font></font>
                </li>
                <li class="swatch-text-label">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">XS</font></font></a>
                </li>
                <li class="swatch-text-label">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">小號</font></font></a>
                </li>
                <li class="swatch-text-label">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">中號</font></font></a>
                </li>
                <li class="swatch-text-label">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">大號</font></font></a>
                </li>
                <li class="swatch-text-label">
                  <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">加大碼</font></font></a>
                </li>
              </ul>
            </div>
            <div class="product-info-right">
              <div class="price">
                <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                    $ ${v.price}
                  </font></font>
              </div>
              <div class="product-list-message">
                <i class="icon fa fa-truck" aria-hidden="true"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                    英國免費送貨
                  </font></font>
              </div>
              <form class="cart">
                <div class="single_variation_wrap">
                  <div class="quantity">
                    <div class="control">
                      <a class="btn-number qtyminus quantity-minus" href="#">-</a>
                      <input type="text" data-step="1" data-min="0" value="1" title="Qty" class="input-qty qty" size="4">
                      <a href="#" class="btn-number qtyplus quantity-plus">+</a>
                    </div>
                  </div>
                  <button data-goodInfo='${JSON.stringify(v)}' ${v.isOnCart==true?'disabled style=background:#A0A0A0':''}  class="single_add_to_cart_button button">
                    ${v.isOnCart==true?'此商品已经在购物车中了':'添加到購物車'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </li>`
    })
    goodsBox.innerHTML=productStr
    currentPage++;
});


// 监听页面滚动事件  实现懒加载
(function(){
    // 定义一个变量 判断数据是否加载完毕 完毕为 true 获取中为false
    let loadData=true //初始值为 true
    // 定义一个变量 判读数据是否全部加载完毕  初始值为 false
    let isComplete=false;
    window.onscroll=function(e){
        // 当 滚动到数据的底部的时候  请求数据 重新渲染到 页面中
        // 如果数据还在加载中 滚动失效
        if(!loadData) return;
        // 如果 文档的高度 - 滚动条的高度时  > 大于某个固定值时 说明 数据快要翻到低了
        if(isComplete){
            //当数据 加载完毕
            return;
        }
        if(scrollY+innerHeight>=document.documentElement.offsetHeight-570){
            // 获取数据
            // 同时 给 loadData 重新赋值
            loadData=false;
            fetchGoods(size,currentPage).then(res=>JSON.parse(res))
            .then(data=>{
                // 判断数据的changdu
                if(data.length<size){
                    isComplete=true;
                }
                console.log(data);
                    // 判断商品是否在购物车上
                data=data.map(item=>{
                  cartDataCopy.forEach(cartDataItem=>{
                    if(cartDataItem.goodsId==item.goodsId){
                      item.isOnCart=true;
                    }
                  })
                  return item;
                })
                //往页面中添加数据
                //优化
                const fragments=document.createDocumentFragment();
                data.forEach(v=>{
                    let newli=document.createElement('li');
                    newli.className='product-item style-list col-lg-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-ts-12';
                    newli.innerHTML=`
                    <div class="product-inner equal-element" style="height: 274px;">
                      <div class="product-top">
                        <div class="flash">
                          <span class="onnew">
                            <span class="text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                  新
                                </font></font></span>
                          </span>
                        </div>
                      </div>
                      <div class="products-bottom-content">
                        <div class="product-thumb">
                          <div class="thumb-inner">
                            <a href="#">
                              <img src="${v.goodsImg}" alt="img">
                            </a>
                            
                          </div>
                        </div>
                        <div class="product-info-left">
                          <div class="yith-wcwl-add-to-wishlist">
                            <div class="yith-wcwl-add-button">
                              <a href="#">Add to Wishlist</a>
                            </div>
                          </div>
                          <h5 class="product-name product_title">
                            <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${v.oneLineTitle || '比特币'}</font></font></a>
                          </h5>
                          <div class="stars-rating">
                            <div class="star-rating">
                              <span class="star-3"></span>
                            </div>
                            <div class="count-star">
                              <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                  （${Math.floor(Math.random()*100)+20}）
                                </font></font>
                            </div>
                          </div>
                          <ul class="product-attributes">
                            <li>
                              <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                  材料：
                                </font></font>
                            </li>
                            <li>
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">塑料</font></font></a>
                            </li>
                            <li>
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                    伍迪</font></font></a>
                            </li>
                          </ul>
                          <ul class="attributes-display">
                            <li class="swatch-color">
                              <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                  顏色：
                                </font></font>
                            </li>
                            <li class="swatch-color">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">黑色</font></font></a>
                            </li>
                            <li class="swatch-color">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">白色</font></font></a>
                            </li>
                            <li class="swatch-color">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">棕色</font></font></a>
                            </li>
                          </ul>
                          <ul class="attributes-display">
                            <li class="swatch-text-label">
                              <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                  花盆尺寸：
                                </font></font>
                            </li>
                            <li class="swatch-text-label">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">XS</font></font></a>
                            </li>
                            <li class="swatch-text-label">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">小號</font></font></a>
                            </li>
                            <li class="swatch-text-label">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">中號</font></font></a>
                            </li>
                            <li class="swatch-text-label">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">大號</font></font></a>
                            </li>
                            <li class="swatch-text-label">
                              <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">加大碼</font></font></a>
                            </li>
                          </ul>
                        </div>
                        <div class="product-info-right">
                          <div class="price">
                            <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                $ ${v.price}
                              </font></font>
                          </div>
                          <div class="product-list-message">
                            <i class="icon fa fa-truck" aria-hidden="true"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                英國免費送貨
                              </font></font>
                          </div>
                          <form class="cart">
                            <div class="single_variation_wrap">
                              <div class="quantity">
                                <div class="control">
                                  <a class="btn-number qtyminus quantity-minus" href="#">-</a>
                                  <input type="text" data-step="1" data-min="0" value="1" title="Qty" class="input-qty qty" size="4">
                                  <a href="#" class="btn-number qtyplus quantity-plus">+</a>
                                </div>
                              </div>
                              <button data-goodInfo='${JSON.stringify(v)}' ${v.isOnCart==true?'disabled style=background:#A0A0A0':''}  class="single_add_to_cart_button button">
                                  ${v.isOnCart==true?'此商品已经在购物车中了':'添加到購物車'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    `
                  fragments.appendChild(newli)
                })

                goodsBox.appendChild(fragments);

                //添加完成 
                loadData=true;

                currentPage++;
            })

        }
    }
})();

// 添加购物车;
(()=>{
  goodsBox.onclick=e=>{
    e.preventDefault();
    const target = e.target || e.srcElement;
    if(target.nodeName.toLowerCase()=='button'&&target.className=='single_add_to_cart_button button'){
        const goodInfo=JSON.parse(target.getAttribute('data-goodInfo'));
        goodInfo.num=1;
        console.log(goodInfo);
        if(isLogin()){
          fetchAddCart(localStorage.getItem('userId'),goodInfo.goodsId,1).then(res=>{
            if(res.status==200){
              layer.msg('添加成功');
              target.disabled=true;
              target.style.background='#A0A0A0';
              target.innerHTML='此商品已经在购物车中了'
            }else{
              layer.open({
                icon : 5,
                title : '错误',
                content : '添加失败 请稍后重试',
              });
            }
          })
        }else{
          localStorage.setItem('localCar',$.base64.encode(JSON.stringify(cartData.concat(goodInfo))));
          target.disabled=true;
          target.style.background='#A0A0A0';
          target.innerHTML='此商品已经在购物车中了'
          layer.open({
            icon : 1,
            title :'成功',
            content : '购物车添加成功 要去看看吗',
            btn:['看看','继续购物'],
            btn1(){
              location.href='购物车.html'
            }
          })
        }
    }
  }


})();
