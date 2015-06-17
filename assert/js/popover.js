//@popover
//target 模块内容div节点，tmpl模板，包含html内容与属性变量
//wrap 模块容器li节点，存储data-from
//data 缓存于li=》data-from属性，内容模板、编辑框模板皆以data为渲染数据对象
var isMousedown = false;
var step = 0;
var popover = {
    layoutWrap: document.getElementById("popover"),
    posTop: 0,
    target: null,
    wrap: null,
    moduleId: null,
    data: null
};

//隐藏编辑框
popover.hide = function() {
    this.layoutWrap.style.display = "none";
};
//定位
popover.pos = function() {
    $(this.layoutWrap).animate({
        top: this.posTop + "px"
    }, 300);
    return this;
};
//载入内容
popover.loadContent = function() {
    var _this = this;
    _this.moduleId = $(_this.target).parent("li")[0].dataset.identity;
    var tmpl = $("#popoverContent").find("." + _this.moduleId);
    $.template("controlTmpl", tmpl);
    $(".popover-inner").html($.tmpl("controlTmpl", _this.data));
};
//载入内容
popover.loadContentRep = function() {
    var _this = this;
    _this.target = $(_this.wrap).find(".module")[0];
    _this.moduleId = $(_this.wrap)[0].dataset.identity;
    var tmpl = $("#popoverContent").find("." + _this.moduleId);
    $.template("controlTmpl", tmpl);
    $(".popover-inner").html($.tmpl("controlTmpl", _this.data));
};
//载入btn
popover.loadBtn = function() {
    if (!$(".popover-inner div").hasClass("add_field")) {
        var btn = $(".add_field").clone(true);
        $(".popover-inner").html(btn);
    }
};

function magicBlur() {
    isMousedown = false;
}

$(document).on('mouseup', magicBlur);
$(document).on('blur', magicBlur);

//公用的上传代码
function initUploader(target_id){
	 var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'pick_files', // you can pass in id...
            container: document.getElementById('container'), // ... or DOM Element itself
            url: '/upload',
            flash_swf_url: '../js/Moxie.swf',
            silverlight_xap_url: '../js/Moxie.xap',
            multipart_params:{
                target_id:target_id
            },
            multi_selection:false,
            filters: {
                max_file_size: '10mb',
                mime_types: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }, {
                    title: "Zip files",
                    extensions: "zip"
                }]
            },

            init: {
                PostInit: function() {
                    document.getElementById('filelist').innerHTML = '';
                    $('#container').on("click", "#upload_files", function() {
                        uploader.start();
                        return false;
                    });
                },

                FilesAdded: function(up, files) {
                	var $filelist = $('#filelist');
                    plupload.each(files, function(file) {
                       var partial = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                        $filelist.append(partial);
                    });
                },
                FileUploaded: function(up, file, res) {
                    var rs = JSON.parse(res.response);
                    for (var i in rs) {
                        console.log(i);
                    }
                    if (rs.code === 200) {
                        var img = new Image();
                        img.src = rs.path;
                        // $('#popover').find('.img_list').append($('<li>').append(img))；
                        if($('.ui-dialog').find('.piclist').length > 0){
                            var $imgBox = $('.ui-dialog').find('.piclist');
                        }else{
                            var $imgBox = $('#popover').find('.img_list');
                        }
                        $imgBox.append($('<li>').append(img));
                    }
                },
                UploadProgress: function(up, file) {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                },

                Error: function(up, err) {
                    document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                }
            }
        });
        uploader.init();
}
popover.magicBox = function() {
        $(document).off('click');
        //找到要复制到左侧的行单元格
        function mapMagic() {
            var arry = [];
            for (var i = 1; i < 5; i++) {
                for (var k = 1; k < 5; k++) {
                    var temp = $('#magicTable').find('.item[data-pos=' + (i + '' + k) + ']');
                    if (temp.length === 0 || temp.is('.merge') || temp.is('.selected')) {
                        arry.push(i);
                        break;
                    }
                }
            }
            return arry.sort();
        }

        function copyMagic() {
            var copyRows = mapMagic();
            if (copyRows.length === 0) {
                return false;
            }
            var $container = $('#editor_body').find('.current.module');
            var _w = $container.width() / 4;
            var $box = $('<div>').css({
                position: 'relative'
            });
            var magicData = [];
            $box.css({
                height: copyRows.length * _w
            });
            for (var i = 0; i < copyRows.length; i++) {
                for (var k = 1; k < 5; k++) {
                    var copyForm = $('#magicTable').find('.item[data-pos=' + (copyRows[i] + '' + k) + ']');
                    var magicDataItem = {
                        isDelete: false
                    };
                    magicData.push(magicDataItem);
                    magicDataItem.pos = copyRows[i] + '' + k;
                    if (copyForm.length === 0) {
                        magicDataItem.isDelete = true;
                        continue;
                    }
                    var rowspan = copyForm.attr('rowspan') || 1;
                    var colspan = copyForm.attr('colspan') || 1;
                    var pos = copyForm[0].dataset.pos;
                    magicDataItem.rowspan = rowspan;
                    magicDataItem.colspan = colspan;
                    magicDataItem.classList = copyForm[0].className;
                    magicDataItem.img = copyForm[0].dataset.img;
                    if (copyForm.attr('deletearry')) {
                        magicDataItem.deletearry = copyForm.attr('deletearry');
                    }
                    var top = i * _w;
                    var left = (parseInt(pos[1] - 1) * _w);
                    var $item = $('<div>').css({
                        width: _w * colspan,
                        height: _w * rowspan,
                        top: top,
                        left: left,
                        position: 'absolute'
                    });
                    if (copyForm.is('.selected')) {
                        var $img = $('<img>').attr('src', copyForm.attr('data-img')).css({
                            width: '100%',
                            height: '100%'
                        });
                        $item.append($img);
                    }
                    $box.append($item);
                }
            }
            $container.parent().attr('magicform', JSON.stringify(magicData));
            $container.css('height', 'auto').empty();
            $box.appendTo($container);
        }

        function createTd(k, j) {
            var td = $('<div>', {
                class: 'item',
                'data-pos': k.toString() + j
            });
            var top = (k - 1) * 50 + k;
            var left = (j - 1) * 50 + j;
            td.css({
                top: top,
                left: left
            });
            return td;
        }
        var $magic = $('#magicTable').html('');
        //初始化magic
        var data = JSON.parse($('#editor_body').find('li.current').attr('magicform'));
        var tds = $();
        if ($.isEmptyObject(data)) {
            for (var k = 1; k < 5; k++) {
                for (var j = 1; j < 5; j++) {
                    var td = createTd(k, j);
                    tds = tds.add(td);
                }
            }
        } else {
            var firstR = parseInt(data[0].pos[0]);
            var lastR = parseInt(data[data.length - 1].pos[0]);
            if (firstR > 1) {
                for (h = 1; h < firstR; h++) {
                    for (var z = 1; z < 5; z++) {
                        var td = createTd(h, z);
                        tds = tds.add(td);
                    }
                }
            }

            var _rTemp = firstR;
            for (var index in data) {
                var item = data[index];
                if (item.isDelete) {
                    _rTemp = parseInt(item.pos[0]);
                    continue;
                } else {
                    var r = parseInt(item.pos[0]);
                    var r_diff = r - _rTemp;
                    if (r_diff > 1 && (!data[index - 1].rowspan || data[index - 1].rowspan <= 1)) {
                        for (var f = _rTemp + 1; f < _rTemp + r_diff; f++) {
                            for (var g = 1; g < 5; g++) {
                                var td = createTd(f, g);
                                tds = tds.add(td);
                            }
                        }
                    }

                    _rTemp = r;
                    var td = $('<div>');
                    td.attr({
                        'data-pos': item.pos
                    });
                    var c = parseInt(item.pos[1]);
                    var top = (r - 1) * 50 + r;
                    var left = (c - 1) * 50 + c;
                    td.css({
                        top: top,
                        left: left
                    });
                    if (item.rowspan > 1) {
                        td.attr('rowspan', item.rowspan);
                        td.height(item.rowspan * 51 - 1);
                    }
                    if (item.colspan > 1) {
                        td.attr('colspan', item.colspan);
                        td.width(item.colspan * 51 - 1);
                    }
                    if (item.img) {
                        td.attr('data-img', item.img);
                    }
                    if (item.deletearry) {
                        td.attr('deletearry', item.deletearry);
                    }
                    td.addClass(item.classList);
                    tds = tds.add(td);
                }
            }

            if (lastR < 4) {
                for (l = lastR + 1; l < 5; l++) {
                    for (var x = 1; x < 5; x++) {
                        var td = createTd(l, x);
                        tds = tds.add(td);
                    }
                }
            }

        }

        $magic.append(tds);

        $magic.on('mousedown', '.item', function() {
            $magic.find('.item').removeClass('keyactive start');
            isMousedown = true;
            var src = $(this).addClass('keyactive start').attr('data-img');
            src = src || 'images/imgError.jpg';
            $('#magicBox-img').attr('src', src);
        });

        $magic.on('mouseenter', '.item', function() {
            if (isMousedown && !$('.start').is('.merge')) {
                var rIndex = parseInt(this.dataset.pos[0]);
                var cIndex = parseInt(this.dataset.pos[1]);
                var startR = parseInt($('.start')[0].dataset.pos[0]);
                var startC = parseInt($('.start')[0].dataset.pos[1]);
                if (startR > rIndex || startC > cIndex) {
                    return false;
                }

                var activeArry = [];
                for (var i = 1; i < 5; i++) {
                    for (var k = 1; k < 5; k++) {
                        if (i >= startR && i <= rIndex && k >= startC && k <= cIndex) {
                            activeArry.push(i + '' + k);
                        } else {
                            $('#magicTable').find('.item[data-pos=' + (i + '' + k) + ']').removeClass('keyactive');
                        }
                    }
                }

                var flag = true;
                for (j = 0; j < activeArry.length; j++) {
                    var temp = $('#magicTable').find('.item[data-pos=' + activeArry[j] + ']');
                    if (temp.length === 0 || temp.is('.merge')) {
                        flag = false;
                    }
                }

                if (flag) {
                    for (var h = 0; h < activeArry.length; h++) {
                        $('#magicTable').find('.item[data-pos=' + activeArry[h] + ']').addClass('keyactive');
                    }
                }


            }

        }); // end mouseenter

        $('#merge-btn').on('click', function() {
            if ($('.keyactive').length <= 1) {
                alert('合并操作需要至少两个单元格');
                return false;
            }
            var activePos = [];
            $('.keyactive').each(function() {
                activePos.push(parseInt(this.dataset.pos));
            });

            var maxPos = Math.max.apply({}, activePos)
            var last = $('.keyactive[data-pos=' + maxPos + ']');
            var start = $magic.find('.start');
            var lr = last[0].dataset.pos[0];
            var lc = last[0].dataset.pos[1];
            var sr = start[0].dataset.pos[0];
            var sc = start[0].dataset.pos[1];
            var _h = (lr - sr + 1) * 50 + (lr - sr);
            var _w = (lc - sc + 1) * 50 + (lc - sc);
            var deleteArry = [];
            $('#magicTable').find('.keyactive:not(.start)').each(function() {
                deleteArry.push(this.dataset.pos);
                $(this).remove();
            });

            start.addClass('merge').removeClass('start').attr({
                'deleteArry': JSON.stringify(deleteArry),
                'rowspan': (lr - sr + 1),
                'colspan': (lc - sc + 1)
            });
            start.css({
                width: _w,
                height: _h
            });
        });

        $('#split-btn').on('click', function() {
            var $merge = $('.keyactive.merge');
            if ($merge.length > 0) {
                var deleteArry = JSON.parse($('.keyactive.merge').attr('deleteArry'));
                deleteArry.forEach(function(val) {
                    var r = parseInt(val[0]);
                    var c = parseInt(val[1]);
                    var t = (r - 1) * 50 + r;
                    var l = (c - 1) * 50 + c;
                    var prePos = parseInt(val[1]) === 1 ? (parseInt(val[0]) - 1) + '4' : parseInt(val) - 1;
                    var $preItem = $('#magicTable').find('.item[data-pos=' + prePos + ']');
                    while ($preItem.length === 0) {
                        prePos = prePos - 1;
                        if (prePos.toString()[1] === '0') {
                            prePos = (parseInt(prePos.toString()[0]) - 1) + '4';
                            prePos = parseInt(prePos);
                        }
                        $preItem = $('#magicTable').find('.item[data-pos=' + prePos + ']');
                    }
                    $preItem.after($('<div>').css({
                        top: t,
                        left: l
                    }).addClass('item').attr('data-pos', val));
                });
                $merge[0].style.removeProperty('width');
                $merge[0].style.removeProperty('height');
                $merge.removeAttr('deletearry rowspan colspan');
                $merge.removeClass('merge');
                copyMagic();
            } else {
                alert('请选择一个合并过的单元格');
                return false;
            }
        }); //end split

        $('#magicBox-img').on('click', function() {
            var $boxes = $('#magicTable').find('.keyactive');
            if ($boxes.length > 1 || $boxes.length === 0) {
                alert('亲，您选中了' + $boxes.length + '个方格，我把图片放到哪里呢');
                return false;
            }
            popover.d = dialog({
                title: '选择图片',
                content: $('#selectImg').tmpl({
                    list: [{
                        src: 'images/xxximg.jpg'
                    }, {
                        src: 'images/xxximg01.jpg'
                    }, {
                        src: 'images/xxximg02.jpg'
                    }, {
                        src: 'images/xxximg03.jpg'
                    }]
                })
            });
            popover.d.show();
        }); //end magicImage

        $(document).on('click.magicBox', '.piclist>li', function() {
            var src = $(this).find('img').attr('src');
            $('#magicTable').find('.keyactive').addClass('selected').attr('data-img', src);
            $('#magicBox-img').attr('src', src);
            copyMagic();
            popover.d.close();
        }); //end document

        $('#reset-btn').on('click', function() {
            var $container = $('#editor_body').find('.current.module').html('').height(45);
            $container.parent().attr('magicform', '{}');
            popover.loadContent();
            popover.magicBox();
        }); //end reset
    } // end popover.magicBox

//富文本编辑器
popover.fullText = function() {
    //编辑器
    var _this = this;
    var K = window.KindEditor;
    var data = _this.getDataForm();
    window.editor = K.create('textarea', {
        allowFileManager: true,
        dialogAlignType: "",
        langType: 'zh-CN',
        width: '100%',
        autoHeightMode: true,
        items: ['source', 'preview', 'undo', 'redo', 'plainpaste', 'justifyleft', 'justifycenter',
            'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent',
            'outdent', 'subscript', 'superscript', 'formatblock', 'fontname', 'fontsize',
            'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough',
            'removeformat', 'hr', 'link', 'unlink', 'fullscreen', 'lineheight', 'clearhtml'
        ],
        //初始化回调
        afterCreate: function() {
            this.html(data.content);
            _this.str1 = _this.target.dataset.identity;
        },
        //编辑器发生改变后执行
        afterChange: function() {
            var thisEditor = this;
            // @editor.text() 文本内容
            // @setTimeout 初始化编辑器时会先触发此回调，导致内容清空
            _this.tiemr = setTimeout(function() {
                _this.str2 = _this.target.dataset.identity;
                clearTimeout(_this.tiemr);
                //判断被编辑模块 target 是否发生改变
                if (_this.str1 == _this.str2) {
                    data.content = thisEditor.html();
                    _this.target.innerHTML = data.content;
                    $(_this.target).parent()[0].dataset.form = JSON.stringify(data);
                }
            }, 100);
        }
    });
    // editor.sync(".txt");
    // K.sync("title")	
    return true;
};

//customerBtn
popover.customerBtn = function() {
        var _this = this;
        //图片上传插件
       initUploader(5);
        var initData = JSON.parse(_this.wrap.dataset.form);
        // console.log(JSON.stringify(content.color));

        var backgroundImage = initData.content['background-image'];

        //高亮选中图片
        if (backgroundImage) {
            $('.img_list').find('img').each(function(index) {
                var src = this.src;
                if (src.indexOf(backgroundImage) > 0) {
                    $(this).addClass('active');
                }
            });
        }

        //加载图片
        $.post('/images/5').done(function(data){
            var str = '';
            for(var i=0;i<data.length;i++){
                str += '<li><img src='+data[i].src+' /></li>';
            }
            $('#popover').find('.img_list').html(str);
        });
        //spectrum 颜色选择组件
        var $btn = $(_this.target).find('button');
        $('#text_color').spectrum({
            // color:'#fff',
            clickoutFiresChange: true,
            move: function(color) {
                $btn.css('color', color.toHexString());
            },
            change: function(color) {
                var wrap = $(_this.wrap)[0];
                var formData = JSON.parse(wrap.dataset.form);
                formData.content.color = color.toHexString();
                wrap.dataset.form = JSON.stringify(formData);
            }
        });

        $('#bg_color').spectrum({
            // color:'#ffa200',
            clickoutFiresChange: true,
            move: function(color) {
                $btn.css('background-color', color.toHexString());
            },
            change: function(color) {
                var wrap = $(_this.wrap)[0];
                var formData = JSON.parse(wrap.dataset.form);
                formData.content['background-color'] = color.toHexString();
                wrap.dataset.form = JSON.stringify(formData);
            }
        });

        //btnText的change事件
        var timeid;
        $('#edit_btnText').on('focus', function() {
            var $this = $(this);
            $this.select();
            timeid = setInterval(function() {
                var wrap = $(_this.wrap)[0];
                var formData = JSON.parse(wrap.dataset.form);
                formData.content.btnText = $this.val();
                $btn.html($this.val());
                wrap.dataset.form = JSON.stringify(formData);
            }, 400);
        });

        $('#edit_btnText').on('blur', function() {
            if (timeid) clearInterval(timeid);
            if ($(this).val().trim() === '') {
                $(this).val('这是一个按钮');
                $btn.html('这是一个按钮');
            }
        });

        $('.img_list').on('click', 'li', function() {
            var wrap = $(_this.wrap)[0];
            var formData = JSON.parse(wrap.dataset.form);
            var $this = $(this);
            if ($this.find('img').is('.active')) {
                $this.find('img').removeClass('active');
                $btn[0].style.removeProperty('background-image');
                delete formData.content['background-image'];
            } else {
                var imgSrc = $this.find('img').addClass('active').attr('src');
                $(this).siblings().find('img').removeClass('active')
                formData.content['background-image'] = imgSrc;
            }
            wrap.dataset.form = JSON.stringify(formData);
            $btn.css({
                'background-image': 'url(' + imgSrc + ')',
                'background-repeat': 'repeat-x'
            });

        });
    }
    //图片上传
popover.img = function() {
    var _this = this;
    //初始化编辑框
    if(_this.imgstate){return;}
    var data = _this.data;

    var $target = $(_this.target);
    //标题
    if (data.config.title) {
        $(".popover-inner input[name='title']").attr("checked", "checked");
    } else {
        $(".popover-inner input[name='title']").attr("checked", false);
    }
    //购物车
    if (data.config.cart) {
        $(".popover-inner input[name='cart']").attr("checked", true);
    } else {
        $(".popover-inner input[name='cart']").attr("checked", false);
    }
    //价格
    if (data.config.price) {
        $(".popover-inner input[name='price']").attr("checked", true);
    } else {
        $(".popover-inner input[name='price']").attr("checked", false);
    }

    if(data.config.products){
       $('#changeProducts').val(data.config.products);
    }
    //大小
    $(".popover-inner input[name='size']").eq(data.config.size).attr("checked", "checked").trigger("change");
    //编辑模块
    //切换大小图
    $(".popover-inner").on("change", "input[name='size']", function(e) {
        var $parent = $(popover.target).parent();
        var data = JSON.parse($parent[0].dataset.form);
        data.config.size = e.currentTarget.value;
        _this.setDataForm(data);
    });
    //切换标题
    $(".popover-inner").on("change", "input[name='title']", function(e) {
         var $parent = $(popover.target).parent();
        var data = JSON.parse($parent[0].dataset.form);
        data.config.title = $(this).attr("checked") ? "showtitle" : "";
        _this.setDataForm(data);
    });
    //切换价格
    $(".popover-inner").on("change", "input[name='price']", function(e) {
         var $parent = $(popover.target).parent();
        var data = JSON.parse($parent[0].dataset.form);
        data.config.price = $(this).attr("checked") ? "showprice" : "";
        _this.setDataForm(data);
    });
    //切换购物车
    $(".popover-inner").on("change", "input[name='cart']", function(e) {
        var $parent = $(popover.target).parent();
        var data = JSON.parse($parent[0].dataset.form);
        data.config.cart = $(this).attr("checked") ? "showcart" : "";
        _this.setDataForm(data);
    });

    $(".popover-inner").on("click",".allProducts",function(e){
        e.preventDefault();
        $.get('/products').done(function(ctx){
            var data = ctx.data;
            $('#product-tmpl').tmpl(data).appendTo($('#productList').empty());
            $('#productPager').pagination({
                items:data.pagination.count,
                itemsOnPage:10,
                prevText:'上一页',
                nextText:'下一页',
                onPageClick:function(pageNumber){
                    console.log(pageNumber);
                }
            });
        });
    });

    $('.popover-inner').on('click','#productList>li',function(){
        var product_id = $(this).data('productid');
        var $parent = $(popover.target).parent();
        var data = JSON.parse($parent[0].dataset.form);
        if($(this).is('.active')){
            $(this).removeClass('active');
            var index = data.config.products.indexOf(product_id);
            if(index > 0){
                data.config.products.splice(index,1);
                $parent[0].dataset.form = JSON.stringify(data);
            }
        }else{
            $(this).addClass('active');
            var index = data.config.products.indexOf(product_id);
            if(index < 0){
                data.config.products.push(product_id);
                $parent[0].dataset.form = JSON.stringify(data);
            }
        }
    });
    _this.imgstate = true;
};
//辅助空白
popover.blankSpace = function() {
    var _this = this;
    //if(_this.blankSpacestate){return;}
    //插件代码开始
    var defaults = {
        speed: 400,
        lowerBound: 1,
        upperBound: 10
    };
    var options = $.extend(defaults, options);

    $(".slideControl").each(function() {

        // set vars
        var o = options;
        var controller = false;
        var position = 0;
        var obj = this;
        $(this).addClass('slideControlInput');
        var parent = $(this).parent();
        var label = $(parent).find('label');
        parent.html("<label>" + $(label).html() + "</label><span class=\"slideControlContainer\"><span class=\"slideControlFill\" style=\"width:" + $(obj).val() * 10 + "%\"><span class=\"slideControlHandle\"></span></span></span>" + $(obj).wrap("<span></span>").parent().html());
        var container = parent.find('.slideControlContainer');
        var fill = container.find('.slideControlFill');
        var handle = fill.find('.slideControlHandle');
        var input = parent.find('input');
        var containerWidth = container.outerWidth() + 1;
        var handleWidth = $(handle).outerWidth();
        var offset = $(container).offset();
        var animate = function(value) {
            $(fill).animate({
                width: value + "%"
            }, o.speed);
        };

        $(window).resize(function() {
            offset = $(container).offset();
        });


        // when user clicks anywhere on the slider
        $(container).click(function(e) {
            e.preventDefault();
            position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth / 2) / containerWidth) * 100));

            animate(position);
            $(input).val(position / 10);
        });

        // when user clicks handle
        $(handle).mousedown(function(e) {
            e.preventDefault();
            controller = true;
            $(document).mousemove(function(e) {
                e.preventDefault();
                position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth / 2) / containerWidth) * 100));
                if (controller) {
                    $(fill).width(position + "%");
                    $(input).val(position / 10);
                }
            });
            $(document).mouseup(function() {
                e.preventDefault();
                controller = false;
            });
        });

        // when user changes value in input
        $(input).change(function() {
            var value = checkBoundaries($(this).val() * 10);
            if ($(this).val() > o.upperBound)
                $(input).val(o.upperBound);
            else if ($(this).val() < o.lowerBound)
                $(input).val(o.lowerBound);
            animate(value);
        });

    });

    // checks if value is within boundaries
    function checkBoundaries(value) {
        if (value < options.lowerBound * 10)
            return options.lowerBound * 10;
        else if (value > options.upperBound * 10)
            return options.upperBound * 10;
        else
            return value;
    }

    //插件代码结束
    var data = _this.data;
    //获取初始化高度
    var height = data.height;
    _this.target.style.height = height;
    var value = parseFloat(height);
    $(".slideControlInput").val(value / 10);
    $(".slideControlFill").animate({
        width: value + "%"
    }, 400);
    $("#popover").on("mousemove mousedown mouseout", $('.slideControlContainer').parent(), function() {
        data.height = $('.slideControlInput').val() * 10 + "px";
        _this.setDataForm(data);
    });
    _this.blankSpacestate = true;
};
popover.title = function() {
    var _this = this;
    //if(_this.titlestate){return;}
    //初始化编辑框内容
    $("input[name=maxTitle]").val(_this.data.maxTitle);
    $("input[name=minTitle]").val(_this.data.minTitle);
    //编辑模块
    $("#popover").on("input propertychange", "input", function() {
        //修改data
        _this.data.maxTitle = $("input[name=maxTitle]").val();
        _this.data.minTitle = $("input[name=minTitle]").val();
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
    });
    _this.titlestate = true;
};
popover.setDataForm = function(data) {
    var wrap = this.wrap;
    wrap.dataset.form = JSON.stringify(data);
    //通过新dataform重新渲染HTML
    refreshComponent($(wrap), data);
};
popover.getDataForm = function() {
    //返回由data-form值转换的对象
    return JSON.parse($(this.target).parent("li")[0].dataset.form);
};
//切换验证框皮肤
popover.msgVerify = function() {
    var _this = this;
    if (_this.msgVerifytate) {
        return;
    }
    var data = _this.data;
    //初始化编辑框
    _this.target.dataset.skin = data.skin;
    //编辑
    $(".popover-inner").on("click", "input[name='skin']", setSkin);

    function setSkin() {
        _this.target.dataset.skin = data.skin = $(this).val();
        _this.setDataForm(data);
    }
    _this.msgVerifytate = true;
};
//文字导航
popover.textNav = function() {
    var _this = this;
    if (_this.textNavtate) {
        return;
    }
    var data = _this.data;

    //渲染编辑框
    _this.loadContent();
    //编辑模块
    $("#popover").on("input propertychange", "input[name=textNav]", function() {
        //@index-1 第一个选中元素为添加控件，索引-1
        var index = $(this).parents(".options").index();
        //修改data
        data.list[index].content = $(this).val();
        //将新的data同步到data-form
        _this.setDataForm(data);
    });
    _this.textNavtate = true;
};
//列表链接
popover.listLink = function() {
    var _this = this;
    if (_this.lkstate) {
        return;
    }
    var defaultContent = default_config[_this.data.id].list[0];
    //添加模块成员	
    $("#popover").on("click", ".add_listLink", function() {
        _this.data.list.push(defaultContent);
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
        //渲染编辑框
        //重新渲染后this.target=》div会被替换，用$(_this.wrap).find(".module")代替
        popover.loadContentRep();
        $(_this.target).trigger("click");
    });
    //编辑模块
    $("#popover").on("input propertychange", "input[name=listLink]", function(e) {
        //@index-1 第一个选中元素为添加控件，索引-1
        var index = $(this).parents(".options").index() - 1;
        // console.log("index:"+index);
        //修改data
        popover.data.list[index].content = $(this).val();
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
    });
    //删除模块成员	
    $("#popover").on("click", ".delListLink", function(e) {
        //@index-1 第一个选中元素为添加控件，索引-1
        var $this = $(this).parents(".options");
        var index = $this.index() - 1;
        if (_this.data.list.length <= 2) {
            $(".actions .delete").hide();
        }
        //修改data
        _this.data.list.splice(index, 1);
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
        //删除此条编辑
        $this.remove();
    });
    _this.lkstate = true;
};
popover.imgNav = function() {
    var _this = this;
    if (_this.imgNavstate) {
        return;
    }
    //渲染编辑框
    _this.loadContent();
    //编辑模块
    $("#popover").on("input propertychange", "input[name=imgNav]", function() {
        var index = $(this).parents(".options").index();
        //修改data
        _this.data.list[index].text = $(this).val();
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
    });
    //替换图片
    $(document).off('click');
    $(document).on("click", ".piclist>li", function(e) {
        $(this).addClass("current").siblings().removeClass("current");
        currentSrc = $(this).find("img").attr("src");
        //修改data
        //添加一个元素
        if (!_this.d.target.parent().hasClass("replace")) {
            _this.data.list.push(default_config[_this.data.id].list[0]);
            //改变图片src
            _this.data.list[_this.data.list.length - 1].src = currentSrc;
        } else {
            _this.data.list[_this.d.index].src = currentSrc;
        }
        //重新渲染
        _this.setDataForm(_this.data);
        $(_this.wrap).find(".module").trigger("click");
        //return false; //设置确定后是否关闭
        popover.d.close().remove();
    });
    _this.imgNavstate = true;
};
popover.imgAd = function() {
    var _this = this;
    if (_this.imgAdstate) {
        return;
    }
    var currentSrc = "";
    var d = null;
    if(_this.data.list.length<2){
        $('#popover').find('.options').find('.delImgAd').remove();
    }
    //编辑模块
    $("#popover").on("input propertychange", "input[name=imgAd]", function() {
        //@index-1 第一个选中元素为添加控件，索引-1
        var index = $(this).parents(".options").index();
        // console.log("index:"+index);
        //修改data
        _this.data.list[index].text = $(this).val();
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
    });


    //新模块选择图片
    $(document).off('click');
    $(document).on("click", ".piclist>li", function(e) {
        $(this).addClass("current").siblings().removeClass("current");
        currentSrc = $(this).find("img").attr("src");
        //修改data
        //添加一个元素
        // console.log(_this.d.target.parent().attr("class")+"----index:"+_this.d.index)
        if (!_this.d.target.parent().hasClass("replace")) {
            _this.data.list.push(default_config[_this.data.id].list[0]);
            //改变图片src
            _this.data.list[_this.data.list.length - 1].src = currentSrc;
        } else {
            _this.data.list[_this.d.index].src = currentSrc;
        }
        _this.setDataForm(_this.data);
        $(_this.wrap).find(".module").trigger("click");
        //return false; //设置确定后是否关闭
        _this.d.close().remove();
    });

    //删除模块成员    
    $('#popover').off('click.delImgAd');
    $("#popover").on("click.delImgAd", ".delImgAd", function() {
        //@index-1 第一个选中元素为添加控件，索引-1
        var $this = $(this).parents(".options");
        var index = $this.index();
        if (_this.data.list.length <= 2) {
            $(".delImgAd").remove();
        }
        //修改data
        _this.data.list.splice(index, 1);
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
        //删除此条编辑
        $this.remove();
    });
    _this.imgAdstate = true;
};

popover.showcase = function() {
    var _this = this;
    if (_this.showcasestate) {
        return;
    }
    //编辑模块
    $("#popover").on("input propertychange", "input", function() {
        //修改data
        _this.data.showcaseTitle = $("input[name=showcaseTitle]").val();
        _this.data.contentTitle = $("input[name=contentTitle]").val();
        //将新的data同步到data-form
        _this.setDataForm(_this.data);
    });
    //替换图片
    $(document).off('click');
    $(document).on("click", ".piclist>li", function(e) {
        $(this).addClass("current").siblings().removeClass("current");
        currentSrc = $(this).find("img").attr("src");
        //修改data
        //添加一个元素
        if (!_this.d.target.parent().hasClass("replace")) {
            _this.data.list.push(default_config[_this.data.id].list[0]);
            //改变图片src
            _this.data.list[_this.data.list.length - 1].src = currentSrc;
        } else {
            _this.data.list[_this.d.index].src = currentSrc;
        }
        //重新渲染
        _this.setDataForm(_this.data);
        $(_this.wrap).find(".module").trigger("click");
        //return false; //设置确定后是否关闭
        popover.d.close().remove();
    });
    _this.showcasestate = true;
};


popover.storefront = function() {
    var _this = this;
    //替换图片
    $(document).off('click');
    $(document).on("click", ".piclist>li", function(e) {
        $(this).addClass("current").siblings().removeClass("current");
        currentSrc = $(this).find("img").attr("src");
        //修改data
        //添加一个元素
        //改变图片src
        if (_this.d.target.hasClass("bg")) {
            _this.data.bg = currentSrc;
        } else {
            _this.data.logo = currentSrc;
        }
        //重新渲染
        _this.setDataForm(_this.data);
        $(_this.wrap).find(".module").trigger("click");
        //return false; //设置确定后是否关闭
        popover.d.close().remove();
    });
};


//调用dialog 序列图片
$(".popover-inner").on("click", ".addImg", function(e) {
    popover.d = dialog({
        title: '选择图片',
        content: $("#" + e.currentTarget.dataset.appid).html(),
        //okValue: '确 定',
        ok: function() {
            var that = this;
        },
        statusbar: '<label><input type="checkbox">不再提醒</label>',
        okDisplay: false,
        cancelDisplay: false,
    });
    popover.d.show();
    popover.d.target = $(this);
    popover.d.index = $(this).parents(".replace").index(".replace");
    $(".ui-dialog-footer").hide();
});

//调用dialog 单个图片
$(".popover-inner").on("click", ".change", function(e) {
    var target_id = this.dataset.target;
    $.post('/images/'+target_id).done(function(data) {
        popover.d.content($('#uploadAndSelectImg').tmpl({
            list: data
        }));
        //加载上传插件
        //图片上传插件
        initUploader(target_id);
    });

    popover.d = dialog({
        title: '选择图片',
        content: '正在加载图片...',
        // content:  $("#"+e.currentTarget.dataset.appid).html(),
        //okValue: '确 定',
        ok: function() {
            var that = this;
        },
        statusbar: '<label><input type="checkbox">不再提醒</label>',
        okDisplay: false,
        cancelDisplay: false,
    });
    popover.d.show();
    popover.d.target = $(this);
    popover.d.index = $(this).parents(".replace").index(".replace");
    $(".ui-dialog-footer").hide();
});
//dialog
$(function() {
    $(".popover-inner").on("click", ".dialog", function(e) {
        var elem = e.currentTarget;
        var d = dialog({
            title: 'SORRY',
            content: $("#" + elem.dataset.appid).html(),
            okValue: '确 定',
            ok: function() {
                var that = this;
                setTimeout(function() {
                    that.title('提交中..');
                }, 2000);
                return false;
            },
            cancelValue: '取消',
            cancel: function() {}
        });

        d.show();
    });
});

$('#popover').on('change','#changeProducts',function(){
        var val = this.value;
        var obj = JSON.parse($(popover.target).parent()[0].dataset.form);
        obj.config.products = val;
        $(popover.target).parent()[0].dataset.form = JSON.stringify(obj);
    });