$$
sigmoid(b+wx)=\frac{1}{1+e^{-(b+wx)}}
$$
![[matplot_figure_1.png]]
拟合 hard sigmoid 
![[matplot_figure_0_.png]]
以 hard sigmoid 切分任意曲线

## relu

两条 relu 拟合一条 hard sigmoid
relu 用  c max(0,b+wx) 来表示