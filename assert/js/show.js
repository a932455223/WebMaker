$(document).ready(function(){
	// $.get('/getPage/551a011ce8a1e41c036cb9af',function(rp){
	// 	console.log(rp);
	// });
	var arrP = ["安徽", "北京", "福建", "甘肃", "广东", "广西", "贵州", "海南", "河北", "河南", "黑龙江", "湖北", "湖南", "吉林", "江苏", "江西", "辽宁", "内蒙古", "宁夏", "青海", "山东", "山西", "陕西", "上海", "四川", "天津", "西藏", " 新疆", "云南", "浙江", "重庆"];
	var arrC = ["安庆", "蚌埠", "巢湖", "池州", "滁州", "阜阳", "合肥", "淮北", "淮南", "黄山", "六安", "马鞍山", "宿州", "铜陵", "芜湖", "宣城", "亳州"];
	var arrA = ["怀宁县", "潜山县", "宿松县", "太湖县", "桐城市", "望江县", "岳西县", "枞阳县"];
	if($('.locationInfo').length > 0){//选择地址组件

		$('.locationInfo').on('click','.province',function(){
			$(this).addClass('active');
			var strLi = '';
			arrP.forEach(function(v){
				strLi += '<li>'+v+'</li>';
			});
			$('#locationList').html(strLi).parent().addClass('show').siblings().hide();
		});

		$('.locationInfo').on('click','.city',function(){
			$(this).addClass('active');
			var strLi = '';
			arrC.forEach(function(v){
				strLi+='<li>'+v+'</li>'
			});
			$('#locationList').html(strLi).parent().addClass('show').siblings().hide();
		});

		$('.locationInfo').on('click','.area',function(){
			$(this).addClass('active');
			var strLi = '';
			arrA.forEach(function(v){
				strLi+='<li>'+v+'</li>'
			});
			$('#locationList').html(strLi).parent().addClass('show').siblings().hide();
		});

		$('#locationList').on('click','li',function(){
			$('.locationInfo').find('.row.active').find('span').html($(this).html()).end().removeClass('active');
			$('#locationList').parent().removeClass('show').siblings().show();
		});
	}

	if($('.msgVerify').length > 0){
		$('.msgVerify').on('click','.code',function(){
			var $this = $(this);
			if($this.is('disable')){
				return false;
			}
			$this.addClass('disable');
			var count = 60;
			var time_id = setInterval(function(){
				if(count > 0){
					$this.html(count+'秒后获取');
					count--;
				}else{
					clearInterval(time_id);
					$this.html('获取验证码').removeClass('disable');
				}
			},1000);
		});
	}

	if($('.imgAd').length > 0){
		var slider = new TouchSlider({
			id:'imgList'
		});
	}

	try{
		if(magicData.length > 0){
		var prelen = $('.main').width()/4;
		var $box = $('<div>',{'class':'magicBox'}).appendTo('.main');
		var tds = $();
		for(var i=0;i<magicData.length;i++){
			var item = magicData[i];
			if(item.isDelete === 'true'){
				continue;
			}else{
				var pos = item.pos;
				var td = $('<div>',{'class':item.classList,'data-pos':pos});
				var r = parseInt(pos[0]);
				var c = parseInt(pos[1]);
				var colspan = parseInt(item.colspan||1);
				var rowspan = parseInt(item.rowspan||1);
				td.css({
					top:(r-1)*prelen,
					left:(c-1)*prelen,
					width:colspan*prelen,
					height:rowspan*prelen,
				});
				if(item.img){
					td.css({
						'background-image':'url(/'+item.img+')',
						'background-size':'100% 100%'
					});
				}
				tds.add(td);
				tds = tds.add(td);
			}
		}

		$box.append(tds);
	}
	}
	catch(e){
	}
});