(function(win){
	"use strict"; //启用严格模式

	var Widget = {
		createNew : function( option, map){

			var $widget = $('<div />',{'class':'widget'}).appendTo(map.getDivCanvas());

			var widget = {
				lines : [],
				$widget : $widget,
				centerX : 0,
				centerY : 0,
				left : 0,
				top : 0,
				width : $widget.outerWidth(),
				height : $widget.outerHeight(),
				type : ''
			};

			widget.addLine = function(line) {
				if(this.lines.indexOf(line) == -1)
					this.lines.push(line);
				return this.lines.length -1;
			};

			widget.removeLine = function(index) {
				delete this.lines[index];
			};

			widget.editable = function(){
				$widget.trigger('dblclick.widget');
			};

			widget.unedit = function(){
				$widget.trigger('unedit.widget');
			};

			widget.remove = function(){
				$widget.remove();
			};

			widget.actived = function(){
				$widget.addClass('widget-clicked');
			};

			if(option.type){
				widget.type = option.type;
				$widget.addClass(widget.type);
			}

			widget.centerX = parseInt(widget.width) / 2 ;
			widget.centerY = parseInt(widget.height) / 2;

			widget.top = option.top - widget.centerY;
			widget.left = option.left - widget.centerX;

			$widget.css({'top': widget.top,'left': widget.left});

			// 允许widget 可以拖拽，拖拽时回调函数
			$widget.drag(map , {
				move : function(pos){
				// 拖拽时隐藏 widget工具
				map.widgetTools.hide();
				widget.left = pos.left;
				widget.top = pos.top;

				// 计算widget的中心点
				var x = pos.left + widget.centerX;
				var y = pos.top + widget.centerY;

				// 拖动组件时移动关联的line
				$.each(widget.lines,function(i, lineObj){
					if(!lineObj)
						return ;
					if(lineObj.type === 'begin')
						lineObj.ele.setX1Y1( x, y);
					else 
						lineObj.ele.setX2Y2( x, y);
				});
			}});

			$widget.on('mouseup.widget',function(){ 
				// 当鼠标正在画的时候，且在当前widget下鼠标抬起，我们则认定所画的线连接到该widget
				if(!map.drawing)
					return ;
				map.currentWidget = widget;
			});

			$widget.on('click.widget',function(){
				// 此处记录当前widget ，显示widget 工具
				map.updateSelect(widget);
				map.currentWidget = widget;

				$widget.addClass('widget-clicked').siblings().removeClass('widget-clicked');
				// 此处更新svg 中子元素的选中状态
				map.updateLineState();

				var widgetTools = map.widgetTools;
				widgetTools.left = widget.left;
				widgetTools.top = widget.top - 50;
				widgetTools.show();

				return true;
			});

			// 编辑状态
			$widget.on('dblclick.widget',function(){
				this.contentEditable = true;
				map.editable = true;
				$widget.focus();
			}).on('keydown.widget',function(e){
				if(e.keyCode != 13)
					return ;
				$widget.trigger('unedit.widget');
			}).on('unedit.widget',function(e){
				this.contentEditable = false;
				map.editable = false;
			});

			//开启编辑状态和被选中状态
			$widget.trigger('dblclick.widget').trigger('click.widget');
			
			map.widgetList.push(widget);
			return widget;
		}
	};

	win.oa.maps.Widget = Widget;
})(window);