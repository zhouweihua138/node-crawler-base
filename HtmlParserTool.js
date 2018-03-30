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
      for(let i=0; i< $("a").length; i++){
        if($("a").eq(i).attr("href").indexOf('..') < 0){
          links.push("http://www.purepen.com/sgyy/" + $("a").eq(i).attr("href"));
        }
      }
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

// 获取文章信息
HtmlParserTool.prototype.extractArticle = function(url, cb){
  let downLoadFile = new DownLoadFile();
  downLoadFile.getHtmlDoc(url, function(htmlDoc){
    try {
      const $ = cheerio.load(htmlDoc);
      let article = {
        title:$('b').text(),
        content: $('pre>font').text()
      };
      cb && setImmediate(cb, article, this);
    }catch(err){
      console.log(err.message);
    }
  });
};

module.exports = HtmlParserTool;
