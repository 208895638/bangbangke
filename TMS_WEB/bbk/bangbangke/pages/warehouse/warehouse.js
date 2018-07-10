$(function(){
    var h1 =$(".h1").height(),
    // h2 =$(".h2").height(),
    // m = parseFloat($(".h2").css("margin-top").split("px")[0]),
    h3 =$(".h3").height();
    selectedArea = "";
    var token  = getStorage("appToken");
    // 给nav 点击出现的遮罩定位
    $(".box").css({"top":h1+h3+9+"px"});
    // 三个选项点击显示对应的操作 点击显示遮罩
    // 初始化加载列表
    obj.init();
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
                obj.getProvinces();
                $(".area").removeClass("hide");
                $(".box").removeClass("hide");
                break;
            case 1:
                obj.getWarehouseType();
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
        obj.getCitiesList (dataID);
    });
    // 市选择
    $(".step2 ").on("click" , ".length-sel" , function(){
        var dataID = "";
        $(this).addClass("select11").siblings().removeClass("select11");
        $(".area .step").addClass("hide");
        $(".step3 ").removeClass("hide");
        selectedArea = $(this).html();
        $(".step3 .header span").html(selectedArea);
        dataID = $(this).attr("'data-city-id'");
        obj.getAreasList(dataID);
    });
    // 县选择
    $(".step3 ").on("click" , ".length-sel" , function(){
        $(this).addClass("select11").siblings().removeClass("select11");
        $(".area").addClass("hide");
        $("#area span").html($(this).html());
        $(".xiala").eq(0).find(".selected").addClass("hide").siblings().removeClass("hide");
        $(".box").addClass("hide");
        var data1;
        if(obj.getUrlParam(window.location.href,"search")){
            data1 = {
                title:obj.getUrlParam(window.location.href,"search"),
                "warehouse_area":$(this).html()
            }
        }else{
            data1 = {
                "warehouse_area":$(this).html()
            }
        }
        obj.filterOptions(
            data1
        )
        
    });
    // 点击返回上一级
    $(".header em").on("click",function(){
        var number = $(this).parents(".step").attr("data-attr") -1;
        $(".step"+number).removeClass("hide").siblings().addClass("hide");
    });

    // 仓库选择
    $(".attribute").on("click"," li",function(){
        $(this).addClass("select11").siblings().removeClass("select11");
        var i = $(this).index();
        obj.selectCondition("attribute" , i);
        var data3;
        if(obj.getUrlParam(window.location.href,"search")){
            if($("#area span").html()!="全国"){
                data3 = {
                    title:obj.getUrlParam(window.location.href,"search"),
                    warehouse_area:$("#area span").html(),
                    warehouse_type:$(this).html()
                }
            }else{
                data3 = {
                    title:obj.getUrlParam(window.location.href,"search"),
                    warehouse_type:$(this).html()
                }
            }
            
        }else{
            if($("#area span").html()!="全国"){
                data3 = {
                    warehouse_area:$("#area span").html(),
                    warehouse_type:$(this).html()
                }
            }else{
                data3 = {
                    warehouse_type:$(this).html()
                }
            }
        }
        
        obj.filterOptions(data3)
    });
    // 来源选择
    $(".source").on("click"," li",function(){
        var i = $(this).index();
        obj.selectCondition("source" , i);
    });
    // 点击搜索跳转到搜索页面
    $("#search").on("click",function(){
		mui.openWindow({
			url:'./search/search.html'
		});
	});
    // 点击仓库进入详情
    $("#list").on("click","li",function(){
        var obj = {
            Contact_information:$(this).attr("data-Contact_information"),
            Contact_person:$(this).attr("data-Contact_person"),
            Fire_class:$(this).attr("data-Fire_class"),
            Price:$(this).attr("data-Price"),
            Title:$(this).attr("data-Title"),
            Warehouse_address:$(this).attr("data-Warehouse_address"),
            Warehouse_area:$(this).attr("data-Warehouse_area"),
            Warehouse_floor:$(this).attr("data-Warehouse_floor"),
            Warehouse_type:$(this).attr("data-Warehouse_type"),
            id:$(this).attr("data-id")
        }
        setStorage("data",JSON.stringify(obj));
        mui.openWindow({
			url:'../warehouseDetail/warehouseDetail.html'
		});
    });
});


var obj = {
    init(){  //初始化获取仓库丨
        var a = obj.getUrlParam(window.location.href,"search");
        if(a){
            $("#search").html(a);
            obj.filterOptions({
                title:a
            })
        }else{
            
            mui.ajax({
                url:basePath+"api/Warehouse/InIt",
                // headers:{'Authorization':token},
                contentType: "application/json",
                // data: {},
                async: true ,
                dataType: 'json',
                type: 'post',
                timeout: 10000,
                success: function(data) {
                    if(data.code=="200"){
                        if(data.data.length == 0){
                            $(".noResult").removeClass("hide");
                        }else{
                            $(".noResult").addClass("hide");
                        }
                        obj.render(data.data);
                    }else{
                            alert(data.msg);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        }
    },
    render(data){ //渲染获取的仓库数据结果
        var html = "";
        $.map(data,function(item,i){
            html+="<li class='d-flex padding-t-5 padding-b-14 padding-r-14 bor-bottom' data-Contact_information="+item.Contact_information+"  data-Contact_person="+item.Contact_person+" data-Fire_class="+item.Fire_class+" data-Price="+item.Price+" data-Title="+item.Title+" data-Warehouse_address="+item.Warehouse_address+" data-Warehouse_area="+item.Warehouse_area+" data-Warehouse_floor="+item.Warehouse_floor+" data-Warehouse_type="+item.Warehouse_type+" data-id="+item.id+">"
                // +  "<img class='warehouse-img margin-r-14' src='../../static/img/cangku.jpg'/>"
                +   "<div class='d-flex flex-auto flex-column'>"
                +    "<div class='font-size-15 margin-t-12'>"+ item.Title+"</div>"
                +    "<div class='margin-t-15 font-size-10 font-l2-color'>"+item.Warehouse_floor+"-"+item.Warehouse_area+"-"+item.Warehouse_type+"</div>"
                +    "<div class='d-flex margin-t-10'>"
                +        "<div style='color: #F54725;' class='flex-auto font-size-14'>"+item.Price+"</div>"
                +        "<div class='cangku-label'>出租</div>"
                +    "</div>"
                +   "</div>"
                +"</li>"
        });
        $("#list").html(html);
    },
    filterOptions(str){  //筛选获取的结果
        mui.ajax({
            url:basePath+"api/Warehouse/WarehouseWhere",
            // headers:{'Authorization':token},
            contentType: "application/json",
            data: str,
            async: true ,
            dataType: 'json',
            type: 'post',
            timeout: 10000,
            success: function(data5) {
                if(data5.code=="200"){
                    if(data5.data.length == 0){
                        $(".noResult").removeClass("hide");
                    }else{
                        $(".noResult").addClass("hide");
                    }
                   obj.render(data5.data);
                }else{
                        alert(data.msg);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    },
    getWarehouseType(){  //获取仓库类别
        mui.ajax({
            url:basePath+"api/Common/GetWarehouseType",
            // headers:{'Authorization':token},
            contentType: "application/json",
            // data: {},
            async: true ,
            dataType: 'json',
            type: 'get',
            timeout: 10000,
            success: function(data) {
                if(data.code=="200"){
                    if(data.data.length == 0){
                        
                        $(".noResult").removeClass("hide");
                    }else{
                        $(".noResult").addClass("hide");
                    }
                    obj.renderWarehouseType(data.data);
                }else{
                        alert(data.msg);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    },
    renderWarehouseType(data){
        var html = "";
        $.map(data,function(item,i){
            html+="<li class='length-sel'>"+item+"</li>";
        });
        $("#warehouseType").html(html);
    },
    selectCondition(str,number){ // 仓库和来源选项的封装
        var text = $("."+str+" li").eq(number).html();
        var i = 0;
        switch (str) {
            case "attribute":
                i = 1;
                obj.render();
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
    },
    getProvinces(){ //获取省数据
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
                if(data.code=="200"){
                    obj.provinces(data.data);
                }else{
                        alert(data.msg);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    },
    getCitiesList (val){ //获取市数据
        mui.ajax({
            url:basePath+"api/Common/GetCitiesList",
            // headers:{'Authorization':token},
            // contentType: "application/json",
            data: {
                "areaId":val
            },
            async: true ,
            dataType: 'json',
            type: 'get',
            timeout: 10000,
            success: function(data) {
                
                if(data.code=="200"){
                    obj.citiesList(data.data);
                }else{
                        alert(data.msg);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    }, 
    getAreasList (data){ //获取县数据
        mui.ajax({
            url:basePath+"api/Common/GetAreasList",
            // headers:{'Authorization':token},
            // contentType: "application/json",
            data: {
                "areaId":data
            },
            async: true ,
            dataType: 'json',
            type: 'get',
            timeout: 10000,
            success: function(data) {
                if(data.code=="200"){
                    obj.areasList(data.data);
                }else{
                        alert(data.msg);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    },
    provinces(data){ //渲染省数据
        var html = "";
        $.map(data,function(item,i){
            if(i == 0){
                html+="<div class='length-sel select11' data-id = "+item.areaId +">"+item.areaName+"</div>"
            }else{
                html+="<div class='length-sel' data-id = "+item.areaId +">"+item.areaName+"</div>"
            }
        });
        $("#province").html(html);
    },
    citiesList(data){ //渲染市数据
        var html = "";
        $.map(data,function(item,i){
            if(i == 0){
                html+="<div class='length-sel select11' data-id = "+item.areaId + " 'data-city-id' = "+item.areaId +">"+item.areaName+"</div>"
            }else{
                html+="<div class='length-sel' data-id = "+item.areaId + " 'data-city-id' = "+item.areaId +">"+item.areaName+"</div>"
            }
        });
        $("#citiesList").html(html);
    },
    areasList(data){ //渲染县数据
        var html = "";
        $.map(data,function(item,i){
            if(i == 0){
                html+="<div class='length-sel select11' data-area_id = "+item.areaId + " 'data-city-id' = "+item.areaId +">"+item.areaName+"</div>"
            }else{
                html+="<div class='length-sel' data-area_id = "+item.areaId + " 'data-city-id' = "+item.areaId +">"+item.areaName+"</div>"
            }
        });
        $("#areasList").html(html);
    },
    getUrlParam(url,name) {  
        var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");  
        var matcher = pattern.exec(url);  
        var items = null;  
        if(null != matcher){  
                try{  
                       items = decodeURIComponent(decodeURIComponent(matcher[1]));  
                }catch(e){  
                        try{  
                                items = decodeURIComponent(matcher[1]);  
                        }catch(e){  
                                items = matcher[1];  
                        }  
                }  
        }  
        return items;  
   }  
}