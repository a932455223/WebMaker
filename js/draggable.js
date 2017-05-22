$('#drag-wrap').sortable({
	stop:function(){
		//拖动时重新定位编辑框
		if(popover.target){
			popover.posTop = popover.target.offsetTop;
			popover.pos();
		}
	}
});

$('#add-ShopInfo').click(function(){
	$($('#header').html()).appendTo('#drag-wrap');
});

$('#add-txt-header').click(function(){
	$($('#txt-header').html()).appendTo('#drag-wrap');
});

$('#add-goods').click(function(){
	$($('#goods').html()).appendTo('#drag-wrap');
});

$('#add-footerMenu').click(function(){
	$($('#footerMenu').html()).appendTo('#mobile-footer');
});
/***simon.du 8月5日***/
$('#add-mobileVerify').click(function(){
	$($('#mobile-verify').html()).appendTo('#drag-wrap');
});

$('#add-location').click(function(){
	console.log($('#location').length);
	$($('#location').html()).appendTo('#drag-wrap');
});