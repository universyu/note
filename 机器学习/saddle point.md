
## 本征值

$$
Hv = \lambda v 对 v 有非零解，则 \lambda为本征值
$$
等效运算：
$$
|H-\lambda I|=0
$$


## critical point

gradient = 0 处可能是 saddle point 或者 minimum 或者 maximum，假设 gradient 向量为 g ， hessian 矩阵为 H ， 可以得出 loss 曲线局部近似

$$
L(\theta) = L(\theta^{'})+(\theta-\theta^{'})^{T}g +\frac{1}{2}(\theta-\theta^{'})^{T}H(\theta-\theta^{'})
$$
当 g = 0 时整体趋势由 H 决定，本征值有正就有 loss 增的方向，有负就有 loss 减的方向。如果是 saddle point，只需要找到负本征值对应的向量u，即可带入本征值定义得到
$$
\frac{1}{2}\lambda ||u||^{2}<0
$$
即令 $\theta = \theta^{'}+u$

