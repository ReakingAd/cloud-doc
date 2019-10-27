
# TODO
0. ESLint  airbnb 代码风格。npm 安装。可以检查变量没使用等等情况。
    极客时间 22讲
1. visual DOM 的diff算法。复杂度 O(n) ,采用广度优先。
    - 本身tree的diff复杂度是O(n^3)
    - 极客时间lession6.有个在线的演示例子
    - key属性对性能的提升是非常大的
2. immutable.js

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
