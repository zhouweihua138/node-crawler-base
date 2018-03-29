/**
 * Created by zhouweihua 2018/3/27.
 */

Array.prototype.indexOf = function(val){
  for(var i=0; i < this.length; i++){
    if(this[i] == val){
      return i;
    }
    
    return -1;
  }
};

Array.prototype.contains = function(val){
  let index = this.indexOf(val);
  if(index > -1){
    return true;
  }
  
  return false;
};

Array.prototype.remove = function(val){
  // let index = this.indexOf(val);
  // if(index > -1){
  //   this.splice(index, 1);
  // }
  this.contains(val) && this.splice(index, 1);
};

// 网络爬虫的简单实现
// 1、定义已访问队列，待访问队列和爬取得URL的哈希表，包括出队列，入队列，判断队列是否空等操作
// LinkQueue

// 已访问的url集合
let visitedUrl = null;
// 待访问的url集合
let unVisitedUrl = null;

// Constructor
function ImgQueue(scope, cb){
  this.scope = scope;
  visitedUrl = [];
  unVisitedUrl = [];
  cb && setImmediate(cb, null, this);
}

// 获得URL队列
ImgQueue.prototype.getUnVisitedUrl = function(){
  return unVisitedUrl;
};

// 添加到访问过的URL队列中
ImgQueue.prototype.addVisitedUrl = function(url){
  visitedUrl.push(url);
};

// 移除访问过的URL
ImgQueue.prototype.removeVisitedUrl = function(url){
  visitedUrl.remove(url);
};

// 未访问的URL出队列
ImgQueue.prototype.unVisitedUrlDeQueue = function(){
  return unVisitedUrl.shift();
};

// 保证每个url只被访问一次
ImgQueue.prototype.addUnVisitedUrl = function(url){
  if(url != undefined && url != null && url!="" && !visitedUrl.contains(url) && !unVisitedUrl.contains(url)){
    unVisitedUrl.push(url);
  }
};

// 获得已经访问的URL数目
ImgQueue.prototype.getVisitedUrlNum = function(){
  return visitedUrl.length;
};

// 判断未访问的URL队列中是否为空
ImgQueue.prototype.unVisitedUrlsEmpty = function(){
  return unVisitedUrl.length < 1;
};


// Export
module.exports = ImgQueue;
