
uniform 变量可以从 cpu 把数据传递到 gpu ，已经激活 shaderProgram 并且绑定 VAO 之后，绘制之前，把 uniform 传入

```cpp
        float time = glfwGetTime();
        float userGreen = ( sin(time) + 1 ) / 2.0;
        int fragmentColorLoaction = glGetUniformLocation(shaderProgram, "userGreen");
        glUniform1f(fragmentColorLoaction,userGreen);
```
在着色器中需要定义此变量
```glsl
uniform float userGreen;
```
