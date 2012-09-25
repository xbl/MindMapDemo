(function(win , $){
	"use strict"; //启用严格模式

	var _lineBuilder = function(options){
		var svgLine = document.createElementNS ("http://www.w3.org/2000/svg", "line");
		svgLine.setAttributeNS(null, "x1", options.x1);
		svgLine.setAttributeNS(null, "y1", options.y1);
		svgLine.setAttributeNS(null, "x2", options.x2);
		svgLine.setAttributeNS(null, "y2", options.y2);
		svgLine.setAttribute("class", "line-normal"); // 添加class
		return svgLine;
	};

	var Line = {
		createNew: function(options, map){
			// 构造svg 的line 
			var svgLine = _lineBuilder(options);

			map.getSvgCanvas()[0].appendChild(svgLine);

			var line = {
				svgLine : svgLine ,
				begin : null,
				end : null,
				widgetIndex : 0
			};
			
			line.setX1Y1 = function( x1, y1) {
				svgLine.setAttributeNS(null, "x1", x1);
				svgLine.setAttributeNS(null, "y1", y1);
			};

			line.setX2Y2 = function( x2, y2) {
				svgLine.setAttributeNS(null, "x2", x2);
				svgLine.setAttributeNS(null, "y2", y2);
			};

			line.remove = function(){
				$(svgLine).remove();
			};

			line.actived = function(){
				$(svgLine).attr('class', 'line-clicked');
			};

			$(svgLine).on('click',function(){
				map.updateSelect(line);
				// 更新svg 的class
				$(this).attr('class', 'line-clicked').siblings().attr('class','line-normal');
				// 更新所有widget 的状态
				map.updateWidgetState();
			}).on('mousedown',function(){ // 当线段被选中按下的时候重新画线
				map.updateSelect(line);
				map.drawing = true;
				return false;
			});

			// 添加到map的数组里
			map.lineList.push(line);
			return line;	
		}
	};

	win.oa.maps.Line = Line;
})(window , jQuery);