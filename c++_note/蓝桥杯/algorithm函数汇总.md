# algorithm函数汇总

#### sort

**sort函数前两个参数传入起始迭代器和终止迭代器，区间左闭右开，第三个参数可选std::less<value_type>()表示升序，或者std::greater<value_type>()表示降序**

##### 高阶用法

###### 题目描述

现由n人，输入n分编号和成绩，录取1.5*m（向下取整）人，如果后面有人和第m名同分，可以多录，求录取多少人，并按序输出编号和成绩

###### 代码逻辑

对所有人的数据按照成绩优先，编号次等的排序方法排列即可。rank函数的下标表示排名，rank函数中存指针，通过指针找到成绩和编号

###### 代码实现

```C++
for(int i=1;i<=n;i++)
{
	rank[i] = i;  //初始化指针
	std::cin>>id[i]>>score[i];  //输入数据
}
std::sort(rank+1,rank+1+n,MyCmp); //传入MyCmp的是rank里面的值，也就是指针

bool MyCmp(int p1, int p2)
{
	if(score[p1]==score[p2])
		return id[p1]<id[p2];
	return score[p1]>score[p2];
}
```

#### bound

**传入的参数是起始迭代器和终止迭代器，区间左闭右开，第三个参数传入比较值。函数找不到指定结果时，返回终止迭代器。
lower_bound返回第一个大于等于比较值的迭代器，upper_bound返回第一个大于比较值的迭代器。**

###### 代码示例

```c++
int data[ ] = { 1,2,3,4,5,6 };	
auto it = std::lower_bound(data,data+6,3);
for(;it<data+6;it++)  //对于普通数组，返回的迭代器起始就是数据类型的指针
	std::cout<<(*it);
```

#### max_element

输入起始迭代器和终止迭代器，区间左闭右开，返回最大值的迭代器

#### next_permutation

输入起始迭代器和终止迭代器，区间左边右开，把对应的数组变成下一个字典序

##### 题目描述

$100$ 可以表示为带分数的形式：$100 = 3 + \frac{69258}{714}$。

还可以表示为：$100 = 82 + \frac{3546}{197}$。

注意特征：带分数中，数字 $1$ ~ $9$ 分别出现且只出现一次（不包含 $0$）。

类似这样的带分数，$100$ 有 $11$ 种表示法。

##### 输入格式

从标准输入读入一个正整数 $N(N<10^6)$。

##### 输出格式

程序输出数字 $N$ 用数码 $1$ ~ $9$ 不重复不遗漏地组成带分数表示的全部种数。

##### 解题思路

把1-9做全排列，然后打两个断点，第一个断点之前为x，第二个断点之后为z，中间为y，只要z整除y且x+y/z等于n，答案就加1

##### 代码实现

```c++
#include<iostream>
#include<algorithm>

int main()
{
	int n,x,y,z,ans=0,data[]={0,1,2,3,4,5,6,7,8,9};
	bool flag;
	std::cin>>n;	
	while(true)
	{
		x = 0; //每次循环都是一次新的排列，x重新清零
		for(int i=1;i<=7;i++)
		{
			x = x * 10 + data[i]; //第一个断点后移，x就累加
			y = 0;   //每次换i，都代表断点1的位置改变，y清零
			for(int j=i+1;j<=8;j++)
			{
				y = y * 10 + data[j];  //第二个断点后移，y就累加
				z = 0; //每次换j，都代表断点2的位置改变，z清理
				for(int k=j+1;k<=9;k++)  //到这里x和y都已经固定了，经历完第三层for求出z
					z = z * 10 + data[k];
				if(y%z==0 && x+y/z==n)
					ans++;
			}
		}
		std::next_permutation(data+1,data+10);
		flag = true;
		for(int i=1;i<=9;i++)
		{
			if(data[i]!=i)
			{
				flag = false;
				break;
			}
		}
		if(flag)
			break;
	}
	std::cout<<ans;
	return 0;
}
```

