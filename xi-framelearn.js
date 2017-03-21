/*
* @Author: joe
* @Date:   2017-03-21 19:01:36
* @Last Modified by:   Administrator
* @Last Modified time: 2017-03-21 20:47:14
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
		if ( !selector ) {
			return this;
		} else if ( joe.isString( selector )) {
			if ( joe.isHTML( selector ) ) {
				push.apply( this,joe.parseHTML( selector ) );
			} else {
				push.apply( selector )
			} 
		}
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
		},
		// 将HTML字符串转成对应的元素节点类型
		parseHTML: function ( html ){
			var ret=[],
				div,
				node;
			div = document.createElement( 'div' );
			div.innerHTML = html;
			for ( node = div.firstChild;node;node = node.nextSibling ){
				if ( node.nodeType===1 ) {
					ret.push( node );
				}
			}
			return ret;
		}
	} )

	// 添加类型判断方法
	joe.extend( {
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
       	   	var type = joe.type( obj ),
       	   		length = !!obj && 'length' in obj && obj.length;
       	   		// 过滤具有length属性的函数和window对象
       	   	if ( type ==='function'|| joe.isWindow( obj ) ) {
       	   		return false;
       	   	}
       	   	// 真数组、伪数组
       	   	return type === 'array'|| length === 0||
       	   		typeof length === 'number' && length > 0 
       	   		&& (length-1) in obj;
       },
       isFunction:function ( obj ){
       	   return joe.type ( obj ) === 'function';
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
