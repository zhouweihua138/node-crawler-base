/**
 * Created by zhouweihua 2018/3/27.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const iconv = require('iconv-lite');
const { URL } = require("url");
const request = require("request");

String.prototype.replaceAll = function(s1, s2){
  return this.replace(new RegExp(s1, "gm"), s2);
}

// DownLoadFile类，根据得到的url，爬取网页内容，下载到本地保存
function DownLoadFile(scope, cb){
  this.scope = scope;
  cb && setImmediate(cb, null, this);
}

// 根据url和网页类型生成需要保存的网页的文件名，去掉url中非文件名字符
DownLoadFile.prototype.getFileNameByUrl = function(url, contentType){
  // 去掉 http://
  url = url.substr(7);
  // text/html类型
  if(contentType.indexOf("html") != -1){
    url = url.replaceAll("[\\?/:*|<>\"]", "_") + ".html";
    return url;
  }else {
    // application/pdf类型
    return url.replaceAll("[\\?/:*|<>\"]", "_") + "."
      + contentType.substr(contentType.lastIndexOf("/") + 1);
  }
};

// 保存网页字节数组到本地文件 filePath为要保存的文件的相对地址
DownLoadFile.prototype.saveToLocal = function(data, filePath){
  try{
    let out = fs.createWriteStream(filePath);
    out.write(data);
    out.end();
    out.on("finish", function(){
      console.log("写入完成。");
    });
    out.on("error", function(err) {
      console.log(err.stack);
    });
  }catch(err){
    console.error(err)
  }
};

//下载 url 指向的网页
DownLoadFile.prototype.downloadFileOld = function(url){
  let filePath = null;
  //生成 HttpClient对象并设置参数
  const options = new URL(url);
  const req = http.request(options, (res) =>{
    if(res.statusCode !== 200){
      console.log("请求出错: " + res.statusCode);
    }
    let body = '';
    res.setEncoding("binary");
    res.on("data", (data) => {
      body += data;
    });
    res.on("end", ()=>{
      //转换编码
      body = iconv.decode(body, 'gbk');
      filePath = path.join(__dirname, "download", this.getFileNameByUrl(url,res.headers["content-type"]));
      this.saveToLocal(body, filePath);
      console.log("响应中已无数据");
    });
  });
  req.on("error", (e) =>{
    console.log("请求遇到问题：" + e.message);
  });
  req.end();

  return filePath;
};


//下载 url 指向的网页
DownLoadFile.prototype.downloadFile = function(url){
  var that = this;
  var pm = new Promise(function(resolve, reject){
    let filePath = null;
    generateFilePath("download");
    filePath = path.join(__dirname, "download", path.basename(url));

    var options = {
      url: url,
      headers:{
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding":"gzip, deflate, sdch",
        "Accept-Language":"zh-CN,zh;q=0.8",
        "Cache-Control":"max-age=0",
        "Connection":"keep-alive",
        "Cookie":"td_cookie=18446744071031522472",
        "Host":"www.purepen.com",
        "Referer": url,
        "Upgrade-Insecure-Requests":"1",
        "User-Agent":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
      }
    }
    //request(options).pipe(fs.createWriteStream(filePath)).on("close", function(){
    //  resolve(filePath);
    //  console.log("网页保存成功");
    //});
    request(options, function(error, response, body){
      if(error){
        console.log('下载网页错误：' + error.message);
        return;
      }
      that.saveToLocal(body,filePath);
    }).on("close", function(){
      resolve(filePath);
      console.log("网页保存成功");
    });
  });
  return pm;
};

//下载 url 指向的图片
DownLoadFile.prototype.downloadImg = function(url){
  var pm = new Promise(function(resolve, reject){
    let filePath = null;
    generateFilePath("download");
    filePath = path.join(__dirname, "download", path.basename(url));

    var options = {
      url: url,
      headers:{
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding":"gzip, deflate, sdch",
        "Accept-Language":"zh-CN,zh;q=0.8",
        "Cache-Control":"max-age=0",
        "Connection":"keep-alive",
        "Cookie":"td_cookie=18446744071031522472",
        "Host":"www.purepen.com",
        "Referer": url,
        "Upgrade-Insecure-Requests":"1",
        "User-Agent":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
      }
    }
    request(options).pipe(fs.createWriteStream(filePath)).on("close", function(){
      resolve(filePath);
      console.log("图片保存成功");
    });
  });
  return pm;
};

function generateFilePath(path){
  if(fs.existsSync(path)){
    console.log(path + "目录已经存在");
  }else{
    fs.mkdirSync(path);
    console.log(path + "目录创建成功");
  }
}

// 获取 url 指向的网页htmlDoc
DownLoadFile.prototype.getHtmlDoc = function(url, cb){
  let body = '';
  //生成 HttpClient对象并设置参数
  const options = new URL(url);
  const req = http.request(options, (res) =>{
    if(res.statusCode !== 200){
      console.log("请求出错: " + res.statusCode);
    }
    res.setEncoding("binary");
    res.on("data", (data) => {
      body += data;
    });
    res.on("end", ()=>{
      //转换编码
      body = iconv.decode(body, 'gbk');
      cb && setImmediate(cb, body, this);
      //console.log("响应中已无数据");
    });
  });
  req.on("error", (err) =>{
    console.log("请求遇到问题：" + err.message);
  });
  req.end();
};


//保存文件
DownLoadFile.prototype.saveArticle = function(data, fileName){
  let filePath = null;
  //生成 HttpClient对象并设置参数
  filePath = path.join(__dirname, "download", fileName);
  this.saveToLocal(data, filePath);
  return filePath;
};

module.exports = DownLoadFile;
