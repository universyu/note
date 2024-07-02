# Leetcode算法

## 1、vector删除指定元素

```c++
vector.erase( remove_if(vecotr.begin(),vecotr.end(),[](int val){ return val==val_delete; }), vecotr.end() );
```

##### remove_if在algorithm头文件下，可以把符合比较函数的值都移动到数组的最后面，并返回第一个符合条件的值所处的迭代器

## 2、vector快慢指针去重

```c++
//下面的程序在一个单调不减的数组中把不重复的元素放到前面
int removeDuplicates(vector<int>& nums) 
{
    int slow = 0;  //慢指针指向未重复的元素
    for (int fast = 1; fast < nums.size(); fast++)  //fast扫描整个数组
    {
        if (nums[slow] != nums[fast])
        {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    	return slow + 1;  	//返回不重合的元素个数
}
```

## 3、投票法筛选多数元素

```c++
//下面的程序找出数组中超过半数的元素
int findMost(vector<int>& nums)
{
	int count=0,ans;
    for(int ver : nums)
    {
        if(count==0)  //票数为0的时候换候选
            ans = ver;
       	count += ( ans==ver ) ? 1 : -1;  //相同投一票，不同就反对票
    }
}
```

## 4、反转数组

##### reverse在algorithm头文件下，可以实现数组反转的功能

```c++
//下面将实现原地把数组循环右移动k位
void rotate(vector<int>& nums, int k)
{
	k %= nums.size();
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin()+k, nums.end());
}
```

## 5、哈希表和动态数组

##### unordered_map在unordered_map头文件下，其底层用哈希表实现，可以用O(1)的复杂度插入和删除元素

##### 利用随机函数srand和time需要导入cstdlib和ctime头文件

```c++
//下面将利用哈希表实现在O(1)的复杂度内插入和删除元素以及利用动态数组实现在O(1)的复杂度内随机取元素
class RandomizedSet
{
private:
	vector<int> nums;
	unordered_map<int, int> indices;
public:
	RandomizedSet()
	{
		srand((unsigned)time(NULL));
	}
	bool insert(int val)
	{
		if (indices.count(val))
			return false;
        //nums中加入val并在indices中建立索引对
		int index = nums.size();
		nums.push_back(val);
		indices[val] = index;
		return true;
	}
	bool remove(int val)
	{
		if (!indices.count(val))
			return false;
        //nums中通过和末位元素交换来删除val,indices中修改末位元素的索引，并删除val
		int index = indices[val];
		int last = nums.back();
		nums[index] = last;
		indices[last] = index;
		nums.pop_back();
		indices.erase(val);
		return true;
	}
	int getRandom()
	{
		return nums[rand() % nums.size()];
	}
};
```

## 6、前缀积与后缀积

```c++
//下面的类可以实现求出数组中每个元素的ans值，其中ans值除了自身以外所有数的乘积
class Solution 
{
public:
	vector<int> productExceptSelf(vector<int>& nums) 
    {
		vector<int> answer(nums.size(),1);
		for(int i=1;i<nums.size();i++) //前缀积
			answer[i] = answer[i-1] * nums[i-1];
        //只需要一个数字就可以存下后缀积的信息
		int R = 1;
		for (int i = nums.size() - 1; i >= 0; i--)
		{
			answer[i] *= R;
			R *= nums[i];
		}
		return answer;
	}
};
```

## 7、在线处理

```c++
//每个站有一份油gas[i]，走向下一个站走需要cost[i]，保证解唯一，求起点
class Solution
{
public:

	int canCompleteCircuit(vector<int>& gas, vector<int>& cost)
	{
		int begin = 0, sum = 0, tot = 0;
		for (int i = 0; i < gas.size(); i++)
		{
			sum += gas[i] - cost[i];
			tot += gas[i] - cost[i];
			if (sum < 0)
			{
				sum = 0;
				begin = i + 1;
			}
		}
		if (tot>=0)
			return begin;
		return -1;
	}
};
```

## 8、单调栈

```c++
//数组代表高度，求出下雨后的积水
class Solution 
{
public:
	int trap(vector<int>& height) 
	{
		int ans = 0;
		stack<int> s; //单减栈，保证前面进栈的比后面的高
        //注意：栈内的是数组的下标不是高度
		for (int i = 0; i < height.size(); i++)
		{
			while(s.size()>=2 && height[s.top()] < height[i])  //遇到比栈顶高的就可以积水了 
			{
				int tmp = s.top();
				s.pop();
				ans += ( min( height[i], height[s.top()] ) - height[tmp] ) * (i - s.top() - 1);
			}
			if (!s.empty() && height[s.top()] <= height[i])  //为了代码一致性（最后必定push）这里就算相等也pop
				s.pop();
			s.push(i);  
		}
		return ans;
	}
};
```

