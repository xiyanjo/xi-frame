/*
* @Author: joe
* @Date:   2017-03-21 19:01:36
* @Last Modified by:   Administrator
* @Last Modified time: 2017-03-22 23:43:57
*/
( function ( global ){
	var document = global.document;
	var arr = [];
	var push = arr.push;
	var slice = arr.slice;

	function joe ( selector ){
		return new init( selector );
	}
	joe.fn = joe.prototype = {
		constructor:joe,
		length:0,//joe是伪数组对象，默认length属性为0 
		each: function ( callback ){
			joe.each( this,callback );
			return this;
		},
		// 将joe对象转为真数组
		toArray: function (){
			return slice.call( this );
		},
		// 根据索引获取dom对象
		get: function ( index ){
			if ( index == null ) {
				return this.toArray();
			}
			return  this[ index<0 ? this.length+index:index ] ;
		},
		// 根据索引获取joe对象
		eq:function ( index ){
     		return joe( this[ index < 0 ? this.length + index : index ] );
		},
		first: function (){
			return this.eq(0);
		},
		last: function (){
			return this.eq(-1);
		},
		splice:arr.splice//鸭子模型 以真数组形式显示
	};
	// joe对象
	var init = joe.fn.init = function ( selector ){
		if ( !selector ) {
			return this;
		} else if ( joe.isString( selector )) {
			if ( joe.isHTML( selector ) ) {
				push.apply( this,joe.parseHTML( selector ) );
			} else {
				push.apply( this,document.querySelectorAll( selector ) );
			} 
		} else if ( joe.isDOM( selector ) ) {
			this[ 0 ] = selector;
			this.length = 1;
		} else if ( joe.isArrayLike( selector ) ) {
			push.apply( this,selector );
		} else if ( joe.isFunction( selector ) ){
			document.addEventListener( 'DOMContentLoaded',function (){
				selector();
			} );
		}
	};
	init.prototype = joe.fn;
// joe工厂函数,joe原型的扩展方法
	joe.extend = joe.fn.extend = function (){
		var args = arguments,
			i = 0,
			l = args.length,
			obj,
			target = this;
		if ( l>1 ) {
			target = args[ 0 ] || {};//target的类型默认为对象
			i = 1;//若第一个为目标元素则从第二个元素遍历
		}
		
		for (; i < l; i++) {
			obj = args[ i ];
			for( var k in obj ){
				if ( obj.hasOwnProperty( k ) ) {
					target[ k ] = obj[ k ];
				}
			}
		}
		return target;
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
		},
		// 遍历
		each: function ( obj,callback ){
			var i=0,
				l;
			// 数组伪数组
			if ( joe.isArrayLike( obj ) ) {
				l = obj.length;
				for ( ;i<l;i++ ){
					// 功能 return false 循环结束,this的指向为遍历到的每一项
					if ( callback.call( obj[i],i,obj[i] ) === false) {
						break;
					}
				}
			// obj为对象
			} else {
				for( i in obj ){
					if ( callback.call(obj[i],i,obj[i]) ===false ) {
						break;
					}
				}
			}
			return obj;
		},
		unique: function ( arr ){
			var ret = [];
			joe.each( arr,function ( i,elem){
				// 表示ret不含当前元素
				if( ret.indexOf( elem ) === -1){
					ret.push( elem );
				}
			} )
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
	

	// DOM操作模块
	joe.fn.extend( {
		appendTo: function ( target ){
			var that = this;
			var ret = [],
				node;
			target = joe( target );
			// 目标位置元素遍历
			target.each( function ( i,elem ){
				// 要追加的遍历
				that.each( function (){
					// 若为第一个要追加的dom元素则不复制，以后都要复制
					node = i === 0? this:this.cloneNode(true);
					ret.push( node );
					elem.appendChild( node );
				} )
			} )
     		return joe( ret );
		},
		append: function ( source ){
			source = joe( source );
			source.appendTo( this );
			return this;
		},
		prependTo: function ( target ){
            var ret = [],
           		that = this,
           		node,
           		firstChild;
           	target = joe( target );
           	target.each( function ( i,elem ){
           		firstChild = elem.firstChild;
           		that.each( function (){
           			node = i === 0 ?this :this.cloneNode( true );
           			ret.push( node );
           			// insertBefore( 要添加的元素，要添加 的位置)
           			elem.insertBefore( node,firstChild );
           		} )
           	} )
           	return joe( ret );
		},
		prepend: function ( source ){
			source = joe( source );
			source.prependTo( this );
			return this;
		},
		next: function (){
			var ret = [];
			this.each( function ( i,elem ){
				while( ( elem = elem.nextsibling ) && elem.nodeType !== 1 ){} 
				if ( elem != null ) {
					ret.push( elem );
				}
			} );
			return joe( ret );
		},
		nextAll: function (){
			var ret = [];
			this.each( function ( i,elem ){
				var node = elem.nextSibling;
				// （判断条件）
				while( node ){
					if( node.nodeType === 1 ){
						ret.push( node );
					}
					node = node.nextSibling;
				}
			} )
			return joe( joe.unique( ret ) ); 
		},
		remove: function (){
			return this.each( function (){
				this.parentNode.removeChild( this );
			} );
		},
		empty:function (){
			return this.each( function () {
        		this.innerHTML = '';
      		} );
		}
	} )

	// Ajax 模块
	// w3c和ie兼容
	function createRequest (){
		return window.XMLHttpRequest ?
			new window.XMLHttpRequest() :
			new window.ActiveXObject( 'XMLHTTP' );
	}
	// 格式化数据
	function formatData( data ){
		var k,
			ret = [];
		for( k in data ){
			ret.push( window.encodeURLComponent( k )+'='+
				window.encodeURLComponent( data[ k ] ) );
		}
		return ret.join( '&' );
	}
	// 设置默认值
	joe.extend( {
		ajaxSetting: {
			url: '',
			type: 'get',
			data: {},
			datatype: 'json',
			success: null,
			fail: null,
			async: true,
			contentType: 'application/x-www-form-urlencoded',
			jsonp: 'callback',
			jsonpCallback: '',
			timeout: 0
		},
		ajax: function ( config ){
			// 过滤无效值
			if ( !config || !config.url ) {
				return;
			}
		}
	} )

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
