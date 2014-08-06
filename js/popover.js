/**
 * @author liege
 * 2014-8-5 
 */

var popover = {
	layoutWrap:document.getElementById("popover"),
	posTop:0,
	target:null,
	moduleId:null,
};
popover.pos = function(){	
	// this.layoutWrap.style.top = this.posTop + "px";
	$(this.layoutWrap).animate({top:this.posTop + "px"},300) ;
	return this;
};
popover.loadContent = function(){
	this.moduleId = this.target.dataset.appid;
	var tmpl = $("#popoverContent").find("."+this.moduleId),
		DEBUG = {"name":"liege"};
	$.template("controlTmpl",tmpl);
	 $(".popover-inner").html($.tmpl("controlTmpl",DEBUG));	
};
$("#mobile-body").on("click",".module",function(e){
	$("#popover").show();
	popover.target = e.currentTarget;
	popover.posTop = e.currentTarget.offsetTop;	
	popover.pos().loadContent();
	return false;
});

//dialog
$(function() {
   $("#dialog").dialog({
      autoOpen: false,
      draggable:false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });
 
    $(".popover-inner").on("click",".dialog",function(e){
    	var elem = e.currentTarget;
        $("#"+elem.dataset.appid).dialog({
        	draggable:false
        });
    });
});
