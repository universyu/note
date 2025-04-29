
相机坐标系由 front right up 构成，利用欧拉角更新坐标系

```cpp
    void updateCameraVectors()
    {
        // FPS style
        glm::vec3 front;
        front.x = cos(glm::radians(Yaw)) * cos(glm::radians(Pitch));
        front.y = sin(glm::radians(Pitch));
        front.z = sin(glm::radians(Yaw)) * cos(glm::radians(Pitch));
        Front = glm::normalize(front);
        Right = glm::normalize(glm::cross(Front, WorldUp)); 
        Up = glm::normalize(glm::cross(Right, Front));
    }
```

```cpp
    void ProcessMouseMovement(float xoffset, float yoffset, GLboolean constrainPitch = true)
    {
        xoffset *= MouseSensitivity;
        yoffset *= MouseSensitivity;

        Yaw += xoffset;
        Pitch += yoffset;

        if (constrainPitch)
        {
            if (Pitch > 89.0f)
                Pitch = 89.0f;
            if (Pitch < -89.0f)
                Pitch = -89.0f;
        }

        updateCameraVectors();
    }
```


键盘输入 wasd 时用 look-at 风格更新位置

```cpp
    void ProcessKeyboard(Camera_Movement direction, float frameTime) {

        float speed = MovementSpeed * frameTime;
        switch (direction)
        {
        case FORWARD:
        default:
            Position += Front * speed;
            break;
        case BACKWARD:
            Position -= Front * speed;
            break;
        case LEFT:
            Position -= Right * speed;
            break;
        case RIGHT:
            Position += Right * speed;
            break;
        }

    }
```

渲染时获取 viewMateix

```cpp
    glm::mat4 GetViewMatrix()
    {
        return glm::lookAt(Position, Position + Front, Up);
    }
```

滚轮缩放改相机的 fov 

```cpp
    void ProcessMouseScroll(float yoffset)
    {
        Fov -= (float)yoffset;
        if (Fov < 1.0f)
            Fov = 1.0f;
        if (Fov > 45.0f)
            Fov = 45.0f;
    }
```