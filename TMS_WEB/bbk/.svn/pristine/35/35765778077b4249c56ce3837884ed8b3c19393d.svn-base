$(function(){
	var _timeData = getDateJson();
	var _userMobile = getStorage("userMobile");
	var token  = getStorage("appToken");
	var _isCarInfo = false;
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
 	$("#selCarProp").on("click",function(){
 		$(".selCarProperty").show();
 	});
 	$("#cannel").on("click",function(){
 		$(".selCarProperty").hide();
 	});
 	$("#lengthList>.length-sel").on("click",function(){
 		$("#lengthList").children().removeClass("select");
 		$(this).addClass("select");
 	});
 	$("#carList>.length-sel").on("click",function(){
 		$("#carList").children().removeClass("select");
 		$(this).addClass("select");
 	});
 	
 	mui.ajax({
  		url:basePath+'api/Common/GetCarLong',
    data: {},
    async: true ,
    dataType: 'json',
    type: 'get',
    timeout: 10000,
    success: function(data) {
    		console.log(data);
      if(data.code=="200"){
	      replaceData1(data.data);
      }else{
      		alert(data.msg);
      }
    },
    error: function(err) {
      alert(err);
    }
	});
	mui.ajax({
  		url:basePath+'api/Common/GetCarType',
    data: {},
    async: true ,
    dataType: 'json',
    type: 'get',
    timeout: 10000,
    success: function(data) {
    		console.log(data);
      if(data.code=="200"){
	      replaceData2(data.data);
      }else{
      		alert(data.msg);
      }
    },
    error: function(err) {
      alert(err);
    }
	});
 	function replaceData1(data){
 		var temp = "";
 		for(var i=0,j=data.length;i<j;i++){
 			temp+='<div class="length-sel">'+data[i].value+'</div>'
 		}
 		$("#lengthList").html(temp);
 		$("#lengthList").find(".length-sel:first-child").addClass("select");
 		$("#lengthList>.length-sel").on("click",function(){
	 		$("#lengthList").children().removeClass("select");
	 		$(this).addClass("select");
 		});
 	}
 	function replaceData2(data){
 		var temp = "";
 		for(var i=0,j=data.length;i<j;i++){
 			temp+='<div class="length-sel">'+data[i].value+'</div>'
 		}
 		$("#carList").html(temp);
 		$("#carList").find(".length-sel:first-child").addClass("select");
 		$("#carList>.length-sel").on("click",function(){
	 		$("#carList").children().removeClass("select");
	 		$(this).addClass("select");
 		});
 	}
 	$("#sure").on("click",function(){
 		_isCarInfo = true;
 		$("#selCarProp").text($("#carList").find(".select").text()+" / "+$("#lengthList").find(".select").text());
 		$("#selCarProp").removeClass("font-l1-color");
 		$(".selCarProperty").hide();
 	});
 	$("#submit").on("click",function(){
 		_car_long = "";
 		_car_type = "";
 		if(_isCarInfo){
 			_car_long = $("#selCarProp").text().split("/")[1];
 			_car_type = $("#selCarProp").text().split("/")[0];
 		}
 		var carInfo = {
		  driver_mobile: _userMobile,
		  vehicle_number: $("#carNum").val(),
		  vehicle_type: _car_type,
		  car_long: _car_long,
		  load: $("#carWeight").val()+"吨",
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