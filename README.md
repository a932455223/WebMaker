WebMaker
###2014-8-5 @popover 
> * 模块容器data-appid值必须与模块内容(<div id="popoverContent">下)class值一一对应
###2014-8-6 @dialog
> * <div id="dialogContent">为所有dialog内容容器
		    <div id="dialogContent">
				<div id="goodsDialog" title="test">
					<p>This is the default dialog whichth the 'x' icon.</p>
				</div> 
			...	
> * <a class="dialog" href="#" data-appid="goodsDialog">  点击class="dialog"元素触发dialog，该元素data-appid需与dialog内容ID对象
			如<div id="goodsDialog" ...
			
