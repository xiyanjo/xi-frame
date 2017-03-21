# xi-frame
learn about frame
### 基础框架
沙箱模式：防止变量和对象污染
工厂函数：防止new丢失导致错误
joe.prototype 可以被外部本身创建的实例访问，公共部分
应用joe函数本身的成员 为实例特有的属性
所以将init的原型置换为joe的原型
