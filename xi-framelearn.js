/*
* @Author: joe
* @Date:   2017-03-21 19:01:36
* @Last Modified by:   Administrator
* @Last Modified time: 2017-03-21 20:03:39
*/
( function ( global ){
	var document = global.document;
	var arr = [];
	var push = arr.push;

	function joe ( selector ){
		return new init( selector );
	}
	joe.fn = joe.prototype = {
		constructor:joe
	};
	var init = joe.fn.init = function ( selector ){
	};
	init.prototype = joe.fn;
// joe工厂函数,joe原型的扩展方法
	joe.extend = joe.fn.extend = function (){
		var args = arguments,
			i = 0,
			l = args.length,
			obj;
		for (; i < l; i++) {
			obj = args[ i ];
			for( var k in obj ){
				if ( obj.hasOwnProperty( k ) ) {
					this[ k ] = obj[ k ];
				}
			}
		}
		return this;
	}

	// 工具类方法
	joe.extend( {
		type: function ( obj ){
			if ( obj==null ) {
				return obj +'';
			}
			return typeof obj !== 'object'? typeof obj :
				Object.prototype.toString.call( obj ).slice( 8,-1 ).toLowerCase();
		}
	} )

	// 添加类型判断方法
	joe.$.extend( {
       isString: function ( obj ){
       	  return typeof obj === 'string' ;
       },
       // HTML标签
       isHTML:function ( obj ){
       	  return obj.charAt( 0 ) === '<' 
       	  	&& obj.charAt( obj.length-1 ) === '>' 
       	  	&& obj.length >=3;
       },
       isDOM:function ( obj ){
       	   return !!obj && !!obj.nodeType;
       },
       isArrayLike:function ( obj ){

       },
       isFunction:function ( obj ){

       },
       isWindow:function ( obj ){
       	// 非null/undefined 且window.window === window 
       	   return !!obj && obj.window === obj;
       }
	} );
	


	// support RequireJS and SeaJs
	if ( typeof define === 'function' ) {
		define( function (){
			return joe;
		});
	}
	// support NodeJS
  	else if ( typeof exports !== 'undefined' ){
    	module.exports = joe;
  	}

  	global.$ = joe;
}( window ) )
