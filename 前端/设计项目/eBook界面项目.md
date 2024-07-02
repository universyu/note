=eBook界面项目

## 设置背景，文本居中显示

![屏幕截图 2024-05-13 225825](D:\ALLNOTE\前端\设计项目\屏幕截图 2024-05-13 225825.png)

设置一个大容器包括文本和搜索框，然后对这个大容器设置背景

```html
<div class="background-container">
    <div class="search">
        <div class="arrow"></div>
        <div class="serf" >
            <h2 style="margin-bottom: 5px">Search Page</h2>
            <div class="ser">
                <form id="searchForm"  method="GET">
                    <input type="text" id="searchInput" name="query" placeholder="Enter your search term">
                    <button type="submit">Search</button>
                </form>
            </div>
        </div>
    </div>
<!-- 因为放上面会挤压search 直接放下面会导致图层问题，所以放下面且加上index -->
    <div class="content">
        ......
    </div>
    
</div>
```

```css
        .search{
            width: 500px;
            height: 150px;
            position: fixed;  /*脱离文本流，相对页面窗口定位*/
            bottom: 20px;
            right: 40px;
            z-index: 10;
        }
		.arrow{  /*做向左的三角箭头*/
            width: 0;
            height: 0;
            border-right: 18px solid #862121;
            border-top: 18px solid transparent;
            border-bottom: 18px solid transparent;
            position: absolute;
            right: 0;
            top: 50%;
            display: block;
        }
        .serf{
            height: 100px;
            width: 320px;
            margin: 36px 0 0 150px;
            border: #000000 solid 2px;
            box-sizing: border-box;
            padding-left: 50px;
            background-color: #cccccc;
            display: none;
        }
        .search:hover .arrow{
            border-right: 18px solid #ec5b0c;
        }

        body, html { /*必要步骤*/
            height: 100%;
            margin: 0;
            padding: 0;
        }
        html{  /*去掉页面的滑动条*/
            overflow: hidden;
        }
        .background-container {
            background-attachment: fixed; /*让背景图片相对页面窗口定位*/
            position: relative;
            height: 100%; 
            background-image: url('YuukaNoa.png'), url('OIP.jpg'); /* 左右图片的 URL */
            background-size: auto 100%, auto 100%; /* 设置两张背景图片的尺寸，宽度为原始宽度，高度为100% */
            background-position: left top, right top; /* 设置两张背景图片的位置 */
            background-repeat: no-repeat; /* 禁止背景图片重复 */
        }
        .content {
            overflow: scroll;  /*内容部分如果溢出，就为内容部分单独做滑动条*/
            position: absolute;
            top: 0;
            height: 100%;
            left: 50%; 
            transform: translateX(-50%); 
            width: 80%; /* 假设内容占据的宽度为整个页面的80% */
            text-align: center; /* 文字居中 */
            color: #191616; /* 文字颜色 */
            padding: 20px; /* 内边距 */
            background-color: rgba(224, 224, 224, 0.4); /* 背景色，透明度为50% */
        }
```

## 搜索内容转为url

```js
document.getElementById("searchForm").addEventListener("submit", function(event) {
        // 阻止默认的表单提交行为
        event.preventDefault();
        // 获取搜索框中的输入值
        var searchTerm = document.getElementById("searchInput").value;
        // 如果输入值不为空
        if (searchTerm.trim() !== "") {
            // 构建跳转 URL，并将搜索词作为参数传递
            var url = "?name=" + encodeURIComponent(searchTerm);

            // 跳转到新页面
            window.location.href = url;
        }
    });
```

## 确保在搜索框中输入时其显示，鼠标不悬停又隐藏

```js
document.getElementById("searchForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var searchTerm = document.getElementById("searchInput").value;
        if (searchTerm.trim() !== "") {
            $.get('/?name=' + encodeURIComponent(searchTerm), function(data) {
                $('.ok_content').html(data);
            });
        }
    });

    var searchElement = document.querySelector('.search');
    var serfDiv = document.querySelector(".serf");

    searchElement.addEventListener('mouseover', function() {
        serfDiv.style.right = '4%'; // 当鼠标进入时，设置 .serf 的 display 为 block
    });

    searchElement.addEventListener('mouseout', function() {
        // 检查 searchElement 或其内部的任何元素是否是活动元素
        if (!(searchElement.contains(document.activeElement))) {
            serfDiv.style.right = '-100%'; // 当鼠标离开且元素没有焦点时，设置 display 为 none
        }
    });

    document.addEventListener('click', function(event) {
        // 检查点击的元素是否是 searchElement 或其内部的任何元素
        if (!searchElement.contains(event.target)) {
            serfDiv.style.right = '-100%'; // 当点击的元素不是 searchElement 或其内部的任何元素时，设置 display 为 none
        }
    });
```



