/**
 * Created by zhouweihua 2018/3/27.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const { URL } = require("url");

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
DownLoadFile.prototype.downloadFile = function(url){
  let filePath = null;
  //生成 HttpClient对象并设置参数
  const options = new URL(url);
  const req = http.request(options, (res) =>{
    if(res.statusCode !== 200){
      console.log("请求出错: " + res.statusCode);
    }
    let body = '';
    //res.setEncoding("utf8");
    res.on("data", (data) => {
      body += data;
    });
    res.on("end", ()=>{
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

// 获取 url 指向的网页htmlDoc
DownLoadFile.prototype.getHtmlDoc = function(url, cb){
  let body = '';
  //生成 HttpClient对象并设置参数
  const options = new URL(url);
  const req = http.request(options, (res) =>{
    if(res.statusCode !== 200){
      console.log("请求出错: " + res.statusCode);
    }
    //res.setEncoding("utf8");
    res.on("data", (data) => {
      body += data;
    });
    res.on("end", ()=>{
      cb && setImmediate(cb, body, this);
      //console.log("响应中已无数据");
    });
  });
  req.on("error", (err) =>{
    console.log("请求遇到问题：" + err.message);
  });
  req.end();
};

module.exports = DownLoadFile;
