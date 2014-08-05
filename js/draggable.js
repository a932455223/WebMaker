$('#drag-wrap').sortable();

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