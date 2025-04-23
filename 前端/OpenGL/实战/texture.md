
## 纹理读取

```cpp
    unsigned int texture;
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);	
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    int width, height, nrChannels;
    unsigned char* data = stbi_load("./assets/wall.jpg", &width, &height, &nrChannels, 0);
    if (data) {
    // 把数据应用到已绑定的 texture 上
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
    // 为已绑定的 texture 做 mipmap
        glGenerateMipmap(GL_TEXTURE_2D);
    }
    else {
        std::cout << "Failed to load texture wall.jpg" << std::endl;
    }
    stbi_image_free(data);
```

stbi_load 得到的图片可能是以左上角为原点，如果需要转为左下角，需要调用：

```cpp
stbi_set_flip_vertically_on_load(true);
```

## 设置纹理单元

shader 的 uniform 要在 shader 启动后才能设置

```cpp
    shader.use();
    // texture1 的数据从 GL_TEXTURE0 拿 
    shader.setInt("texture1", 0);
```

## 渲染循环中激活并绑定对应纹理

```cpp
    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, texture);
```

## fragment shader 应用纹理单元

```glsl
uniform sampler2D texture1;
FragColor = texture(texture1, TexCoord);
```