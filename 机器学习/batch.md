
把数据分为若干个 batch 每个 batch 运行一次 update model ，大的 batch size 可能会导致 optimation 问题。考虑 GPU 的并发运算，大 batch size 求 loss 的过程和小 size 接近，而小 size 需要做很多次 update 所以整个 epoch 更久。

每个 epoch 跑若干个 batch 用来更新参数，每个 epoch 只跑一次 dev 数据当作测试评分