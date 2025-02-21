## 目的

将场景投影到标准正方体
$$
\begin{align}
[-1,1]^{3}
\end{align}
$$


## fov (filed of view)

假设在高方向的最小值是 b ，最大值是 t ，其中 t + b = 0 ， 那么 fov 就是相机分别引到 t 和 b 的射线的夹角

## aspect ratio

定义为 width / height


## 正交投影

观察空间是长方体，中心移动到原点，调整大小令每个轴的范围都在 `[-1,1]` ，直接忽略 `z` 坐标压扁即得二维视图，这样的投影方法没有 “近大远小” 的规律。
假设任意长方体上面 y 为t 下面 y 为 b 左面 x 为 l 右面 x 为 r 近面 z 为 n 远面 z 为 f  从 view 空间到正交投影空间的变换矩阵：先把中心移动到原点再做各轴的缩放

$$
\begin{bmatrix}
\displaystyle \frac{2}{r-l} & 0 & 0 & 0 \\
0 & \displaystyle \frac{2}{t-b} & 0 & 0 \\
0 & 0 &\displaystyle \frac{2}{n-f} & 0 \\
0 & 0 & 0 & 1 
\end{bmatrix} \begin{bmatrix}
1 & 0 & 0 & \displaystyle -\frac{r+l}{2} \\
0 & 1 & 0 & \displaystyle -\frac{t+b}{2} \\
0 & 0 & 1 & \displaystyle  -\frac{n+f}{2}  \\
0 & 0 & 0 & 1
\end{bmatrix}
$$




## 透视 TO 正交

观察空间是近面小，远面大的棱台。按照以下原则转为正交投影的观察空间：
- 近面的点不变
- 远面的点 z 不变，压缩成和近面一样的面
- 远面的中心点 (0,0,f) 不变

变换矩阵
$$
\begin{bmatrix}
n & 0 & 0 & 0 \\
0 & n & 0 & 0 \\
0 & 0 & n+f & -nf \\
0 & 0 & 1 & 0
\end{bmatrix}
$$

## 透视投影

view 空间 -> 透视 -> 正交 
$$
\begin{bmatrix}
\displaystyle \frac{2n}{r-l} & 0 & \displaystyle \frac{l+r}{l-r} & 0 \\
0 & \displaystyle \frac{2n}{t-b} & \displaystyle \frac{b+t}{b-t} & 0 \\
0 & 0 & \displaystyle \frac{n+f}{n-f} & \displaystyle \frac{2nf}{f-n} \\
0 & 0 & 1 & 0
\end{bmatrix}
$$
第四行的第三个数（w1）决定手性，如果取 1 就是左手系（z朝内），如果取 -1 就是右手系（z朝外） 因为第四行和点的齐次坐标（列向量）相乘得结果的最后一个数为结果点的 w2 ，如果 w1 取 -1 那么就会导致结果点的所有坐标取反

## NDC
投影空间转 NDC 就把各个齐次坐标前三项除以第四项