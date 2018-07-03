$(function(){
   
    var hisTime;
    var hisItem;
    var firstKey;

    $(".content ul").on("click",".per",function(){
        console.log(1)
        var html = $(this).html();
        mui.openWindow({
            url:'../warehouse.html?search='+html
        });
    });
    
    function init() {
        hisTime = [];
        hisItem = [];
        var i = 0
        for(; i < localStorage.length; i++) {
            if(!isNaN(localStorage.key(i))) {
                hisItem.push(localStorage.getItem(localStorage.key(i)));
                hisTime.push(localStorage.key(i));
            }
        }
        var html = "";
        if(hisItem.length>0){
            $(".noResult").hide();
            $.map(hisItem,function(item , i){
            html+="<li><div class='per'>"+item+"</div></li>"
            });
            $(".content ul").html(html);
        }else{
            $(".noResult").show();
        }
        
        i = 0;
       
    }
    init();
    
    $(".searchBox input").on('keypress',function(e) { 
        var keycode = e.keyCode;   
        var value = $(this).val();
        var time = (new Date()).getTime();
        if(keycode=='13') { 
            if(!value) {
                alert("请输入搜索内容");
                return false;
            }else{
                if($.inArray(value, hisItem) >= 0) {
                    for(var j = 0; j < localStorage.length; j++) {
                        if(value == localStorage.getItem(localStorage.key(j))) {
                            localStorage.removeItem(localStorage.key(j));
                        }
                    }
                    localStorage.setItem(time, value);
                }else {
                    if(hisItem.length > 10) {
                        firstKey = hisTime[0]
                        localStorage.removeItem(firstKey);
                        localStorage.setItem(time, value);
                    } else {
                        localStorage.setItem(time, value)
                    }
                }
                init();
                mui.openWindow({
                    url:'../warehouse.html?search='+value
                });
                return false;
             }
            
        }
        

        //输入的内容localStorage有记录
        
        

    });
    $(".historyOfSearchTitle .mui-icon").on("click",function(){
        localStorage.clear();
        mui.toast('清除成功') ;
        setTimeout(function(){window.location.reload()},2000);
    });
});