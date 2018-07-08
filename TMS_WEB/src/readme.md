# TMS WEB

## 开发环境

- NodeJs v6.6.0
- FIS3 脚手架

## 依懒安装

``` bash

npm install -g fis3
npm install -g fis3-hook-commonjs
npm install -g fis3-hook-relative
npm install -g fis3-parser-art-template4
npm install -g fis-parser-node-sass
npm install -g fis3-parser-typescript
npm install -g fis3-postpackager-query
npm install -g fis3-postpackager-loader

```

## 开发执行
所有的执行命令都在package.json文件中定义
- npm run server:start 启动服务
- npm run build:watch 开发监听
- npm run build:prd 发布


## 开发依懒框架
- jQuery v3.2.1
- bootstrap v3.3.7
- art-template v4.12.2
- jqGrid v5.3.1

## 相关链接
- jqGrid http://www.guriddo.net/demo/bootstrap/


## 开发流程
- 安装NodeJS (版本不需要太高)
- 安装开发依赖 (使用管理员运行CMD)
- npm run server:start 启动服务
- npm run build:watch 开发监听 (查看SRC目录同级DIST下是否生成相对应的文件)

## 发布流程
- npm run build:prd 运行发布
- 复制DIST文件夹下的目录到API工程PAGES目录下 (此步骤可当API发布到IIS上后，将DIST目录复制到PAGES下)。
