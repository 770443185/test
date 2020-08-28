function observe(data) {
    if (typeof data != "object") return;
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
  
  function defineReactive(obj, prop, value) {
    if(typeof value=='object'){
      //如果子对象 还是 对象 递归
      observe(value)
    }
    let dep = new Dep();
    Object.defineProperty(obj, prop, {
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newVal) {
        if (value == newVal) return;
        value = newVal;
        dep.notify();
      },
    });
  }
  
  class Dep {
    constructor() {
      this.subs = [];
    }
  
    addSub(sub) {
      this.subs.push(sub);
    }
    notify() {
      this.subs.forEach(item=>item.updata());
    }
  }
  
  class Watch {
    constructor(node, key, data,price) {
      Dep.target = this;
      this.node = node;
      this.key = key;
      this.data = data;
      this.price=price||0;
      this.updata();
      Dep.target = null;
    }
  
    get() {
      return this.data[this.key];
    }
    updata() {
      let newVal = this.get();
      if(this.node.nodeName.toLowerCase()=='input'&&this.node.type=='text'){
        (this.node.value = newVal)
      }else if(this.node.nodeName.toLowerCase()=='input'&&this.node.type=='checkbox'){
        this.node.checked=newVal
      }else{
        (this.node.innerHTML = '$'+(newVal*this.price).toFixed(1));
      }
    }
  
  
  }
  
  // 根据  实际情况 修改 监听者
  
  