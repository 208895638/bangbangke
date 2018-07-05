$(function(){
    
});
var app3 = new Vue({
    el: '#app',
    data: {
        userLocation:"",
        inforState:true,
        maintenanceInfo:'',
        selectArea:false,
        selectedArea:"全国",
        selectedCity:"",
        selectedXian:"",
        provincesData:"",
        cityList:"",
        areasList:"",
        step1Show:false,
        step2Show:false,
        step3Show:false,
        step1Border:"",
        step2Border:"",
        step3Border:"",
        hasResult:false
    },
    mounted(){
        this.getUserLocation();//获取用户当前地址
        this.getMaintenance(); //获取初始数据
        this.getProvinces(); //获取省数据
    },
    methods:{
        getUserLocation(){   // 获取用户地址定位
            var _this = this;
            var map = new BMap.Map("allmap");
            var point = new BMap.Point(116.331398,39.897445);
            map.centerAndZoom(point,12);
            function myFun(result){
                var cityName = result.name;
                map.setCenter(cityName);
                console.log()
                _this.userLocation = cityName;
            }
            var myCity = new BMap.LocalCity();
            myCity.get(myFun); 
        },
        open(){  //展开详情
            this.inforState = false;
        },
        takeUp(){ //收起详情
            this.inforState = true;
        },  
        getMaintenance(){  //初始化数据
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
                        if(data.data.length == 0){
                            _this.hasResult = true;
                        }else{
                            _this.hasResult = false;
                        }
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
        getLocation(){ //点击定位 筛选地址信息
            this.selectArea = !this.selectArea;
            this.step1Show = true;
            this.step2Show = false;
            this.step3Show = false;
        },
        getProvinces(){ //获取省数据
            var _this = this;
            this.step1Show = true;
            this.step2Show = false;
            this.step3Show = false;
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
        getCitiesList (data , val ,index){ //获取市数据
            var _this = this;
            this.step1Show = false;
            this.step2Show = true;
            this.step3Show = false;
            this.selectedArea = val;
            this.selectedCity = val;
            this.step1Border = index;
            mui.ajax({
                url:basePath+"api/Common/GetCitiesList",
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
        getAreasList (data , val , index){ //获取县数据
            var _this = this;
            this.step1Show = false;
            this.step2Show = false;
            this.step3Show = true;
            this.selectedCity = val;
            this.selectedXian = val;
            this.step2Border = index;
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
        aa(val ,index){ //选择县之后关闭弹窗 并重置按钮
            this.selectArea = !this.selectArea;
            this.selectedArea = val;
            this.selectedXian = val;
            this.userLocation = val;
            this.step3Border = '';  //重置点击的按钮
            this.step2Border = ''; //重置点击的按钮
            this.filter();
        },
        goBackToStep1(){  //市区的返回上一级按钮点击返回上一级
            this.step1Show = true;
            this.step2Show = false;
            this.step3Show = false;
        },
        goBackToStep2(){ //县的返回上一级按钮点击返回上一级
            this.step1Show = false;
            this.step2Show = true;
            this.step3Show = false;
        },
        filter(){  //筛选地址获取数据
            var _this = this;
            mui.ajax({
                url:basePath+"api/Maintenance/MaintenanceWhere",
                // headers:{'Authorization':token},
                contentType: "application/json",
                data: {
                    region:_this.userLocation
                },
                async: true ,
                dataType: 'json',
                type: 'post',
                timeout: 10000,
                success: function(data) {
                    if(data.code=="200"){
                        if(data.data.length == 0){
                            _this.hasResult = true;
                        }else{
                            _this.hasResult = false;
                        }
                       _this.maintenanceInfo = data.data;
                    }else{
                            alert(data.msg);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        }
    }
})