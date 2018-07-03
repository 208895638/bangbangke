$(function(){
    var h1 =$(".h1").height(),
    h2 =$(".h2").height(),
    m = parseFloat($(".h2").css("margin-top").split("px")[0]),
    h3 =$(".h3").height();
    selectedArea = "";
    // 给nav 点击出现的遮罩定位
    $(".box").css({"top":h1+h2+m+h3+9+"px"});
    // 三个选项点击显示对应的操作 点击显示遮罩
    $(".nav-option .xiala .select").on("click",function(){
        $(".box").removeClass("hide");
        // $(".nav-option .xiala .select").addClass("hide");
        $(this).parent().addClass("on");
        // 给三个导航栏重置 选项 
        $(this).parent().siblings().find(".selected").addClass("hide");
        $(this).parent().siblings().find(".select").removeClass("hide");
        $(this).addClass("hide").siblings().removeClass("hide");
        // 给三个导航栏对应的选项显示或隐藏
        $(".common").addClass("hide");
        var i  = $(this).parent().index();
        switch (i) {
            case 0:
                getProvinces();
                $(".area").removeClass("hide");
                $(".box").removeClass("hide");
                break;
            case 1:
                $(".attribute").removeClass("hide");
                $(".box").removeClass("hide");
                break;
            case 2:
                
                $(".source").removeClass("hide");
                $(".box").removeClass("hide");
                break;
            default:
                break;
        }
        
    });
    // 三个选项点击显示对应的操作 点击隐藏遮罩
    $(".nav-option .xiala .selected").on("click",function(){
        var i = $(this).parent().index();
        $(".nav-option .xiala .selected").addClass("hide");
        $(".nav-option .xiala .select").removeClass("hide");
        // $(this).siblings().removeClass("hide");
        $(".box").addClass("hide");
        console.log(i);
        switch (i) {
            case 0:
                //$(".nav-option .xiala").eq(i).find(".select").removeClass("hide");
                $(".area").addClass("hide");
                $(".box").addClass("hide");
                break;
            case 1:
                //$(".nav-option .xiala").eq(i).find(".select").removeClass("hide");
                $(".attribute").addClass("hide");
                $(".box").addClass("hide");
                break;
            case 2:
                //$(".nav-option .xiala").eq(i).find(".select").removeClass("hide");
                $(".source").addClass("hide");
                $(".box").addClass("hide");
                break;
            default:
                break;
        }
    });


    // 省选择
    $(".step1 ").on("click" , ".length-sel" , function(){
        var dataID = "";
        $(this).addClass("select11").siblings().removeClass("select11");
        $(".area .step").addClass("hide");
        $(".step2 ").removeClass("hide");
        selectedArea = $(this).html();
        $(".step2 .header span").html(selectedArea);
        dataID = $(this).attr("data-id");
        getCitiesList (dataID);
    });
    // 市选择
    $(".step2 ").on("click" , ".length-sel" , function(){
        $(this).addClass("select11").siblings().removeClass("select11");
        $(".area .step").addClass("hide");
        $(".step3 ").removeClass("hide");
        selectedArea = $(this).html();
        $(".step3 .header span").html(selectedArea);
    });
    // 县选择
    $(".step3 ").on("click" , ".length-sel" , function(){
        $(this).addClass("select11").siblings().removeClass("select11");
        $(".area").addClass("hide");
        $(".xiala").eq(0).find(".selected").addClass("hide").siblings().removeClass("hide");
        $(".box").addClass("hide");
    });
    // 点击返回上一级
    $(".header em").on("click",function(){
        var number = $(this).parents(".step").attr("data-attr") -1;
        console.log(number);
        $(".step"+number).removeClass("hide").siblings().addClass("hide");
    });

    // 仓库选择
    $(".attribute").on("click"," li",function(){
        var i = $(this).index();
        selectCondition("attribute" , i);
    });
    // 来源选择
    $(".source").on("click"," li",function(){
        var i = $(this).index();
        selectCondition("source" , i);
    });

    
});

// 仓库和来源选项的封装

function selectCondition(str,number){
    var text = $("."+str+" li").eq(number).html();
    console.log(text)
    var i = 0;
    switch (str) {
        case "attribute":
            i = 1;
            break;
        case "source":
            i = 2;
            break;
        default:
            break;
    }
    $(".xiala").eq(i).removeClass("on");
    $(".xiala").eq(i).find("span").html(text);
    $(".xiala").eq(i).find(".selected").addClass("hide").siblings().removeClass("hide");
    $("."+str).addClass("hide");
    $(".box").addClass("hide");
}

// 获取省
function getProvinces(){
    mui.ajax({
        url:basePath+"api/Common/GetProvinces ",
        // headers:{'Authorization':token},
        contentType: "application/json",
        // data: {},
        async: true ,
        dataType: 'json',
        type: 'get',
        timeout: 10000,
        success: function(data) {
            console.log(data);
            if(data.code=="200"){
                provinces(data.data);
            }else{
                    alert(data.msg);
            }
        },
        error: function(err) {
            alert(err);
        }
    });
}

//获取市
function getCitiesList (data){
    mui.ajax({
        url:basePath+"api/Common/GetCitiesList",
        // headers:{'Authorization':token},
        // contentType: "application/json",
        data: {
            "province_id":data
        },
        async: true ,
        dataType: 'json',
        type: 'get',
        timeout: 10000,
        success: function(data) {
            console.log(data);
            if(data.code=="200"){
                citiesList(data.data);
            }else{
                    alert(data.msg);
            }
        },
        error: function(err) {
            alert(err);
        }
    });
}

function provinces(data){
    var html = "";
    $.map(data,function(item,i){
        console.log(item.province_id+"--"+i);
        if(i == 0){
            html+="<div class='length-sel select11' data-id = "+item.province_id +">"+item.province+"</div>"
        }else{
            html+="<div class='length-sel' data-id = "+item.province_id +">"+item.province+"</div>"
        }
    });
    $("#province").html(html);
}

function citiesList(data){
    var html = "";
    $.map(data,function(item,i){
        console.log(item.province_id+"--"+i);
        if(i == 0){
            html+="<div class='length-sel select11' data-id = "+item.province_id + " 'data-city-id' = "+item.city_id +">"+item.city+"</div>"
        }else{
            html+="<div class='length-sel' data-id = "+item.province_id + " 'data-city-id' = "+item.city_id +">"+item.city+"</div>"
        }
    });
    $("#citiesList").html(html);
};


