if(!window.console){
    window.console.log = function(str){}
}
var pagelist = [{
        show: [
            // {
            // 	id:1,content:'这里是编辑好的一段富文本'
            // },	
            // {
            // id:2,config:{size:0,title:"showtitle",price:"showprice",cart:"showcart"}
            // },
            // {
            // id:3,skin:'default'
            // },
            // {
            // id:4,itmes:['北京','上海','广州','天津','大连']
            // },
            // {
            // id:5,list:[{src:'images/xxximg.jpg',text:'椅子广告图'},{src:'images/default.jpg',text:'默认图片'}]
            // },
            // {
            // id:6,maxTitle:"设置过的大标题",minTitle:"小标题"
            // },
            // {
            // id:7,list:[{content:'文本导航'},{content:'店铺首页'},{content:'图片仓库'},{content:'文本导航'}]
            // },
            // {
            // id:8,list:[{src:'images/tmall.jpg',text:'天猫'},{src:'images/jd.jpg',text:'京东'},{src:'images/tmall.jpg',text:'天猫'},{src:'images/tmall.jpg',text:'天猫'}]
            // },
            // {
            // id:9,list:[{content:'列表链接01'},{content:'列表链接02'},{content:'列表链接03'}]
            // },
            // {
            // id:10
            // },
            // {id:11,list:[{src:'images/showcase01.jpg'},{src:'images/showcase02.jpg'},{src:'images/showcase03.jpg'}],showcaseTitle:"展示橱窗",contentTitle:"描述文字"},
            // {
            // id:12
            // },
            // {
            // id:13,height:'30px'
            // },		
            // {
            // id:14,bg:"images/bg.jpg",logo:"images/logo.jpg"
            // }
        ],
        editBtns: [14,10,5, 2,16, 3, 4, 8, 6, 7, 9, 11, 12, 13, 1, 15]
    },

    {
        show: [],
        editBtns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    },

    {
        show: [{
            id: 4,
            itmes: ['北京', '上海', '广州', '天津', '大连']
        }, ],
        editBtns: []
    },

    {
        show: [{
            id: 1,
            content: '恭喜您领取成功!'
        }, {
            id: 2,
            src: 'images/default.jpg'
        }],
        editBtns: [1]
    }
];
//模拟数据结束
//默认模块数据
var default_config = ['', {
    id: 1,
    content: '这里添加文本'
}, {
    id: 2,
    config: {
        size: 0,
        title: "showtitle",
        price: "showprice",
        cart: "showcart",
        products:[]
    }
}, {
    id: 3,
    skin: 'default'
}, {
    id: 4,
    itmes: ['北京', '上海', '广州', '天津', '大连']
}, {
    id: 5,
    list: [{
        src: '/images/default1.jpg',
        text: '图片文字标题'
    }]
}, {
    id: 6,
    maxTitle: "大标题",
    minTitle: "小标题"
}, {
    id: 7,
    list: [{
        content: '文本导航'
    }, {
        content: '文本导航'
    }, {
        content: '文本导航'
    }, {
        content: '文本导航'
    }]
}, {
    id: 8,
    list: [{
        src: '/images/default1.jpg',
        text: ''
    }, {
        src: '/images/default1.jpg',
        text: ''
    }, {
        src: '/images/default1.jpg',
        text: ''
    }, {
        src: '/images/default1.jpg',
        text: ''
    }]
}, {
    id: 9,
    list: [{
        content: '列表链接'
    }]
}, {
    id: 10
}, {
    id: 11,
    list: [{
        src: '/images/default1.jpg'
    }, {
        src: '/images/default1.jpg'
    }, {
        src: '/images/default1.jpg'
    }]
}, {
    id: 12
}, {
    id: 13,
    height: '30px'
}, {
    id: 14,
    bg: "/images/bg.jpg",
    logo: "/images/logo.jpg"
}, {
    id: 15,
    content:{}
},{
    id:16,
    content:{
        'border-radius':'5px',
        'background-color':'#ffa200',
        'color':'#fff'
    },
    btnText:'这是一个按钮'
}];
//组件列表
var components = ['', 'fullText', 'img', 'msgVerify', 'locationInfo', 'imgAd', 'title', 'textNav', 'imgNav', 'listLink', 'goodSearch', 'showcase', 'subline', 'blankSpace', 'storefront', 'magicBox','customerBtn'];
//按钮列表
var btnText = ['', '富文本', '商品列表', '短信验证', '地址信息', '图片广告', '标题', '文本导航', '图片导航', '列表链接', '商品搜索', '橱窗', '辅助线', '辅助空白', '店头', '魔方','按钮'];
//全部视图模块信息
function getAllData($nodelist) {
    var arr = [];
    $nodelist.each(function(i) {
        var _t = JSON.parse(this.dataset.form);
        if($(this).attr('magicform')){
            _t.content = JSON.parse($(this).attr('magicform'));
        }
        arr[i] = _t;
    })
    return arr;
}
//设置当前dom className 为current 其同级兄弟节点取消current;
function setCurrent($this) {
    $this.addClass('current').parent().siblings().find(".module").removeClass('current');
    $this.parent().addClass('current').siblings().removeClass('current');
}


$(document).ready(function() {
    //@$('#editor_body') 内容模块容器
    var $editor = $('#editor_body'),
        page = 0;
    //设置模块容器标识
    // $(".tmpl_container>div>li").addClass("moduleWrap");
    //子元素拖拽交换位置
    $editor.sortable({
        stop: function() {
            //拖动时重新定位编辑框
            if (popover.target) {
                popover.posTop = $(popover.target).parent().position().top;
                popover.pos();
            }
        }
    });
    //加载组件
    loadDefaultComponent(pagelist[0].show);
    //加载按钮
    loadDefaultBtn(pagelist[0].editBtns);
    //翻页
    function pageTurns() {
        $editor.html("");
        $("#btn_container").html("");
        loadDefaultComponent(pagelist[page].show);
        loadDefaultBtn(pagelist[page].editBtns);
        //上传数据接口
        //所有data-form值 [{},{},{}]
        var uploadModuleConfig = getAllData($("#editor_body .moduleWrap"));
        //流程标识active切换
        $(".dash_bar li:even").eq(page).addClass("active")
            .siblings().removeClass("active");
        //当有popover显示时隐藏它
        popover.hide();
    }

    $("#prev").click(function() {
        if (page == 0) {
            return;
        }
        page--;
        pageTurns();
    });
    $("#next").click(function() {
        if (page == pagelist.length - 1) {
            return;
        }
        page++;
        pageTurns();
    });
    //视图模块绑定事件，调用编辑框
    $editor.on('click', '.module', function(e) {
        var $this = $(this);
        //设置className current 
        setCurrent($this);
        //显示编辑框
        $("#popover").show();
        popover.target = $this[0];
        popover.wrap = $this.parent()[0];
        popover.posTop = $this.parent().position().top;
        popover.data = popover.getDataForm();
        popover.pos().loadContent();
        if (popover.wrap.dataset.identity in popover) {
            popover[popover.wrap.dataset.identity]();
        }
        return false;
    });
    //按钮绑定事件，添加视图模块
    $('#btn_container').on('click', 'li>a', function(e) {
        var $this = $(this);
        var relatedComponentId = $this[0].dataset.relateid;
        var com = default_config[relatedComponentId];
        addComponentToView(com);
        var $com = $editor.find("li:last").find("div.module");
        setCurrent($com);
    });
    //模块控制按钮事件
    $editor.on('click', '.del', function(e) {
        var $module = $(this).parent().parent();
        //删除当前编辑的
        if ($module.hasClass("current")) {
            popover.hide();
        }
        //删除最后一个
        if ($editor.find(".module").size() == 1) {
            popover.hide();
        }
        //移除要删除的模块
        $module.remove();
        return false;
    });

    $('#btn_complete').click(function(){
        var $list = $('#editor_body').children('li');
        var data = getAllData($list);
        $.post('/page',{pages:data,title:$('#editor_title').html().trim()}).done(function(rp){
            var url = 'http://'+window.location.host+'/page/'+rp.pageId;
            // var url = 'www.baidu.com';
            // var url_param = encodeURIComponent(url);
            if(rp.status === 200){
                var d = dialog({
                    title:'提示信息',
                    content:'保存成功!<p style="padding:8px 0;">'+'访问<a id="pageLinks" style="color:#29B4F0" target="_blank" href="'+url+'" >'+url+'</a></p><p style="padding:8px 0;">或扫描二维码:</p><p id="QRcode" style="text-align:center;"></p>'
                });
              
                d.showModal();
                QRCanvas({
                    data:url,
                    size:230
               }).appendTo($('#QRcode')[0]);

                $('#pageLinks').off('click').on('click',function(){
                    setTimeout(function(){
                        window.location.reload();
                    },500);
                });
            }
        });

    });
    

});