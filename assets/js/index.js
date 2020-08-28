import { fetchGoods } from "../../api/index.js";
import { getLocalCart, getUserCart, isLogin } from "../../util/index.js";

const custommenu_body = document.getElementById("custommenu_body");

// 获取热面数据
(() => {
  let fragment = document.createDocumentFragment();
  let child;
  let num = 0;
  const randomNum = Math.round(Math.random() * 5);
  fetchGoods(8, randomNum)
    .then((res) => JSON.parse(res))
    .then((data) => {
      while (
        (child = custommenu_body.getElementsByClassName("slick-track")[0]
          .firstElementChild)
      ) {
        // 根据后台 修改数据
        fragment.appendChild(child);
        child.querySelector(".thumb-inner img").src = data[num].goodsImg;
        child.querySelector(".thumb-group").remove();
        child.querySelector(".product_title a").innerText =
          data[num].oneLineTitle || "杯子";
        child.querySelector(".group-info .price del").innerText = (
          data[num].price * 1.2
        ).toFixed(2);
        child.querySelector(".group-info .price ins").innerText =
          data[num].price;
        child.querySelector("a").href =
          "商品详情.html?goodId=" + data[num].goodsId;
        num++;
      }
      custommenu_body
        .getElementsByClassName("slick-track")[0]
        .appendChild(fragment);
    });
})();

// tab  商品部分  tab-container
// 获取 三个 tab-body  的数据
const bestseller = document.getElementById("bestseller");
const new_arrivals = document.getElementById("new_arrivals");
const topRated = document.getElementById("top-rated");
// 分别给 各个元素的ul 里添加数据
(function (...node) {
  node.forEach((item, index) => {
    let str = "";
    const body = item.querySelector("ul");
    fetchGoods(8, index)
      .then((res) => JSON.parse(res))
      .then((data) => {
        data.forEach((v) => {
          str += `<li class="product-item col-lg-3 col-md-4 col-sm-6 col-xs-6 col-ts-12 style-1" data-goodId=${
            v.goodsId
          }>
                <div class="product-inner equal-element" style="height: 374px;">
                  <div class="product-top">
                    <div class="flash">
                      <span class="onnew">
                        <span class="text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                              新
                            </font></font></span>
                      </span>
                    </div>
                  </div>
                  <div class="product-thumb">
                    <div class="thumb-inner">
                      <a href="商品详情.html?goodId=${v.goodsId}">
                        <img src="${v.goodsImg}" alt="img">
                      </a>
                    </div>
                  </div>
                  <div class="product-info">
                    <h5 class="product-name product_title">
                      <a href="商品详情.html?goodId=${
                        v.goodsId
                      }"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${
            v.oneLineTitle || "杯子"
          }</font></font></a>
                    </h5>
                    <div class="group-info">
                      <div class="stars-rating">
                        <div class="star-rating">
                          <span class="star-3"></span>
                        </div>
                        <div class="count-star">
                          <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                              （${Math.ceil(Math.random() * 20) + 3}）
                            </font></font>
                        </div>
                      </div>
                      <div class="price">
                        <del><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                              $ ${(v.price * 1.2).toFixed(2)}
                            </font></font></del>
                        <ins><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                              $ ${v.price}
                            </font></font></ins>
                      </div>
                    </div>
                  </div>
                </div>
              </li>`;
        });
        body.innerHTML = str;
      });
  });
})(bestseller, new_arrivals, topRated);

// 给每个 li 标签添中的 详情 添加点击事件

//小型购物车

// 获取元素
//获取 count
const countSpan = document.querySelector(".header-control .count");
// 初始化 购物车数据
// const cartData = {};
if (isLogin()) {
  // 如果登录的话
  getUserCart(localStorage.getItem("userId")).then((res) => {
    if (res.status == 200) {
      if ($.isEmptyObject(res.data)) {
        //购物车为空
        document.getElementById("mCSB_1").innerHTML =
          "<h3>你的购物车为空 快去看看吧<h3>";
      } else {
        // 用户购物车 不为空
        renderCar(res.data);
      }
    }
  });
} else {
  //没有登录
  if ($.isEmptyObject(getLocalCart())) {
    console.log(getLocalCart());
    // 本地购物车 为空
    document.getElementById("mCSB_1").innerHTML =
      "<h3>你的购物车为空 快去看看吧<h3>";
    // 重置小计
    document.querySelector(".subtotal .Price-amount").innerText = "0";
  } else {
    //用户购物车不为空
    // Object.assign(cartData, getLocalCart());
    renderCar(getLocalCart());
  }
}

// 当结算按钮被点击时
document.querySelector(".content-wrap .button-checkout").onclick = function (
  e
) {
  e.preventDefault();
  layer.confirm(
    "是否进行结算",
    {
      btn: ["确定", "取消"], //按钮
    },
    function () {
      //确定结算
      layer.msg(
        "共花费" + document.querySelector(".subtotal .Price-amount").innerText
      );
      document.querySelector(".subtotal .Price-amount").innerText = "0";
      document.getElementById("mCSB_1").innerHTML =
        "<h3>你的购物车为空 快去看看吧<h3>";
      countSpan.innerText = 0;
    },
    function () {
      //取消
      return;
    }
  );
};

function renderCar(cartData) {
  //渲染数据
  let str = "";
  let sumPrice = 0;
  let sum = 0;
  cartData.forEach((item)=>{
    str += `<li class="product-cart mini_cart_item">
     <a href="#" class="product-media">
       <img src="${item.goodsImg}" alt="img" class="mCS_img_loaded">
     </a>
     <div class="product-details">
       <h5 class="product-name">
         <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${
          item.oneLineTitle || "椅子"
         }</font></font></a>
       </h5>
       <div class="variations">
         <span class="attribute_color">
           <a href="#"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">黑色</font></font></a> </span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
             ， </font><span class="attribute_size"><a href="#"><font style="vertical-align: inherit;">
                 300毫升</font></a></span></font><span class="attribute_size">
           <a href="#"><font style="vertical-align: inherit;"></font></a>
         </span>
       </div>
       <span class="product-price">
         <span class="price">
           <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">$ ${
            item.price
           }</font></font></span>
         </span>
       </span>
       <span class="product-quantity"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
             （x${item.num}）
           </font></font></span>
     </div>
   </li>`;
    sumPrice += item.price * item.num;
    sum += item.num-0;
  }) 
  document.getElementById("mCSB_1_container").innerHTML = str;
  document.querySelector(".subtotal .Price-amount").innerText = "$ " + sumPrice;
  countSpan.innerText = sum;
}
