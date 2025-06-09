# DNS

### 域名解析流程

首先将域名`www.amazon.com`给根服务器，拿到顶级域名`com`的顶级域（TLD）服务器的IP，和`TLD`服务器联系拿到`amazon.com`的权威服务器IP，与权威服务器联系，拿到`www.amazon.com`的IP。本地DNS服务器则是额外的一层，类似于代理

**示例：cse.nyu.edu想要gaia.cs.umass.edu的IP，而前者的本地DNS服务器为dns.nyu.edu，后者的权威DNS服务器为dns.umass.edu**

![[note/前端/计算机网络/src/1.png]]


### 缓存

如果某个DNS服务器缓存了主机名/IP地址对，那么即便它不是权威服务器，也可以直接返回IP地址，减少解析时间



### DNS记录

四元组形式

(Name, Value, Type, TTL)  TTL表示该记录的生存时间，决定它什么时候被删除

- Type: A ， Name表示主机名， Value表示IP
- Type: NS ,  Name表示一个域(如：foo.com),  Value表示可以获取改域中主机的IP的权威DNS服务器的主机名
- Type: CNAME ， Value是别名为Name的主机名
- Type: MX ,  Value是别名为Name的邮件服务器的主机名



