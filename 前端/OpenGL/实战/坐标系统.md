
设置 MVP 矩阵：

```cpp
        glm::mat4 model = glm::mat4(1.0f);
        glm::mat4 view = glm::mat4(1.0f);
        glm::mat4 projection = glm::mat4(1.0f);
        model = glm::rotate(model, glm::radians(rotateAngleX), glm::vec3(1.0f, 0.0f, 0.0f));
        float radius = 5.0f;
        float camX = static_cast<float>(sin(glfwGetTime()) * radius);
        float camZ = static_cast<float>(cos(glfwGetTime()) * radius);
        glm::vec3 camPos = glm::vec3(camX, 0.0f, camZ);
        glm::vec3 camCenter = glm::vec3(0.0f, 0.0f, 0.0f);
        glm::vec3 camUp = glm::vec3(0.0f, 1.0f, 0.0f);
        view = glm::lookAt(camPos, camCenter, camUp);
        projection = glm::perspective(glm::radians(45.0f), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
```