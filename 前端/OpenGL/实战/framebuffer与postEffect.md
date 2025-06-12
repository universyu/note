
## framebuffer

framebuffer 是一个完整的画布，可以绑定 texture 和 renderbuffer 等附件，renderbuffer 存储像素信息比如深度和模块测试值还有颜色。下面构建一个 framebuffer，构建一个 texture 并绑定到 framebuffer，构建一个 renderbuffer 并绑定到framebuffer

```cpp
    unsigned int framebuffer;
    glGenFramebuffers(1, &framebuffer);
    glBindFramebuffer(GL_FRAMEBUFFER, framebuffer);

    unsigned int textureColorbuffer;
    glGenTextures(1, &textureColorbuffer);
    glBindTexture(GL_TEXTURE_2D, textureColorbuffer);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, SCR_WIDTH, SCR_HEIGHT, 0, GL_RGB, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, textureColorbuffer, 0);

    unsigned int rbo;
    glGenRenderbuffers(1, &rbo);
    glBindRenderbuffer(GL_RENDERBUFFER, rbo);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, SCR_WIDTH, SCR_HEIGHT); 
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_RENDERBUFFER, rbo);
    if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
        std::cout << "ERROR::FRAMEBUFFER:: Framebuffer is not complete!" << std::endl;
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
```

绑定当下画布并开启深度测试

```cpp
glBindFramebuffer(GL_FRAMEBUFFER, framebuffer);
glEnable(GL_DEPTH_TEST);
```

绘制之后绑回屏幕画布，并在这里绘制一个 quandVAO，这个 VAO绘制两个三角形组成屏幕，并使用来自 framebuffer 的纹理贴图，也就是离屏渲染并以贴图的形式展示在屏幕上，在屏幕对应的 shader 里面可以做后处理

```cpp
        glBindFramebuffer(GL_FRAMEBUFFER, 0);
        glDisable(GL_DEPTH_TEST); 
        glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);
        screenShader.use();
        screenShader.setInt("postEffectMode", postEffectMode);
        glBindVertexArray(quadVAO);
        glBindTexture(GL_TEXTURE_2D, textureColorbuffer);	
        glDrawArrays(GL_TRIANGLES, 0, 6);
```

## postEffect

### edge detection 

首先屏幕 clear 为白色（length > 0.8 就视作背景），取一个较小的 offset ，从中心点取一个 3*3 矩阵并取插值颜色，如果中心与周围颜色差不大那么插值后近乎为  0 

```glsl
    vec3 col = texture(screenTexture, TexCoords).rgb;
    vec2 offsets[9] = vec2[](
        vec2(-offset,  offset), 
        vec2( 0.0f,    offset), 
        vec2( offset,  offset), 
        vec2(-offset,  0.0f),   
        vec2( 0.0f,    0.0f),   
        vec2( offset,  0.0f),   
        vec2(-offset, -offset), 
        vec2( 0.0f,   -offset), 
        vec2( offset, -offset)  
    );
    float kernel[9] = float[](
        -1, -1, -1,
        -1,  8, -1,
        -1, -1, -1
    );
    vec3 sampleTex[9];
    for(int i = 0; i < 9; i++)
    {
        sampleTex[i] = vec3(texture(screenTexture, TexCoords.st + offsets[i]));
    }
    vec3 edge = vec3(0.0);
    for(int i = 0; i < 9; i++)
        edge += sampleTex[i] * kernel[i];
    if(length(col)>0.8){
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else if(length(edge)>0.35){
        FragColor = vec4(0.1, 1.0, 0.1, 1.0);
    } else {
        FragColor = vec4(1.0,0.1,0.1 ,1.0);
    }
```