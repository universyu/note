$$
sigmoid(b+wx)=\frac{1}{1+e^{-(b+wx)}}
$$

## Hard Sigmoid

把 s 型的 sigmoid 拉直，得到 hard sigmoid。

示意图：

```
                    _________
                   /
                  /
                 /
                /
               /
              /
             /
____________/
```

## ReLU（Rectified Linear Unit）

Hard sigmoid 进一步简化，就得到 ReLU：

$$
\text{ReLU}(x) = \max(0, x)
$$

小于 0 的部分直接截断为 0，大于 0 的部分保持线性。

示意图：

```
              /
             /
            /
           /
__________/
```

## 两个 ReLU 叠加 = Hard Sigmoid

用两个起点不同的 ReLU 相减，可以拼出一个 hard sigmoid：

$$
\text{hard sigmoid} = \text{ReLU}(b_1 + w_1 x) - \text{ReLU}(b_2 + w_2 x)
$$

两个 ReLU 的激活点（拐点）不同，第二个在更右边：

- **左边**：两个 ReLU 都还没激活，输出都是 0，叠加结果为 0（水平）
- **中间**：第一个 ReLU 已激活（斜向上），第二个还没激活，叠加结果斜向上
- **右边**：第二个 ReLU 也激活，斜率被减掉，叠加结果重新变平（水平）

示意图：

```
ReLU1:    ________/
ReLU2:              ________/

叠加:     ________/‾‾‾‾‾‾‾‾‾‾
```

正好是 hard sigmoid 的"左平—斜升—右平"形状。若干个这样的组合叠加，就可以近似任意折线函数，表达能力与 sigmoid 等价，但 ReLU 计算更简单、梯度不易消失，实践中更常用。

