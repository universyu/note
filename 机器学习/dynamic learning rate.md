

下面的上标都表示迭代次数
## rms
第i个参数迭代过程:
$$

\theta^{1}=\theta^{0}-\frac{\eta}{\sigma^{0}}g^{0}
$$
这里$g^{0}=\sqrt{ (g^{0)^{2}} }$
$$
\theta^{2}=\theta^{1}-\frac{\eta}{\sigma^{1}}g^{1}
$$
这里$g^{1}=\sqrt{ \frac{1}{2}(g^{0})^{2}+\frac{1}{2}(g^{1})^{2} }$

## rmsp

用 hyperparamter 设置当下 gradient 的权重
$$
\sigma^{n}=\sqrt{ \alpha (\sigma^{n-1})^{2}+(1-\alpha)(g^{n})^{2} }
$$
## learning rate decay

不在考虑 $\eta$ 恒为常数，让其随着迭代次数的增加而减小，越接近终点 learning rate 越小