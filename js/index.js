var d = document.getElementById('zoom');
var h = new Hammer(d);
var r = document.getElementById('result');
var flag = true;
h.ontransform = function(e){
	if(flag){
		flag =false;
		setTimeout(function(){
			flag =true;
			r.innerHTML = e.scale;
		},50);
	}
}