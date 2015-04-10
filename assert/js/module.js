/**
 * @author Administrator
 */
/*
	component :一个组件的对象
	container:插入的容器的选择符号
*/

//把组件加载进入视口
// @component:对象，属性id值为按钮data-relateid值
function addComponentToView(component,container){
	if(!container){
		container = '#editor_body';
	}
	// var mod = $('#'+components[component.id]+'_tmpl').find("div.module");
	// mod.attr({"data-identity":components[component.id],"data-index":component.id,"data-form":JSON.stringify(component)});
	var $com = $('#'+components[component.id]+'_tmpl').tmpl(component).appendTo(container)
	.attr({"data-identity":components[component.id],"data-index":component.id,"data-form":JSON.stringify(component)});
	// addContorlBtn($('#'+components[component.id]+'_tmpl').find(".moduleWrap"));
	if(component.id === 16){
		$com.find('button').css(component.content);
	}
	addContorlBtn($com);

}
//重新加载组件
/*
$com:视口容器中得组件的jq包装集
config:从新渲染它用到的配置
usage:  在page1时运行:  
var $img = $('.img').parent();
refreshComponent($img,{id:2,src:'http://www.baidu.com/img/baidu_sylogo1.gif'});
*/
function refreshComponent($com,config){
	var target= $('#'+components[config.id]+'_tmpl').tmpl(config);
	$com.html(target.html());
	$com.find(".module").addClass("current");
	addContorlBtn($com);
	popover.target = $com.find('div')[0];
}

//加载组件
//@ components:数组[{},{},{}]，值为要加载的模块数据{}
function loadDefaultComponent(components){
	if(components.length  == 0){
		return;
	}
	components.forEach(function(com){
		addComponentToView(com);
	});
}

//加载按钮 
//btns:数组，元素为数字，用来标识按钮类别。每一个元素为一个按钮
function loadDefaultBtn(btns){
	if(btns.length == 0){
		return;
	}
	//根据不同的按钮类别，来生成不同的按钮html模板
	//text为按钮value，id为按钮data-relateid值，type为对应模块类型
	btns.forEach(function(btn){
		try{
			$('#btn_Tmpl').tmpl({id:btn,text:btnText[btn],type:components[btn]}).appendTo('#btn_container');
		}catch(e){
			console.log('enter the catch');
		}
	});
}

//添加模块控制按钮
function addContorlBtn($container){
	// var wrap = "<div class='btnWrap'><span class='edit'>编辑</span>";
	var wrap = "<div class='btnWrap'>";
		// wrap += "<span class='add'>添加</span>";
		wrap += "<span class='del'>删除</span>";
		wrap += "</div>";
	$container.append(wrap);	
}
