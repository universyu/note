# git



## commit

#### 规范

**Subject**

空行

`- diffenerce1`
`- diffenerce2` 

#### 规则

commit使用尾插法

## merge

开创虚拟结点捏合两条分支，`merge`发起方的头指针移动到虚拟结点，如果发起方被另一方继承，那么结果就是发起方来到和另一方同样的位置



撤回当下正在执行的merg：`git merge --abort`



## rebase

`rebase`发起方的会带着其相对于另一方的公共结点之后的内容一起复制到另一方的末尾，如果发起方被另一方继承，那么结果就是发起方来到和另一方同样的位置

加上`-i`指令可以打开UI界面，`git rebase HEAD~3`可以拿到包括当下的三个结点

## git checkout

可以更换分支，也可以通过哈希值更换到对应的commit

可以通过`git checkout main^`移动到main的父级commit

`~`加数字可以移动多次，`git checkout main~2`表示main的父级的父级

加上`-b`可以创建并切换到新分支



`git checkout `别名： `gco`



## git branch

创建分支

加上`-f`可以完成分支跳转commit的操作`git branch -f main `再加commit的哈希值，就可以让main跳到这个commit



## git reset

`git reset HEAD^`代表把当下指向的commit移动到父级，利用reset只是删掉本地的commit，如果之前的commit已经push了，可能会导致冲突



## git revert

`git revert HEAD`代表把当下的一次commit撤销，，通过开创一个新的commit，让状态回到和前一次一样



## git cherry-pick

`git cherry-pick`后面接commit的哈希值可以将commit复制过来，假设现在处于main分支，使用`git cherry-pick ...`就可以把对应的commit复制过来

## git tag

`git tag v0 c1`为c1这个commit记录打上标记v0



## git fetch

获取远端最新状态