# DocumentFragment

> 一个没有父对象的最小文档对象。它被作为一个轻量版的 Document 使用，就像标准的document一样，存储由节点（nodes）组成的文档结构。与document相比，最大的区别是DocumentFragment 不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染，且不会导致性能等问题。-摘自[MDN>WEB开发技术>WEB API 参考接口>DocumentFragment](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)  

如果需要批量向一个节点添加子节点，不应该直接在节点上调用`Element.appendChild()`，每次调用`Element.appendChild()`都会使浏览器重新渲染，会导致性能问题。  

更好的做法是将这些子节点添加到一个`DocumentFragment`节点上，然后使用`Element.appendChild(documentFragment)`将documentFragment上的节点一次性添加，这样只会进行一次渲染。


## 创建DocumentFragment

document.createDocumentFragment()


# this

## this与闭包

每个函数都会有两个自动生成的变量，this和argument。  
一般情况下（非箭头表达式），这两个参数的值在函数运行时确定。this的值又被称为“上下文环境(context)”
```javascript
let object = {
    identity: 'My Object',
    function getIdentityFunc{
        return function() {
            return this.identity;
        };
    }
};

console.log(object.getIdentityFunc()());
// 相当于(object.getIdentityFunc())()
//运行一步后，变为
//<匿名函数>()  //这时，当前上下文为window
//所以，这里会返回window.identity
```

对于这两个函数（getIdentityFunc、内部匿名函数），它们的this都是函数自动生成的，值在运行时才会确定。因此，内部的this并不会像闭包一样，捕获外部的this。  

### 通过闭包将this传给内部函数
```javascript
let object = {
    identity: 'My Object',
    function getIdentityFunc{
        let that = this;
        return function() {
            return that.identity;
        }
    }
}

console.log(object.getIdentityFunc()());// My Object
```

这一次，因为在外部的函数中添加了一句`let that = this`，在内部的匿名函数访问`that`时，内部函数就会捕获外部的`that`（闭包）。  

最终的调用仍然是`window.<匿名函数>()`，但这次that是通过闭包传递的，与上下文无关。

## 箭头函数与this

### 标准函中的this  
标准函数中（相对于箭头函数），this是方法调用的上下文对象。  

### 箭头函数中的this  
箭头函数中的this会保留<font color=#f12>定义该函数时</font>的上下文。

```javascript
function Queen() {
    this.royaltyName = 'Elizabeth';
    setTimeout(function(){console.log(this.royaltyName);}, 1000);
}

function King() {
    this.royaltyName = 'Henry';
    setTimeout(() => console.log(this.royaltyName), 1000);
}

new Queen()//undefined
new King()//Henry
```

标准函数（Queen中的匿名函数），在调用时的上下文是`window`，所以，`this === window`；  
箭头函数（King中的匿名函数），在调用时的上下文是`window`，但是，<font color=#f12>在定义时（定义这个箭头函数时，在栈顶的对象是`new`创建的`King`的实例），上下文为新创建的`King`实例，所以，该箭头函数的this是在**定义时确定的，而不是调用时确定的**</font>

### 关于调用上下文
当函数调用时，会将一个对象的引用压到栈中，作为函数调用的上下文。  

作为成员函数（方法），`object.func()`，`object`就是当前的上下文对象。  

普通函数（成员函数也可），可以通过`func.apply()`或者`func.call()`指定上下文。

箭头函数的this，并不是调用时确定的，而是在定义时确定的。

### 总结  
普通函数的this，取决于何时调用，this指向调用时的上下文；   

箭头函数的this，取决于何时定义，this指向定义时的上下文。


## canvas

void ctx.drawImage(image, dx, dy);
void ctx.drawImage(image, dx, dy, dWidth, dHeight);
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);