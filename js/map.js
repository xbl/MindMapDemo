window.oa = window.oa || {};
oa.maps = oa.maps || {};

(function($, win, doc){
	"use strict"; //启用严格模式
	var $doc = $(doc);

	var Map = {
		createNew : function($map){

			var map = {
				$svgCanvas : $map.find('#svg-canvas'),
				$divCanvas : $map.find('#div-canvas'),
				$canvasTools : $map.find('#canvas-tools'),
				$map : $map,
				selectList : [],
				drawing : false,
				editable : false,
				currentWidget : null,
				scale : 1,
				widgetTools : {},
				widgetList : [],
				lineList : []
			};

			map.getSvgCanvas = function() {
				return this.$svgCanvas;
			};

			map.getDivCanvas = function() {
				return this.$divCanvas;
			};

			map.getMap = function() {
				return this.$map;
			};

			map.addSelect = function(obj){
				this.selectList.push(obj);
			};

			map.updateSelect = function(obj){
				this.selectList = [];
				this.selectList.push(obj);
			};

			map.removeSelect = function(){
				this.selectList = [];
			};

			map.getSelect = function(){
				return this.selectList;
			};

			map.updateLineState = function(){
				map.$svgCanvas.children().attr('class','line-normal');
			};

			map.updateWidgetState = function(){
				map.$divCanvas.children().removeClass('widget-clicked');
			};

			$doc.on('click.map',function(event){
				if(!map.drawing)
					return ;
				map.drawinging = true;
				var widget = map.currentWidget;
				if(!widget)
					return ;

				// 计算该元素的中心点
				var x = widget.left + widget.centerX;
				var y = widget.top + widget.centerY;

				var line = oa.maps.Line.createNew({x1: x, y1: y, x2: x, y2: y},map);
				widget.addLine({ ele : line, type: 'begin' });
				line.begin = widget;

				map.updateSelect(line);
				return false;
			});

			// 跟随鼠标画线
			$doc.on('mousemove.map',function(e) {
				if(!map.drawing)
					return ;
				var $divCanvas = map.$divCanvas;
				var line = map.selectList[0];

				// 鼠标在页面上移动的事件坐标
				var y = (e.pageY / map.scale) - $divCanvas.offset().top, x = (e.pageX / map.scale) - $divCanvas.offset().left;
				line.setX2Y2( x, y);
			});
			
			// 当正在画的同时，绑定元素
			$doc.on('mouseup.map',function(e){
				if(!map.drawing)
					return ;
				var line = map.selectList[0];
				if(map.currentWidget && line){
					var widget = map.currentWidget;
					// 计算该元素的中心点
					var x = widget.left + widget.centerX;
					var y = widget.top + widget.centerY;
					line.setX2Y2( x, y);

					// 如果该线段记录过widget，则在次widget中删除线段的记录
					var tempWidget = line.end;
					if(tempWidget)
						tempWidget.removeLine(line.widgetIndex);

					var index = widget.addLine({ ele : line, type: 'end' });
					line.end = widget;
					line.widgetIndex = index;

					map.currentWidget = null;
					map.selectList = [];
				}
				map.drawing = false;
			});

			// delete 删除元素
			$doc.on('keydown.map',function(e){
				if(e.keyCode === 46 && map.editable === false){
					map.widgetTools.hide();
					$.each(map.selectList , function(i, obj){
						obj.remove();
						obj = null;
					});
				}
			});

			return map;
		}
	};
	
	win.oa.maps.Map = Map;
})( jQuery, window, document);