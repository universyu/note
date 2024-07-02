# sstream库提取数据

#### 基本用法

##### 提取数字

```c++
#include<sstream>
#include<string>
int main()
{
    int num;
    std::string s;
    std::stringstream ss;
    std::cin>>s;
    ss<<s; //进ss
    ss>>num;  //出ss，以空格为间隔，如果s是 1  2 那么ss会将num赋值为1，如果再次调用，就会赋值为2
    return 0;
}
```

##### 忽略非法输入

```c++
#include<limits>
.....
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(),'\n'); //清空缓冲区
	while( !isdigit( ss.peak() ) )
        ss.ignore();  //去除非数字部分
```

##### 进制转换

```c++
.....
    ss<<std::hex<<s; //读十六进制数
	ss>>num;	//转为十进制赋值给num
```

#### 例题

##### 题目描述

每张票据有唯一的 ID 号，全年所有票据的 ID 号是连续的，但 ID 的开始数码是随机选定的。因为工作人员疏忽，在录入 ID 号的时候发生了一处错误，造成了某个 ID 断号，另外一个 ID 重号。

你的任务是通过编程，找出断号的 ID 和重号的 ID。

数据保证断号不可能发生在最大和最小号。

##### 输入格式

一个整数 $N(N<100)$ 表示后面数据行数，接着读入 $N$ 行数据，每行数据长度不等，是用空格分开的若干个（不大于 $100$ 个）正整数（不大于 $10^5$），每个整数代表一个 ID 号。

##### 输出格式

要求程序首先输入要求程序输出 $1$ 行，含两个整数 $m$，$n$，用空格分隔，其中，$m$ 表示断号 ID，$n$ 表示重号 ID。

##### 样例输入

```
2
5 6 8 11 9
10 12 9
```

##### 样例输出

```
7 9
```

##### 代码实现

```c++
#include<iostream>
#include<sstream>
#include<string>
#include<algorithm>

int main()
{
	int n,cnt=0,ans1,ans2,data[10000];
	std::string s;
	std::stringstream ss;
	std::cin>>n;
	std::cin.ignore(2,'\n');
	while(n--)
	{
		std::getline(std::cin,s);
		ss<<s;
		while(ss>>data[cnt])
			cnt++;
		ss.clear();  //记得要clear
	}
	std::sort(data,data+cnt);
	for(int i=0;i<cnt;i++)
	{
		if(data[i]==data[i+1])
			ans2 = data[i];
		if(data[i+1]-data[i]==2)
			ans1 = data[i] + 1;
	}
	std::cout<<ans1<<" "<<ans2;
	return 0;
}
```

