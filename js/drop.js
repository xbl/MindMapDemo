(function($, doc){
	"use strict"; //启用严格模式

	$.fn.drop = function(options){
		var $doc = $(doc) , $clone = null, _beginDrag = false , _beginX = 0 , _beginY = 0;

		$doc.on('mousemove.drop',function(event) {
			if(!_beginDrag || !$clone)
				return ;
			var x = event.pageX - _beginX , y = event.pageY - _beginY;
			$clone.css({'top':y,'left':x});
		});

		var _remove = function(){
			$clone.remove();
			$clone = null;
		};

		return this.each(function(){
			var $this = $(this), oldx = 0,oldy = 0,$target = options.target;

			$this.on('mousedown.drop',function(event){
				_beginDrag = true;
				// 当前元素在页面的x、y
				_beginX = event.offsetX , _beginY = event.offsetY;
				
				// 拷贝当前元素及样式
				$clone = $this.clone().copyCSS($this);
				$clone.appendTo(doc.body).css({'position':'absolute','top':$this.offset().top,'left':$this.offset().left});
				// 记录当前的x、y
				oldx = $clone.css('top') , oldy = $clone.css('left');

				// 当鼠标抬起时
				$clone.on('mouseup.drop',function(event){
					_beginDrag = false;
					var x = event.pageX - _beginX , y = event.pageY - _beginY;
					var top = $target.offset().top,left = $target.offset().left,x2 = $target.width() + left,y2 = $target.height() + top;
					// 拖放到目标中
					if(x > left && x < x2 && y > top && y < y2){
						_remove();
						// 调用回调函数
						if(typeof options.callback === 'function')
							options.callback.apply(null,[$this,{'left' : event.pageX - left,'top' : event.pageY - top}]);
						return ;
					}
					// 回到元素的起始位置
					$clone.animate({
						top: oldx,
						left: oldy
					}, 200, _remove);

				});

				return false;
			});
		});
	};
	// 拷贝样式 原作者在这里:（http://upshots.org/javascript/jquery-copy-style-copycss）
	$.fn.copyCSS = function (source) {
		var dom = $(source).get(0);
		var dest = {};
		var style, prop;
		if (window.getComputedStyle) {
			var camelize = function (a, b) {
					return b.toUpperCase();
			};
			style = window.getComputedStyle(dom, null);
			if (style) {
				var camel, val;
				if (style.length) {
					for (var i = 0, l = style.length; i < l; i++) {
						prop = style[i];
						camel = prop.replace(/\-([a-z])/, camelize);
						val = style.getPropertyValue(prop);
						dest[camel] = val;
					}
				} else {
					for (prop in style) {
						camel = prop.replace(/\-([a-z])/, camelize);
						val = style.getPropertyValue(prop) || style[prop];
						dest[camel] = val;
					}
				}
				return this.css(dest);
			}
		}
		if (style = dom.currentStyle) {
			for (prop in style) {
				dest[prop] = style[prop];
			}
			return this.css(dest);
		}
		if (style = dom.style) {
			for (prop in style) {
				if (typeof style[prop] != 'function') {
					dest[prop] = style[prop];
				}
			}
		}
		return this.css(dest);
	};
})(jQuery, document);
