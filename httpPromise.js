/**
 * Created by zhouweihua on 2018/3/29.
 */

function loadPage(ur){
  var http = require('http');
  var pm = new Promise(function (resolve, reject) {
    http.get(url, function (res) {
      var html = '';
      res.on('data', function (data) {
        html += data.toString();
      });
      res.on('end', function(){
        resolve(html);
      });
    }).on('error',function(e){
      reject(e);
    });
  });

  return pm;
}

loadPage('http://www.baidu.com').then(function (data) {
  console.log(data);
});
