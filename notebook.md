## TODO

1. packagej.son中的nodemon的devDependence是手写的，改成真实的。

## Tips

布局方式：
1. 传统的基于盒模型的布局。利用display,float,position。
2. w3c新提出的flex布局。这也是未来的方向

## Question
1. grid bootstrap中的栅格系统，面试常考
2. webContentLoaded和onLoad的区别，面试常考
## New Word
- side effect 副作用
- corresponding  adj. 相当的，相应的。
    `例句：Syntax error:Expected corresponding JSX closing tag for <p>`
- higher order component 高阶组件
## React
1. react中的两种副作用：
    - 无需清除的副作用。 发送http，记录log
    - 需要清除的副作用

2. useEffect() 在每次渲染视图都会被调用

useEffect()可以配置出，当某个变量改变时，调用useEffect(),这很像ES6的setter,getter

[更多的hook的源代码](https://usehooks.com/)