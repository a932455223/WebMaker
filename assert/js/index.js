function dateFormate(date) {
    var d = new Date(date);
    var str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();;
    return str;
}
$(document).ready(function() {
    $('#btn_preview').on('click', function() {
        $.get('/pages').done(function(rp) {
            var content = $('#pagesList-tmpl').tmpl(rp);
            var table = '<table class="artTable">';
            table += '<tr><th>页面名称</th><th>操作</th><th>创建时间</th></tr>';
            for (var i = 0; i < content.length; i++) {
                table += content.eq(i)[0].outerHTML;
            }
            table += '</table>';
            var d = dialog({
                title: '这是标题',
                content: table
            });
            d.showModal();
            $('.artTable').off('click').on('click','.delete',function(){
            	$.post('/page/delete/'+this.dataset.id).done(function(rp){

            	});//end
            });
        });
    })

}); //docuemt
