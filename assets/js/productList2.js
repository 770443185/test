

import {fetchCount,fetchGoods} from '../../api/index.js'


let currentPage=0;
let size=12;
//获取 分页
let pages=null;
const navPage=document.querySelector('.pagination .nav-link');
//获取内容框
const goodsBox=document.querySelector('.site-main .product-grid');
// 初始化页数
(()=>{
    fetchCount().then(res=>{
        console.log(res);
        if(res.status==200){
            pages=Math.ceil(res.count/size);
            let str=`<a href="#" id='pagePrev' class="page-numbers"><i class="icon fa fa-angle-left" aria-hidden="true"></i></a>`;
            for(let i=1;i<=pages;i++){
                str+=`<a href="#" data-page='${i-1}'  class="page-numbers ${i==1?'current':''} pages-click">${i}</a>`
            }
            str+=`<a href="#" id='pageNext' class="page-numbers"><i class="icon fa fa-angle-right" aria-hidden="true"></i></a>`

            navPage.innerHTML=str;
        }
    })
})();


// 加载第一页的数据
(()=>{
    fetchGoods(size,currentPage).then(res=>JSON.parse(res))
    .then(data=>{
        goodsBox.innerHTML=renderGoods(data);

    })
})();
// 点击事件 点到那页 去哪页

// 清除 样式 的按钮
let outPage=document.querySelector('.nav-link a.current');
(()=>{
    navPage.addEventListener('click',e=>{
        e.preventDefault();
        const target=e.target || e.srcElement;
        // 当对应的页数被点击时
        if(target.classList.contains('pages-click')){
            if(target==outPage) return; //如果点击一样的
            target.classList.add('current');
            outPage.classList.remove('current');
            outPage=target;
            const currentPage=target.getAttribute('data-page')-0;
            fetchGoods(size,currentPage).then(res=>JSON.parse(res))
            .then(data=>{
                goodsBox.innerHTML=renderGoods(data)
            })

            //滚动条 到 商品的浏览的
            scrollTo(0,500)
        }else{
            // 上一页或者下一页被点击时
            switch(target.id||target.parentNode.id){
                case 'pagePrev' :
                    const PrevcurrentPageNum=outPage.getAttribute('data-page')-0;
                    // 到最后一页了
                    if(PrevcurrentPageNum<=0) return;
                    outPage.previousElementSibling.classList.add('current');
                    outPage.classList.remove('current');
                    outPage=outPage.previousElementSibling;
                    fetchGoods(size,PrevcurrentPageNum-1).then(res=>JSON.parse(res))
                    .then(data=>{
                        goodsBox.innerHTML=renderGoods(data)
                    })
                    //滚动条 到 商品的浏览的
                    scrollTo(0,500)
                ;break;
                case 'pageNext' : 
                    
                    let currentPageNum=outPage.getAttribute('data-page')-0; 
                    // 第一页了
                    console.log(currentPageNum);
                    if(currentPageNum>=pages-1) return;
                    outPage.nextElementSibling.classList.add('current');
                    outPage.classList.remove('current');
                    outPage=outPage.nextElementSibling;
                    fetchGoods(size,currentPageNum+1).then(res=>JSON.parse(res))
                    .then(data=>{
                        goodsBox.innerHTML=renderGoods(data)
                    });
                    //滚动条 到 商品的浏览的
                    scrollTo(0,500)
                ;break;
                default : return;
            }
        }

    })

})();



function renderGoods(json){
    let str=''
    json.forEach(v=>{
        str+=`<li data-goodsId=${v.goodsId} class="product-item product-type-variable col-lg-3 col-md-4 col-sm-6 col-xs-6 col-ts-12 style-1">
        <div class="product-inner equal-element" style="height: 374px;">
          <div class="product-top">
            ${Math.round(Math.random()*1)?`<div class="flash">
            <span class="onnew">
              <span class="text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                    新
                  </font></font></span>
            </span>
          </div>`:''}
          </div>
          <div class="product-thumb">
            <div class="thumb-inner">
              <a href="商品详情.html?goodsId=${v.goodsId}">
                <img src="${v.goodsImg}" alt="img">
              </a>
              
            </div>
          </div>
          <div class="product-info">
            <h5 class="product-name product_title">
              <a href="商品详情.html?goodsId=${v.goodsId}"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${v.oneLineTitle || '比特币'}</font></font></a>
            </h5>
            <div class="group-info">
              <div class="stars-rating">
                <div class="star-rating">
                  <span class="star-${Math.round(Math.random()*2)+3}"></span>
                </div>
                <div class="count-star">
                  <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      （${Math.round(Math.random()*42)+20}）
                    </font></font>
                </div>
              </div>
              <div class="price">
                <del><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      $ ${(v.price*1.2).toFixed(2)}
                    </font></font></del>
                <ins><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                      $ ${v.price}
                    </font></font></ins>
              </div>
            </div>
          </div>
        </div>
      </li>`
    })


    return str;
}


