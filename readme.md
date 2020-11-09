1. 首先安装ruby
2. 运行 ```gem install sass```  win下面好像要重启才生效
3. 运行 ```(sudo )npm install -g grunt```
4. 运行 ```npm install```

5. 开发时运行 ```npm run dev```,保持对scss文件的监听生成wxss



  "tabBar": {
    "color": "#60616A",
    "selectedColor": "#3FA8FF",
    "borderStyle": "white",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/tabIcon/square.png",
        "selectedIconPath": "images/tabIcon/square_selected.png",
        "text": "广场",
        "color": "#3FA8FF"
      },
      {
        "pagePath": "pages/home/home",
        "iconPath": "images/tabIcon/center.png",
        "selectedIconPath": "images/tabIcon/center_selected.png",
        "text": "我的",
        "color": "#3FA8FF"
      },
      {
        "pagePath": "pages/talk/talk",
        "iconPath": "images/tabIcon/teasing.png",
        "selectedIconPath": "images/tabIcon/teasing_selected.png",
        "text": "吐槽",
        "color": "#3FA8FF"
      }
    ]
  },