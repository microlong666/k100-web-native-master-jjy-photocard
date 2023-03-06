# k100-web-native

## 安装依赖

```
yarn install or npm install
```

### 启动开发环境

```
yarn dev or npm run dev
```

### 打包

```
yarn build or npm run build
```

- 打包后的文件在文件夹 bundle 下 dist.zip
- 将 dist.zip 文件上传到 IDE 二开控件页签下即可

## 开发说明

### 文件夹

> build 二开控件打包配置 (勿动)
> bundle 打包后的文件夹
> public 开发环境运行文件(勿动)
> server 开发环境服务器 (勿动)
> tests 测试代码
> src 代码内容
>
> > component 二开控件开发文件夹 **注意二开控件代码需要全部在此文件夹中，方便后续打包**

    - package.json 二开控件名称以及版本信息
    - index.js 二开控件导出路径

> > config 二开控件配置信息

    - index.js  可以配置关联web引擎站点信息等
    - page.js 页面测试协议

> > 其他，勿动

### 开发流程

1. src/component/package.json 定义版本信息

```
{
  "name": "periodicpicker", // 定义二开控件类型
  "version": "0.1", // 控件版本
  "main": "./index.js" // 控件路径 脚手架需要读取到具体指向的控件文件 默认./index.js
}
```

2. src/config/page.js 提供表单测试协议

```
/* eslint-disable */
export defualt {
  "pageinfo": {},
  "view": {},
  "presenter: {
    "initial": [],
    "interface": [],
    "handlers": []
  }
}
```

3. src/config/index.js 提供对应连接 web 站点地址

4. src/component/ 在此文件夹内部写开发代码

### 可用 sdk

##### xtion-web

```
import XtWeb from 'xtion-web'
```

###### XtWeb

1.  Engine
    1.1 UIService
    1.2 UIEngine
    1.3 Engine 引擎组件
    1.4 UI
    - View 组件父类 所有二开组件均需要 minxins 此对象
      **对象方法**
      1. getView(type, getter) {} 对接引擎获取组件值数据的方法 二开控件需要重写
      2. setView(data, type, setter) {} 对接引擎对控件赋值的方法 二开控件需要重写
      3. executeLogicExpression(expression, engine) {} 解析逻辑表达式
      4. executeEvent(triggerType, eventTarget, data, callback, errCallback) {} 触发控件事件
2.  Widget
    2.1 UIService

    - Loading 加载框
      1. show() 显示加载框
      2. hide() 隐藏加载框
    - SimpleModalService 模态框服务

      1. push(context, param) 打开模态框
         | 参数 | 备注 |
         | ---- | ---- |
         | context | vm 对象 |
         | param | Object|

         | 参数 | 备注 |
         |  ----  | ----  |
         | title | 标题 |
         | body | VueComponent Vue组件factory |
         | props | 传入body对象的属性 |
         | customClass | 自定义样式类 |
         | cancel | 取消按钮信息 接收一个数组[] ['关闭', fn(modal, bodyVm){}] |
         | confirm | 确认按钮信息 接收一个数组[] ['确定', fn(modal, bodyVm){}] |

      2. pop() 关闭模态框
         2.2 UI widget 层控件

3.  Service
    3.1 Storager 存储

    - Token token 信息 （set,get）

    - User 用户信息（get）

    - UniqueId 生成唯一 id  get() 获取唯一id值

    - CloudServ 云存储信息

  3.2 Permission 权限服务

    - checkFunc(funCode) 检查权限
      | 参数 | 备注 |
      | ---- | ---- |
      | funcCode | string 定义的受控权限码 |

  3.3 DownloadService 文件服务

  - download （context, url, dateTime, uploadType = 'att', storage = 'storage', fileName, mediaType, isCope） 下载文件 返回 blob

  - downloadFile （context, url, dateTime, fileName, uploadType = 'att', storage = 'storage', mediaType = '', isCope）下载文件 直接弹出下载并保存

  - getUrl(context, url, dateTime, fileName, uploadType = 'att', storage = 'storage', mediaType = '', isCope) 获取文件的下载路径 url

    | 参数       | 备注                                                    |
    | ---------- | ------------------------------------------------------- |
    | context    | vm对象                                                  |
    | url        | 文件的url地址：29467787-0f56-45cc-bac3-991779119d0f.png |
    | dateTime   | 文件对应的时间戳 1577327454700                          |
    | uploadType | 文件类型 img or att                                     |
    | storage    | 存储库 storage, storage-1d, storage-1y, storage-3m      |
    | mediaType  | 媒体类型 默认不传                                       |
    | isCope     | 是否剪裁 当前仅支持阿里云                               |

    