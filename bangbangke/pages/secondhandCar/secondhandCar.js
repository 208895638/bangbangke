$(function(){
    // 已进入页面给三个tab点击出现的遮罩赋值高度
    
    var h2 =$(".h2").height()
    console.log(h2)
    $(".box").css({"top":h2+"px"});
    $("#filter .xiala").on("click",function(){
        var index = $(this).index();
        console.log(index);
        $(".box").removeClass("hide");
        $(".box .common").eq(index).removeClass("hide").siblings().addClass("hide");
    });
    
})
var app3 = new Vue({
    el: '#app',
    data: {
        seen: "aa",
        sortList:[
            {
                id:"默认排序"
            },
            {
                id:"最新上架"
            },
            {
                id:"价格最低"
            },
            {
                id:"价格最高"
            },
            {
                id:"降价急售"
            }
        ],
        modelOfCarList:[
            {
                id:"不限"
            },
            {
                id:"牵引车"
            },
            {
                id:"载货车"
            },
            {
                id:"自卸车"
            },
            {
                id:"轻卡"
            },
            {
                id:"挂车"
            },
            {
                id:"自卸车"
            },
            {
                id:"轻卡"
            }
        ],
        carDetail:""
    },
    mounted(){
        var _this = this;
        this.getLocation();
        this.getCarDetail();
    },
    methods:{
        getLocation(){ //判断当前手机是否支持html5地理定位
            console.log(this.showPosition);
            // if (navigator.geolocation){ 
            //   navigator.geolocation.getCurrentPosition(this.showPosition(),this.showError()); 
            // }else{ 
            //     mui.alert('当前手机不支持定位,请升级后再试!', '温馨提醒');
            // } 
        } ,
        getCarDetail(){ //获取所有的车型
            var _this = this;
            mui.ajax({
                url:basePath+"api/UsedCar/InIt",
                // headers:{'Authorization':token},
                contentType: "application/json",
                // data: {},
                async: true ,
                dataType: 'json',
                type: 'post',
                timeout: 10000,
                success: function(data) {
                    if(data.code=="200"){
                       console.log(data);
                       _this.carDetail = data.data;
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
    showPosition(position){ //获取用户的经纬度
        console.log(position); 
        var lat = position.coords.latitude; //纬度 
        var lag = position.coords.longitude; //经度 
        console.log('纬度:'+lat+',经度:'+lag); 
    },
    showError(error){ //当获取用户的经纬度失败时执行的函数
        console.log(error.code)
    }
})