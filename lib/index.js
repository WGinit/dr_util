/**
 * 常用函数封装2018-6-9
 * author Wginit
 * Email: wginit@yeah.net
 */
/**
 * 对象转URL拼接
 */
function ObjToUrl (obj, url) {
  if (obj == null){
    return obj;
  }
  let arr = [], urls = url + '?';
  for (let i in obj){
    let str = i + "=" + obj[i];
    arr.push(str);
  }
  urls += arr.join('&')
  return urls
}
/**
 * 对象转数组处理
 */
function ObjToArrry (obj) {
  let arrKey = [], arrValue = [], data= ''
  for(let i in obj) {
    arrKey.push(i)
    arrValue.push(obj[i])
  }
  for(let j in arrKey) {
    data += arrKey[j] + '=' + arrValue[j] + '&'
  }
  return data.substring(0, data.length -1)
}
/* 一、ajax请求封装
*   1、原始ajax方法
*  @params type 请求类型
*  @params url 请求路径
*  @params async 是否异步
*  @params data 请求参数
*  @params callback 回调函数
*/
//封装ajax方法
function n_ajax( type = 'GET', url, data = null, callback, async = true ) {
  let xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP"),
    context = this, urls
  //监听变化
  xmlHttp.onreadystatechange = function() {
    //请求成功
    if( xmlHttp.readyState === 4 && xmlHttp.status === 200 ) {
      // callback.call(context, JSON.parse(xmlHttp.responseText ))
      callback()
    } else {
      console.log('请求失败，失败状态码:' + xmlHttp.status)
    }
  }
  //如果是get方式请求并且需要穿参
  if( type === 'GET') {
    urls = ObjToUrl(data, url) || url
    xmlHttp.open( type, urls, async);
    xmlHttp.send()
  } else {
    data = ObjToArrry(data)
    xmlHttp.open( type, url, async);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xmlHttp.send( data )
  }
}

/*
*   2、用promise的方式实现ajax
*   @params type 请求类型
*   @params url  请求路径
*   @params data 请求参数
*/
function p_ajax( type = 'GET', url, data = null, async = true) {
  return new Promise((resolve, reject) => {
    let xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP"),
        context = this, urls
    //监听变化
    xmlHttp.onreadystatechange = function() {
      //请求成功
      if( xmlHttp.readyState === 4 && xmlHttp.status === 200 ) {
        resolve( JSON.parse( xmlHttp.responseText ) )
      } else {
        reject(xmlHttp)
      }
    }
    //如果是get方式请求并且需要穿参
    if( type === 'GET') {
        urls = ObjToUrl(data, url) || url
        xmlHttp.open( type, urls, async);
        xmlHttp.send()
      } else {
      data = ObjToArrry(data)
      xmlHttp.open(type, url, async);
      xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      xmlHttp.send(data)
    }
  })
}

/**
 * 函数防抖
 * 原理：当触发完事件 n 秒内不再触发事件，我才执行
 */
function debounce(fn,wait){
  var timeout
  return function () {
    //指定执行上下文
    var context = this
    var args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function(){
        fn.apply(context, args)
    }, wait)
  }
}

/**
 * 函数节流
 * 原理：如果你持续触发事件，每隔一段时间，只执行一次事件。
 */
function throttle (fn, wait) {
  var timeout
  var previous = 0
  return () => {
    var context = this
    var args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 深浅拷贝函数封装
 * @ 参数一：true为深拷贝,false为浅拷贝，默认是false
 * @ 参数二：被拷贝的对象
 */

function copy() {
  var newObj,
      length = arguments.length,
      isDeep = length > 1 ? arguments[0] : false,
      obj = length > 1 ? arguments[1] : arguments[0];
  // 只拷贝对象
  if (typeof obj !== 'object') return;

  // 根据obj的类型判断是新建一个数组还是对象
  newObj = obj instanceof Array ? [] : {};
  
  // 遍历obj，并且判断是obj的属性才拷贝
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
      //判断是进行深拷贝还是浅拷贝
      if( isDeep && typeof obj[key] === 'object' ) {
        //通过递归进行深拷贝
        newObj[key] = copy(true, obj[key])
      }
    }
  }
  return newObj;
}

/*
*   @ 继承方法封装
*   @ 参数一：子对象
*   @ 参数二：父对象        
*/

function extend( Child, Parent ) {
  //定义一个空对象
  var foo = function(){};
  foo.prototype = Parent.prototype;
  //将Child的原型指向foo的实例对象
  Child.prototype = new foo();
  //将Child的construtor指向自己
  Child.prototype.constructor = Child;
  //为子对象设一个uber属性，这个属性直接指向父对象的prototype属性
  Child.uber = Parent;
}
/*
*   @ 尾递归实现阶乘
*   @ 函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
*   @ 递归非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生"栈溢出"错误（stack overflow）。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。
*/

//普通递归阶乘
function c_factorial(n) {
  if (n === 1) return 1;
  return n * c_factorial(n - 1);
}

//尾递归实现阶乘
function t_factorial(n, total = 1) {
  if (n === 1) return total;
  return t_factorial(n - 1, n * total);
}

/*
*   @ 快速排序    
*/
function quickSort( arr ) {
  if( arr.length <= 1 ) return arr;
  var pivotIndex = Math.floor( arr.length / 2 ),
      pivot = arr.splice( pivotIndex, 1 )[0],
      left = [],
      right = [],
      i = 0;
  for ( ; i < arr.length; i++) {
      if( arr[i] < pivot ) {
          left.push(arr[i]);
      } else {
          right.push(arr[i]);
      }
  }
  return quickSort(left).concat( [pivot], quickSort(right) );
}
/**
 * 冒泡排序, 冒泡排序就是比较两个相邻元素，把小的元素往前调或者把大的元素往后调。弊端：就是两种极端的情况，一种是数据本来就是正序，那做的就是无用功，另外一种就是反序，不执行
 */
function bubbleSort(arr3) {
  　　var low = 0;
  　　var high= arr.length-1; //设置变量的初始值
  　　var tmp,j;
  　　while (low < high) {
  　　　　var pos1 = 0,pos2=0; 
  　　　　for (let i= low; i< high; ++i) { //正向冒泡,找到最大者
  　　　　　　if (arr[i]> arr[i+1]) {
  　　　　　　　　tmp = arr[i]; arr[i]=arr[i+1];arr[i+1]=tmp;
  　　　　　　　　pos1 = i ;
  　　　　　　}
  　　　　}
  　　　　high = pos1;// 记录上次位置
  　　　　for (let j=high; j>low; --j) { //反向冒泡,找到最小者
  　　　　　　if (arr[j]<arr[j-1]) {
  　　　　　　　　tmp = arr[j]; arr[j]=arr[j-1];arr[j-1]=tmp;　　
  　　　　　　　　pos2 = j;
  　　　　　　}
  　　　　}　　　
  　　　　low = pos2; //修改low值
  　　}
  　　return arr3;
  }

  /**
   * 选择排序，选择排序就是从一个未知数据空间，选取数据之最放到一个新的空间。
   */
  function selectionSort(arr) {
　　var len = arr.length;
　　var minIndex, temp;
　　for (var i = 0; i < len - 1; i++) {
　　　　minIndex = i;
　　　　for (var j = i + 1; j < len; j++) {
　　　　　　if (arr[j] < arr[minIndex]) { //寻找最小的数
　　　　　　　minIndex = j; //将最小数的索引保存
　　　　　　}
　　　　}
　　　　temp = arr[i];
　　　　arr[i] = arr[minIndex];
　　　　arr[minIndex] = temp;
　　}
　　return arr;
}

/**
 * 插入排序(二分法)，插入排序的原理其实很好理解，可以类比选择排序。选择排序时在两个空间进行，等于说每次从旧的空间选出最值放到新的空间，而插入排序则是在同一空间进行。
 */
function binaryInsertionSort(array) {
　　for (var i = 1; i < array.length; i++) {
　　　　var key = array[i], left = 0, right = i - 1;
　　　　while (left <= right) {
　　　　　　var middle = parseInt((left + right) / 2);
　　　　　　if (key < array[middle]) {
　　　　　　　　right = middle - 1;
　　　　　　} else {
　　　　　　　　left = middle + 1;
　　　　　　}
　　　　}
　　　　for (var j = i - 1; j >= left; j--) {
　　　　　　array[j + 1] = array[j];
　　　　}
　　　　array[left] = key;
　　}
　　return array;
}

/**
 * 希尔排序，希尔排序是把记录按下标的一定增量分组，对每组使用直接插入排序算法排序；随着增量逐渐减少，每组包含的关键词越来越多，当增量减至1时，整个文件恰被分成一组，算法便终止。
 */
function shellSort(arr) {
　　var len = arr.length,
　　temp,
　　gap = 1;
　　while(gap < len/5) { //动态定义间隔序列
　　　　gap =gap*5+1;
　　}
　　for (gap; gap > 0; gap = Math.floor(gap/5)) {
　　　　for (var i = gap; i < len; i++) {
　　　　　　temp = arr[i];
　　　　　　for (var j = i-gap; j >= 0 && arr[j] > temp; j-=gap) {
　　　　　　　　arr[j+gap] = arr[j];
　　　　　　}
　　　　　　arr[j+gap] = temp;
　　　　}
　　}
　　return arr;
}

/**
 * 归并排序，归并排序其实可以类比二分法，二分法其实就是二等分的意思，简而言之就是不断和新序列的中间值进行比较。
 */
function mergeSort(arr) { //采用自上而下的递归方法
　　var len = arr.length;
　　if(len < 2) {
　　　　return arr;
　　}
　　var middle = Math.floor(len / 2),
　　left = arr.slice(0, middle),
　　right = arr.slice(middle);
　　return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right){
　　var result = [];
　　while (left.length && right.length) {
　　　　if (left[0] <= right[0]) {
　　　　　　result.push(left.shift());
　　　　} else {
　　　　　　result.push(right.shift());
　　　　}
　　}
　　while (left.length){
　　　　result.push(left.shift());
　　}
　　while (right.length){
　　　　result.push(right.shift());
　　}
　　return result;
}

/**
 * 堆排序，按原始序列排出金字塔式的结构，把最大值一层层往上冒，冒到金字塔最顶端的时候把它踢出来，这样达到排序的效果。
 */
function heapSort(array) {
　　//建堆
　　var heapSize = array.length, temp;
　　for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {　　
　　　　heapify(array, i, heapSize);
　　}
　　//堆排序
　　for (var j = heapSize - 1; j >= 1; j--) {
　　　　temp = array[0];
　　　　array[0] = array[j];
　　　　array[j] = temp;
　　　　console.log(array)
　　　　heapify(array, 0, --heapSize);
　　}
　　return array;
}
function heapify(arr, x, len) {
　　var l = 2 * x + 1, r = 2 * x + 2, largest = x, temp;
　　if (l < len && arr[l] > arr[largest]) {
　　　　largest = l;
　　}
　　if (r < len && arr[r] > arr[largest]) {
　　　　largest = r;
　　}
　　if (largest != x) {
　　　　temp = arr[x];
　　　　arr[x] = arr[largest];
　　　　arr[largest] = temp;
　　　　console.log(arr)
　　　　heapify(arr, largest, len);
　　}
}

/**
 * 计数排序，计数排序就是遍历数组记录数组下的元素出现过多次，然后把这个元素找个位置先安置下来，简单点说就是以原数组每个元素的值作为新数组的下标，而对应小标的新数组元素的值作为出现的次数，相当于是通过下标进行排序。
 */
function countingSort(array) {
　　var len = array.length,
　　B = [],
　　C = [],
　　min = max = array[0];
　　for (var i = 0; i < len; i++) {
　　　　min = min <= array[i] ? min : array[i];
　　　　max = max >= array[i] ? max : array[i];
　　　　C[array[i]] = C[array[i]] ? C[array[i]] + 1 : 1;
　　}
　　for (var k = 0; k <len; k++) {
　　　　var length = C[k]；
　　　　for(var m = 0 ;m <length ; m++){
　　　　　　B.push(k);
　　　　}
　　}
　　return B;
}

/**
 * 判断设备来源
 */
function deviceType(){
  var ua = navigator.userAgent;
  var agent = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];    
  for(var i=0; i<len,len = agent.length; i++){
      if(ua.indexOf(agent[i])>0){         
          break;
      }
  }
}

/**
 * 检测是否微信端
 */
function isWeixin(){
  var ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=='micromessenger'){
      return true;
  }else{
      return false;
  }
}

/**
 * 截取URL参数保存至对象
 */
function GetRequest(str) {
   var url = str.split('?')[1];
   var theRequest = new Object();
   var str2 = url.substr(0);
   strs = str2.split("&");
   console.log(strs)
   for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
   }
   return theRequest;
}

/**
 * jsonp 跨域封装
 * @param {*} config 
 * 使用方法： 
 * jsonp({ 
 *    url: '/b.com/b.json', 
 *    success: function(res){ 
 *      console.log(res)
 *    }, 
 *    time: 5000, 
 *    fail: function(err){
 *      console.log(err)
 *    } 
 * });
 */
function jsonp(config) { 
  var options = config || {}; // 需要配置url, success, time, fail四个属性 
  var callbackName = ('jsonp_' + Math.random()).replace(".", ""); 
  var oHead = document.getElementsByTagName('head')[0]; 
  var oScript = document.createElement('script'); 
  oHead.appendChild(oScript); 
  window[callbackName] = function(json) { //创建jsonp回调函数
    oHead.removeChild(oScript); 
    clearTimeout(oScript.timer); 
    window[callbackName] = null; 
    options.success && options.success(json); //先删除script标签，实际上执行的是success函数 
  }; 
  oScript.src = options.url + '?' + callbackName; //发送请求 
  if (options.time) { //设置超时处理 
  oScript.timer = setTimeout(function () { 
    window[callbackName] = null; 
    oHead.removeChild(oScript); 
    options.fail && options.fail({ 
      message: "超时" 
    }); }, options.time); 
  } 
}; 

/**
 * 获取url中指定参数的值
 */
function getUrlParam(key) {
  var url = window.location.search;
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"); 
  var result = url.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null; 
}

module.exports = {
  ObjToUrl,            
  ObjToArrry,          
  n_ajax,             
  p_ajax,              
  debounce,           
  throttle,           
  copy,             
  extend,             
  c_factorial,        
  t_factorial,       
  quickSort,          
  bubbleSort,        
  selectionSort,     
  binaryInsertionSort, 
  shellSort,         
  mergeSort,          
  heapSort,           
  countingSort,       
  deviceType,        
  isWeixin,           
  GetRequest,         
  jsonp,              
  getUrlParam      
}