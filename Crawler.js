/**
 * Created by zhouweihua on 2018/3/28.
 */

const LinkQueue = require('./LinkQueue');
const ImgQueue = require('./ImgQueue');
const DownLoadFile = require('./DownLoadFile');
const HtmlParserTool = require('./HtmlParserTool');

let linkQueue = new LinkQueue();
let imgQueue = new ImgQueue();
let htmlParserTool = new HtmlParserTool();

function Crawler(scope, cb){
  this.scope = scope;
  cb && setImmediate(cb, null, this);
}

// 使用种子初始化 URL 队列
Crawler.prototype.initCrawlerWithSeeds = function(seeds){
  for(let i =0; i < seeds.length; i++){
    linkQueue.addUnVisitedUrl(seeds[i]);
  }
};

// 抓取
function crawl(){
  // 循环条件：待抓取的链接不空且抓取的网页不多于1000
  //while(!linkQueue.unVisitedUrlsEmpty() && linkQueue.getVisitedUrlNum() <= 10){
  if(!linkQueue.unVisitedUrlsEmpty() && linkQueue.getVisitedUrlNum() <= 1){
    // 队头URL出队列
    let visitUrl = linkQueue.unVisitedUrlDeQueue();
    console.log(new Date().toLocaleString() + " 正在抓取：" + visitUrl);
    //if(visitUrl == null){
    //  continue;
    //}

    let downLoadFile = new DownLoadFile();
    //// 下载网页
    //downLoadFile.downloadFile(visitUrl);

    // 该url 放入到已访问的URL中
    linkQueue.addVisitedUrl(visitUrl);

    // 获得图片地址
    htmlParserTool.extractImgSrcs(visitUrl, function(srcs){
      for(let i=0; i< srcs.length; i++){
        try{
          if(srcs[i].indexOf("http") > -1){
            imgQueue.addUnVisitedUrl(srcs[i]);
          }
        }catch(err){
          console.log("图片地址处理失败：" + err.message);
        }
      }
      downLoadImg();
    });

    // 提取出下载网页中的 URL
    htmlParserTool.extractLinks(visitUrl, function(links){
      // 新的未访问的 URL 入队
      for(let i=0; i< links.length; i++){
        try{
          if(links[i].indexOf("javascript:") < 0){
            linkQueue.addUnVisitedUrl(links[i]);
          }
        }catch(err){
          console.log("新的未访问的URL入队失败：" + err.message);
        }
      }
      crawl();
    });
  }
};

// 抓取图片
function downLoadImg() {
  console.log(imgQueue.getUnVisitedUrl().toString());
  // 循环条件：待抓取的链接不空且抓取的图片不多于1000
  if (!imgQueue.unVisitedUrlsEmpty() && imgQueue.getVisitedUrlNum() <= 0) {
    // 队头URL出队列
    let visitUrl = imgQueue.unVisitedUrlDeQueue();
    console.log(new Date().toLocaleString() + " 正在下载：" + visitUrl);

    let downLoadFile = new DownLoadFile();
    downLoadFile.downloadFile(visitUrl);

    // 该url 放入到已访问的URL中
    imgQueue.addVisitedUrl(visitUrl);

    console.log(imgQueue.getVisitedUrlNum());

    // downLoadImg();
  }
}

// 抓取过程
Crawler.prototype.crawling = function(seeds){
  // 初始化 URL队列
  this.initCrawlerWithSeeds(seeds);
  crawl();
};

module.exports = Crawler;
