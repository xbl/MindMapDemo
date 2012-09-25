(function($, doc){
	"use strict"; //启用严格模式

	$.fn.selectable = function(map , options){
		var $doc = $(doc);
		return this.each(function(){

			var $this = $(this),$selectable = null , _catchLeft = 0 , _catchTop = 0;
			$this.on('mousedown.selectable',function(event){
				if(event.target.tagName.toLowerCase() !== 'svg')
					return true;
				// 事件在当前元素 x、y，即鼠标点击到该元素的偏移 
				_catchLeft =  event.offsetX * map.scale , _catchTop = event.offsetY * map.scale;
				$selectable = $('<div />',{'class' : 'selectable-box'}).css({'left' : _catchLeft, 'top': _catchTop }).appendTo($this);
				
				return false;
			});

			$doc.on('mouseup.selectable',function(event) {
				if(!$selectable)
					return ;
				if(typeof options.callback === 'function')
					options.callback.call(null, $selectable);
				$selectable.remove();
				$selectable = null ,_catchLeft = 0 , _catchTop = 0;

			}).on('mousemove.selectable',function(e) {
				if(!$selectable)
					return ;
				var pageX = e.pageX, pageY = e.pageY, left = $this.offset().left, top = $this.offset().top;
				// 向右
				if(pageX > _catchLeft){
					$selectable.width(pageX - $selectable.offset().left);
				}
				else if(_catchLeft > pageX){ // 向左
					var tempLeft = pageX - left;
					$selectable.css({'left' : tempLeft }).width(Math.abs(tempLeft - _catchLeft));
				}
				// 向下
				if(pageY > _catchTop){
					$selectable.height(pageY - $selectable.offset().top);
				}
				else if(_catchTop > pageY){ // 向上
					var tempTop = pageY- top;
					$selectable.css({'top' : tempTop }).height(Math.abs(tempTop - _catchTop));
				}
			});
		});
	};

	$.fn.selectDestory = function(){
		return this.each(function(){
			$(this).off('mousedown.selectable');
		});
	};
	
})(jQuery, document);