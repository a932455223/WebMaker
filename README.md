WebMaker
###2014-8-5 @popover 
> * 模块容器data-appid值必须与模块内容(&lt;div id="popoverContent"&gt;下)class值一一对应
###2014-8-6 @dialog
> * &lt;div id="dialogContent"&gt;为所有dialog内容容器<br>
		    ```&lt;div id="dialogContent"&gt;
				&lt;div id="goodsDialog" title="test"&gt;
					&lt;p&gt;This is the default dialog whichth the 'x' icon.&lt;/p&gt;
				&lt;/div&gt; ...
			```
> * &lt;a class="dialog" href="#" data-appid="goodsDialog"&gt; 点击class="dialog"元素触发dialog，该元素data-appid需与dialog内容对象ID一致<br>
			```&lt;div id="goodsDialog" ...
			```
			
