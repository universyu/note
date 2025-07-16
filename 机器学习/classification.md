
做分类如果 output 只是简单的数字比如 1、2、3 分别表示三个类别，那么这里就附带了一个不一定真实的距离差信息，所以使用 one-hot vector 来表示不同的分类。

## softmax

$$
\text{softmax}_i(\mathbf{y}) = \frac{e^{y_i}}{\sum_{j} e^{y_j}}
$$
把网络输出的 y 带入 softmax 得到最后的预测值 $y^{'}$
对于二分类问题， softmax 等价与 sigmoid

## cross-entropy 

cross-entropy:(真实值 $\hat{y}$ )  $-\sum(\hat{y_{i}}\ln y^{'}_{i})$
minimizing cross-entropy = maximizing likelihood
pytorch 中的 cross-entropy 内置绑定了 softmax 