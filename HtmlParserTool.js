/**
 * Created by zhouweihua on 2018/3/28.
 */

const cheerio = require("cheerio");
const DownLoadFile = require("./DownLoadFile");

function HtmlParserTool(scope, cb){
  this.scope = scope;
  cb && setImmediate(cb, null, this);
}

// 获取一个网页上的链接
HtmlParserTool.prototype.extractLinks = function(url, cb){
  let downLoadFile = new DownLoadFile();
  downLoadFile.getHtmlDoc(url, function(htmlDoc){
    let links = [];
    try {
      const $ = cheerio.load(htmlDoc);
      for(let i=0; i< $(".picBox .right").length; i++){
        links.push("http://photo.fengniao.com" + $(".picBox .right").eq(i).attr("href"));
      }
      //for(let i=0; i< $("frame").length; i++) {
      //  links.push($("frame").attr("src"));
      //}
      cb && setImmediate(cb, links, this);
    }catch(err){
      console.log(err.message);
    }
  });
};

// 获取一个网页上的图片地址
HtmlParserTool.prototype.extractImgSrcs = function(url, cb){
  let downLoadFile = new DownLoadFile();
  downLoadFile.getHtmlDoc(url, function(htmlDoc){
    let srcs = [];
    try {
      const $ = cheerio.load(htmlDoc);
      for(let i=0; i< $(".downPic").length; i++){
        srcs.push($(".downPic").eq(i).attr("href"));
      }
      //for(let i=0; i< $("frame").length; i++) {
      //  links.push($("frame").attr("src"));
      //}
      cb && setImmediate(cb, srcs, this);
    }catch(err){
      console.log(err.message);
    }
  });
};

module.exports = HtmlParserTool;
