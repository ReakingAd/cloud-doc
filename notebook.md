# TODO

1. packagej.son中的nodemon的devDependence是手写的，改成真实的。

# Tips

**布局方式：**
1. 传统的基于盒模型的布局。利用display,float,position。
2. w3c新提出的flex布局。这也是未来的方向
3. promise的链式调用。
    >
        func1()
        .then(res => {
            return func2()
        })
        .then( res => {
            console.log(res)
        })

# Question
1. grid bootstrap中的栅格系统，面试常考
2. webContentLoaded和onLoad的区别，面试常考
# New Word
- side effect 副作用
- corresponding  adj. 相当的，相应的。
    `例句：Syntax error:Expected corresponding JSX closing tag for <p>`
- higher order component 高阶组件
- explicit adj. 明确的；清楚的；直率的；详述的
  implicit adj. 含蓄的；暗示的；盲从的
- resemble vt. 类似，像
  assemble vt. 集合，聚集；装配；收集
- UUID = universally unique identifier 通用唯一识别码
# React
1. react中的两种副作用：
    - 无需清除的副作用。 发送http，记录log
    - 需要清除的副作用

2. useEffect() 在每次渲染视图都会被调用。useEffect()写副作用时，如果有事件注册，一定要记得马上remove掉。不然会更新一次视图就注册一次。

3. 在每次渲染后，组件内的变量都会重新被定义，重新以初始值开始。useRef()提供了一种能力，可以在每次渲染之间都保持住变量的值，不会随每次重新渲染而重置。

useEffect()可以配置出，当某个变量改变时，调用useEffect(),这很像ES6的setter,getter

[更多的hook的源代码](https://usehooks.com/)

4. React的ref属性

    **如果使用 ref：**
    1. 创建一个Ref

        `this.textInput = React.createRef();` 

    2. 告诉React,我们想把`<input>` ref关联到构造器里面创建的 textInput上

        `<input type="text" ref={this.textInput} />`
    
    3. 于是就可以通过 current属性访问 DOM 节点了

        `this.textInput.current.focus();`

***疑问一：*** 每次组件刷新视图，整个组件函数内的代码都会重新执行一遍。包括useEffect();
        而数据又能变成页面用户操作的结果，是因为刷新视图用的数据是从hooks中勾过来的吗？
        使用class，setState那种编程方式，也会整个class内的代码都执行一遍吗？？

        组件函数内使用 let,var 定义的变量，在刷新视图时，会以初始值重新定义一次。但是使用 hooks
        定义的变量，就像在另一个空间定义的变量，当组件视图刷新时，组件会去另一个空间去把新赋的值勾回来，供组件使用。

# hooks

> Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数

> useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力
>   - 副作用：组件中执行数据获取、订阅、手动修改DOM.副作用分两类
        - 需要清除的副作用
        - 不需要清除的副作用
>   - 它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途
>   - 如果某个副作用，只需要在挂载的时候放上去，卸载的时候去掉，那么就可以把空数组`[]`
>     当做第二个参数传给`setEffect()`

1. **陷阱**：useState()返回的函数是异步的，因此使用set函数后，马上去获取值只能获取到旧的值。
    hooks这样做的目的是处于性能的考虑，尽量在所有状态改变后值重绘一次就解决问题。而不是改一次
    重绘一次。
2. 