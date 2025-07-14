
做分类如果 output 只是简单的数字比如 1、2、3 分别表示三个类别，那么这里就附带了一个不一定真实的距离差信息，所以使用 one-hot vector 来表示不同的分类。

## softmax

$$
\text{softmax}_i(\mathbf{z}) = \frac{e^{z_i}}{\sum_{j} e^{z_j}}
$$
对于二分类问题， softmax 等价与 sigmoid

## cross-entropy 

cross-entropy:(真实值 $\hat{y}$ )  $-\sum(\hat{y_{i}}\ln y^{'}_{i})$
minimizing cross-entropy = maximizing likelihood
