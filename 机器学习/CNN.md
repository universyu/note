
把数据拆分成 receptive field 分别用不同组别的 neuron 守卫，对同一个 pattern 共享参数的网络称做 convolutional layer network。适用于 pattern 出现在局部而且可能重复出现的训练问题。

## 拆分 pattern 

对于庞大的 tensor 各个 receptive field 只看其中一部分，尝试寻找 pattern 

## 共享参数

守卫不同 receptive field 的 neuron 可以针对同一个 pattern 共享参数

## Feature Map

若干个指定大小的 filter（`3*3*channel`） 以 stride 为速度运动，每次运动得到一个乘积和，运动停止得到一张 Feature Map。这里以 stride 为速度运动最终扫遍整个图像的过程就是共享参数。filter 的数量对应 map 的数量，也是下一层输入的 channel 数量，由于 Feature Map 层层向下传递，同样 size 的 filter 在不同层观测到原始图像上的数据范围会越来越大。

## Pooling

通过选分组代表的方式缩小数据，保持 channel 不变，在尺度上分块，每个分块出一个代表值。