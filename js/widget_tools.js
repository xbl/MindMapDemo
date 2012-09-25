(function(win){
	var WidgetTools = {
		createNew : function(map){
			var $widgetTools = map.getDivCanvas().find('#widget-tools');
			// 画线工具
			$widgetTools.find('.draw-line').click(function(){ 
				map.drawing = true;
			});

			// 编辑文字工具
			$widgetTools.find('.edit-text').click(function(){
				var widget = map.currentWidget;
				if(map.editable){
					widget.unedit();
					return ;
				}
				widget.editable();
			});

			var widgetTools = {
				$widgetTools : $widgetTools,
				left : 0,
				top : 0
			};

			widgetTools.hide = function(){
				widgetTools.$widgetTools.hide();
			};

			widgetTools.show = function(){
				$widgetTools.css({'left': widgetTools.left,'top': widgetTools.top}).show();
			};

			map.widgetTools = widgetTools;
			return widgetTools;
		}
	};

	win.oa.maps.WidgetTools = WidgetTools;
})(window);