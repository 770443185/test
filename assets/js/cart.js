import { fetchUserCart,fetchUpdateCar,fetchDeleteCar } from '../../api/index.js';
import { isLogin,getLocalCart } from '../../util/index.js'


//获取盒子
const cartBox=document.querySelector('.page-main-content .shop_table tbody');
let cartData=[];
// 获取购物车数据
// 判断是否登录

if(isLogin()){
    // 登录了
    fetchUserCart(localStorage.getItem('userId')-0).then(res=>{
        if(res.status==200){
            // 获取成功
            console.log(res);
            cartData=res.data;
            //渲染页面
            renderCart(cartData)
        }else{
            // 获取失败
            layer.open({
                icon : 5,
                title : '错误',
                content : '服务器在开小差'
            })

            // 修改视图
        }
    })
}else{
    // 未登录
    // 从本地获取数据
    cartData=getLocalCart();
    console.log(cartData);
    renderCart(cartData)
}

// 加工数据
cartData.forEach(data=>{
    observe(data)
})
console.log(cartData);
// 添加监听者
(()=>{
    // 获取监听元素  每个 商品有两个监听对象
    if(cartData.length==0) return;
    cartData.forEach(item=>{
        // 监听 商品数量
        const numWatch=document.getElementById('cartNum-'+item.goodsId);
        new Watch(numWatch,'num',item);
        // 给 商品的数量 添加change事件
        numWatch.onchange=()=>{
            // 只需修改 数据就行
            // 先判断输入的数据是否合法
            //查找 监听的那条数据  这里使用了闭包  num 变量没有销毁
            // const numWatch=cartData.find(data=>)
            if(Object.is(parseInt(numWatch.value),NaN)){
                // 转换效果未 nan 
                numWatch.value=item.num;
                return;
            }
            // 可以转换
            item.num=parseInt(numWatch.value);
            if(isLogin()){
                // 跟新远程
                fetchUpdateCar(localStorage.getItem('userId'),item.goodsId,parseInt(item.num));
            }else{
                // 跟新本地
                localStorage.setItem('localCar',$.base64.encode(JSON.stringify(cartData)))
            }

            // 修改总价格
            document.getElementById('total_price').innerHTML='$ '+priceTotal(cartData);
        }
        // 监听商品 价格
        const priceWatch=document.getElementById('cartPrice-'+item.goodsId);
        new Watch(priceWatch,'num',item,item.price)
    })

})();

function renderCart(arr){
    // 渲染 cart 的方法
    // 一个 颜色数组
    const colors=['黑色','白色','蓝色','橘黄色','棕色'];
    const sizes=['XXL','XL','L','M','S']
    let str='';
    if(arr.length==0){
        // 没有数据
        str+=`<tr><td><div style='text-align:center; font-size:20px;height:'>你的购物车里还没有东西哦 <a style='color:#7F87AB' href='商品列表.html'>快去看看</a></div></td></tr>`
    }
    arr.forEach(v=>{
        str+=`<tr class="cart_item">
        <td class="product-remove">
          <a href="javascript:;" data-delete=${v.goodsId} class="remove"></a>
        </td>
        <td class="product-thumbnail">
          <a href="商品详情.html?goodsId=${v.goodsId}">
            <img src="${v.goodsImg}" alt="img" class="attachment-shop_thumbnail size-shop_thumbnail wp-post-image">
          </a>
        </td>
        <td class="product-name" data-title="Product">
          <a href="商品详情.html?goodsId=${v.goodsId}" class="title"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${v.goodsTitle}</font></font></a>
          <span class="attributes-select attributes-color">${colors[Math.floor(Math.random()*colors.length)]}，</span>
          <span class="attributes-select attributes-size"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${sizes[Math.floor(Math.random()*sizes.length)]}</font></font></span>
        </td>
        <td class="product-quantity" data-title="Quantity">
          <div class="quantity">
            <div class="control">
              <a class="btn-number qtyminus quantity-minus" href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">--</font></font></a>
              <input id='cartNum-${v.goodsId}' type="text" data-step="1" data-min="0" value="${v.num}" title="數量" class="input-qty qty" size="4">
              <a href="#" class="btn-number qtyplus quantity-plus"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">+</font></font></a>
            </div>
          </div>
        </td>
        <td class="product-price" data-title="Price">
          <span class="woocommerce-Price-amount amount">
            <span id='cartPrice-${v.goodsId}' class="woocommerce-Price-currencySymbol"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                  $ ${(v.price * v.num).toFixed(1)}
            </span>
        </td>
      </tr>`
    });
    str+=`<tr>
    <td class="actions">
      <div class="coupon">
        <label class="coupon_code"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">優惠卷號碼：</font></font></label>
        <input type="text" class="input-text" placeholder="促銷代碼在這裡">
        <a href="#" class="button"></a>
      </div>
      <div class="order-total">
        <span class="title"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
              總價：
            </font></font></span>
        <span id='total_price' class="total-price"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
              $ ${priceTotal(arr)}
            </font></font></span>
      </div>
    </td>
  </tr>`;

  cartBox.innerHTML=str;
}

// 计算总价格
function priceTotal(arr){
    let sum=0;
    arr.forEach(v=>{
        sum+=v.price * v.num;
    })
    return sum.toFixed(1);
}

//点击继续购物
document.querySelector('.control-cart .btn-continue-shopping').onclick=()=>{
    // 跳转之商品列表
    location.href='商品列表.html'
}

// 点击 结算
document.querySelector('.control-cart .btn-cart-to-checkout').onclick=()=>{
    if(cartData.length==0){
        layer.msg('你的购物车里还没有东西哦')
        return;
    }
    layer.confirm('确定结算吗',{
        btn: ['爽快结算','按错了'],
        btn1(){
            layer.msg('结算成功 共花费'+document.getElementById('total_price').innerHTML,{icon:1})
        },
    })
}

// 点击删除时 
cartBox.addEventListener('click',function(e){
    e.preventDefault();
    const target=e.target || e.srcElement;
    if(target.nodeName.toLowerCase()=='a'&&target.className=='remove'){
        // 删除对应的 数据
        //查找数据
        const deleteLayerId=layer.confirm('确定删除吗',{
            icon : 3,
            btn : ['好吧','点错了'],
            btn1(){
                const goodsId=target.getAttribute('data-delete')-0;
                // 判断是否登录 登录的话 
                if(isLogin()){
                    fetchDeleteCar(localStorage.getItem('userId')-0,goodsId).then(res=>{
                        if(res.status==200){
                            // 删除成功
                            layer.msg('删除成功');
                            // 点击 确定删除
                            target.parentNode.parentNode.remove();
                            cartData.splice(cartData.findIndex(item=>item.goodsId==goodsId),1);
                            document.getElementById('total_price').innerHTML=priceTotal(cartData)
                        }else{
                            layer.msg('删除失败')
                        }
                    })
                }else{
                    // 没有登录
                    layer.msg('删除成功');
                    // 点击 确定删除
                    target.parentNode.parentNode.remove();
                    cartData.splice(cartData.findIndex(item=>item.goodsId==goodsId),1); 
                    document.getElementById('total_price').innerHTML=priceTotal(cartData)                   
                    //更新本地 
                    localStorage.setItem('localCar',$.base64.encode(JSON.stringify(cartData)))
                }


                
            }
        })
    }
})
// 更新购物车 num



//跟新 本地或者 修改数据库的数据
