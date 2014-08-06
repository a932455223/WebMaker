/**
 * @author liege
 * 2014-8-5 
 */

var popover = {
	layoutWrap:document.getElementById("popover"),
	posTop:0,
	target:null,
	moduleId:null
};
popover.pos = function(){
	this.layoutWrap.style.top = this.posTop + "px";
	return this;
};
popover.loadContent = function(){
	var tmpl = $("#popoverContent").find("."+this.moduleId),
		DEBUG = {"name":"liege"};
	$.template("controlTmpl",tmpl);
	 $(".popover-inner").html($.tmpl("controlTmpl",DEBUG));	
};
$("#mobile-body").on("click",".module",function(e){
	popover.target = e.currentTarget;
	popover.moduleId = e.currentTarget.dataset.appid;
	popover.posTop = e.currentTarget.offsetTop;
	popover.pos().loadContent();
	return false;
});
