(function(win){

	// 碰撞检测函数
	var _collision  = function(aabb1,aabb2){
		return !(aabb1.max.x < aabb2.min.x || aabb1.max.y < aabb2.min.y || aabb2.max.x < aabb1.min.x || aabb2.max.y < aabb1.min.y);
	};

	var CanvasTools = {
		createNew : function(map){

			var $map = map.getMap(), $canvasTools = $map.find('#canvas-tools');

			var canvasTools = {
				$canvasTools : $canvasTools ,
				iScroll : null
			};

			canvasTools.hide = function(){
				$canvasTools.hide();
			};

			canvasTools.show = function(){
				$canvasTools.show();
			};

			// 滑动工具
			$canvasTools.find('.scroll').click(function(){
				$(this).addClass('active').siblings('.selectable').removeClass('active');
				var scroll = canvasTools.iScroll;
				if(!scroll)
					scroll = new iScroll($map[0], { checkDOMChanges: true , hScrollbar: false, vScrollbar: false , zoom : true});

				scroll.scale = map.scale;
				scroll.enable();

				canvasTools.iScroll = scroll;
				$map.selectDestory().addClass('headCursor');
			});

			// 拖选工具
			$canvasTools.find('.selectable').click(function(){
				$(this).addClass('active').siblings('.scroll').removeClass('active');
				var scroll = canvasTools.iScroll;
				// 停止使用拖拽工具
				if(scroll)
					scroll.disable();

				// 启用拖选工具
				$map.selectable(map, {
					callback: function($selectable){
						var position = $selectable.position();

						var aabb1 = {
							max:{ 
								x: position.left + $selectable.width(),
								y: position.top + $selectable.height()
							},
							min:{
								x: position.left,
								y: position.top
							}
						};

						var aabb2 = null; 

						map.updateWidgetState();
						map.removeSelect();
						// 检测div中的组件
						$.each(map.widgetList, function(i, widget){
							var $widget = widget.$widget;
							var left = widget.left , top = widget.top;
							aabb2 = {
								max:{ 
									x: left + widget.width,
									y: top + widget.height
								},
								min:{
									x: left,
									y: top
								}
							};
							// 碰撞检测
							if(_collision(aabb1 , aabb2)){
								widget.actived();
								map.addSelect(widget);
							}
							aabb2 = null;
						});

						map.updateLineState();
						// 检测svg 中的线段对象
						$.each(map.lineList,function(i, line){

							var svgLine = line.svgLine;
							var x1 = svgLine.getAttribute('x1'), y1 = svgLine.getAttribute('y1'), x2 = svgLine.getAttribute('x2'), y2 = svgLine.getAttribute('y2');
							aabb2 = {
								max:{ 
									x: Math.max(x1, x2),
									y: Math.max(y1, y2)
								},
								min:{
									x: Math.min(x1, x2),
									y: Math.min(y1 ,y2)
								}
							};

							// 碰撞检测
							if(_collision(aabb1 , aabb2)){
								line.actived();
								map.addSelect(line);
							}
							aabb2 = null;
						});
					}
				}).removeClass('headCursor');
			});

			// 放大工具
			$canvasTools.find('.zoom-in').click(function(){
				var scale = map.scale;
				scale += 0.1;
				if(scale >= 2 )
					return ;
				map.getDivCanvas().css('transform','scale('+ scale +')');
				map.scale = scale;
			});

			// 缩小工具
			$canvasTools.find('.zoom-out').click(function(){
				var scale = map.scale;
				scale -= 0.1;
				if(scale <= 0.6 )
					return ;
				map.getDivCanvas().css('transform','scale('+ scale +')');
				map.scale = scale;
			});

			canvasTools.init = function(){
				$canvasTools.find('.selectable').trigger('click');
			};
			canvasTools.init();
			map.CanvasTools = canvasTools;
			return canvasTools;
		}
	};

	win.oa.maps.CanvasTools = CanvasTools;
})(window);