(function($,doc){
	"use strict"; //启用严格模式

	$.fn.drag = function(map , options){
		var $doc = $(doc);
		return this.each(function(){
			var $this = $(this), $parent = $this.offsetParent();
			var beginX = 0 , beginY = 0 , beginDrag = false , pLeft = $parent.offset().left , pTop = $parent.offset().top;

			$this.on('mousedown.drag',function(event){
				// 事件在当前元素 x、y，即鼠标点击到该元素的偏移 
				beginX = event.offsetX, beginY = event.offsetY;
				beginDrag = true;
				return false;
			});

			// 当鼠标抬起时
			$this.on('mouseup.drag',function(event) {
				beginDrag = false;
			});

			$doc.on('mousemove.drag',function(e) {
				if(!beginDrag)
					return ;
				// 鼠标在页面上移动的事件坐标
				var x = (e.pageX / map.scale)  - pLeft ,y = (e.pageY / map.scale)  - pTop ,top = y - beginY , left = x - beginX;

				var pos = {'top': top,'left': left };
				$this.css(pos);
				if(typeof options.move === 'function'){
					options.move.call($this,pos);
				}
			});
		});
	};
	
})( jQuery, document);