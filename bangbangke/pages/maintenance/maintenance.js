$(function(){
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
});
var app3 = new Vue({
    el: '#app',
    data: {
        userLocation:"",
        inforState:true,
        maintenanceInfo:'',
        selectArea:false,
        selectedArea:"全国1",
        provincesData:"",
        cityList:"",
        areasList:""
    },
    mounted(){
        this.getUserLocation();//获取用户当前地址
        this.getMaintenance(); //获取初始数据
        this.getProvinces(); //获取省数据
    },
    methods:{
        getUserLocation(){
            var _this = this;
            var map = new BMap.Map("allmap");
            var point = new BMap.Point(116.331398,39.897445);
            map.centerAndZoom(point,12);
            function myFun(result){
                var cityName = result.name;
                map.setCenter(cityName);
                _this.userLocation = cityName;
            }
            var myCity = new BMap.LocalCity();
            myCity.get(myFun); 
        },
        open(){
            this.inforState = false;
            console.log(1)
        },
        takeUp(){
            this.inforState = true;
            console.log(2)
        },
        getMaintenance(){
            var _this = this;
            mui.ajax({
                url:basePath+"api/Maintenance/InIt",
                // headers:{'Authorization':token},
                contentType: "application/json",
                // data: {},
                async: true ,
                dataType: 'json',
                type: 'post',
                timeout: 10000,
                success: function(data) {
                    if(data.code=="200"){
                        console.log(data)
                       _this.maintenanceInfo = data.data;
                    }else{
                            alert(data.msg);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        },
        getProvinces(){ //获取省数据
            var _this = this;
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
                        // console.log(data);
                        _this.provincesData = data.data;
                        // obj.provinces(data.data);
                    }else{
                            alert(data.msg);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        },
        getCitiesList (data){ //获取市数据
            var _this = this;
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
                    if(data.code=="200"){
                        console.log(data);
                        _this.cityList = data.data;
                        // obj.citiesList(data.data);
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
            var _this = this;
            mui.ajax({
                url:basePath+"api/Common/GetAreasList",
                // headers:{'Authorization':token},
                // contentType: "application/json",
                data: {
                    "city_id":data
                },
                async: true ,
                dataType: 'json',
                type: 'get',
                timeout: 10000,
                success: function(data) {
                    if(data.code=="200"){
                        console.log(data);
                        _this.areasList = data.data;
                        // obj.areasList(data.data);
                    }else{
                            alert(data.msg);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        },
        aa(val){
            this.selectArea = !this.selectArea;
            this.selectedArea = val;
        }
    }
})