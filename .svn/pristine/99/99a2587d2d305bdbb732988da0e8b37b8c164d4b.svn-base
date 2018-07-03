$(function(){
	var _timeData = getDateJson();
	var _userMobile = getStorage("userMobile");
	var token  = getStorage("appToken");
	$(".radio").on("click",function(){
 		var _$this = $(this);
 		if(_$this.attr("type")=="1"){
 			$("#radio1").addClass("radio-sel");
 			$("#radio1").removeClass("radio-none");
 			$("#radio2").addClass("radio-none");
 			$("#radio2").removeClass("radio-sel");
 		}else{
 			$("#radio2").addClass("radio-sel");
 			$("#radio2").removeClass("radio-none");
 			$("#radio1").addClass("radio-none");
 			$("#radio1").removeClass("radio-sel");
 		}
 	});
 	
	var startData=$('#startStation').mPicker({
    level:3,
    dataJson:city,
    Linkage:true,
    rows:5,
    idDefault:true,
    header:'',
    confirm:function(json){
      console.info('当前选中json：', json);
    },
    cancel:function(json){
      console.info('当前选中json：', json);
    }
 	});
	var endData = $('#endStation').mPicker({
	  level:3,
	  dataJson:city,
	  Linkage:true,
	  rows:5,
	  idDefault:true,
	  header:'',
	  confirm:function(json){
	    console.info('当前选中json：', json);
	  },
	  cancel:function(json){
	    console.info('当前选中json：', json);
	    }
	})
 	
 	var goTime=$('#goTime').mPicker({
    level:4,
    dataJson:_timeData,
    jsonValue:'value',
    Linkage:true,
    rows:5,
    idDefault:true,
    header:'',
    confirm:function(json){
      console.info('当前选中json：', json);
    },
    cancel:function(json){
      console.info('当前选中json：', json);
    }
 	});
 	
 	$("#submit").on("click",function(){
 		var carInfo = {
		  driver_mobile: _userMobile,
		  vehicle_number: $("#carNum").val(),
		  vehicle_type: $("#carType").val(),
		  car_long: $("#carlong").val(),
		  load: $("#carWeight").val(),
		  starting_ground: $("#startStation").data("value1")+$("#startStation").data("value2")+$("#startStation").data("value3"),
		  destination: $("#endStation").data("value1")+$("#endStation").data("value2")+$("#endStation").data("value3"),
		  departure_time: $("#goTime").data("value1")+"-"+$("#goTime").data("value2")+"-"+$("#goTime").data("value3")+"-"+$("#goTime").data("value4"),
		  car_pooling_type: $(".radio-sel").attr("type")
		}
 		mui.ajax({
	  		url:basePath+'api/VehicleSource/VehicleSourceAdd',
	    data: carInfo,
	    headers:{'Authorization':token},
	  		contentType: "application/json",
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      mui.openWindow({
						url:'../supplyCar/supplyCar.html'
					});
	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
 		
 		
 	});
});