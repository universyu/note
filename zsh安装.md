# zsh安装

`sudo apt install zsh`

官网`https://ohmyz.sh/`找下载指令

确保软件库更新了：`sudo apt update`

安装高亮插件`sudo apt install zsh-syntax-highlighting zsh-autosuggestions -y`

自动启用插件`echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc`

启用命令补全插件`echo "source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc`