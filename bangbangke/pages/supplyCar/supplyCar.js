$(function(){
	var alertHeight = $("#topNav1").height()+ $("#topNav2").height()+$("#head").height();
	var token  = getStorage("appToken");
	var _carType = "整车"
	getCarType();
	getCarLength();
	getList();
	$(".cartype-alert").css("top",alertHeight);
	$(".length-alert").css("top",alertHeight);
	
	//top切换
	$("#fullCar").on("click",function(){
		_carType = "整车";
		getList();
		$(this).addClass("sel-text");
		$("#carSharing").removeClass("sel-text");
		
	});
	$("#carSharing").on("click",function(){
		_carType = "拼车";
		getList();
		$(this).addClass("sel-text");
		$("#fullCar").removeClass("sel-text");
		
	});
	
	//select地区
	var startData=$('#startStation').mPicker({
    level:3,
    dataJson:city,
    Linkage:true,
    rows:5,
    idDefault:true,
    header:'',
    confirm:function(json){
    		var _value = $("#startStation").data('value3');
      $("#startStation").val(_value);
      getList();
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
	      var _value = $("#endStation").data('value3');
      		$("#endStation").val(_value);
      		getList();
	    },
	    cancel:function(json){
	      console.info('当前选中json：', json);
	    }
	})
	
	//获取列表
	function getList(){
		var startPlace = $("#startStation").val();
		var endPlace = $("#endStation").val()=="全国"?"":$("#endStation").val();
		var typeSource = $("#carType").text()=="车型不限"?"":$("#carType").text();
		var carLong = $("#carLength").text()=="车长不限"?"":$("#carLength").text();
		mui.ajax({
	  		url:basePath+"api/VehicleSource/VehicleSourceWhere",
	  		headers:{'Authorization':token},
	  		contentType: "application/json",
	    data: {
//	    		vehicle_type: _type,
	    		starting_ground: startPlace,
			  destination: endPlace,
			  car_pooling_type: typeSource,
			  car_long: carLong,
			  vehicle_type: _carType
	    },
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      replaceData(data.data);
	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
	}
	
	function replaceData(data){
		var temp = "";
		for(var i=0;i<data.length;i++){
			temp += '<li class="d-flex padding-t-15 padding-r-15 padding-b-15 bor-bottom">'
								+ '<img class="head" src="../../static/img/head2.png"/>'
								+ '<div class="d-flex flex-column flex-auto">'
									+ '<div class="d-flex margin-b-5 align-items-center">'
										+ '<div class="d-flex flex-auto align-items-center">'
											+ '<div class="font-l4-color font-size-15">上海</div>'
											+ '<div class="jiantou2 margin-r-20 margin-l-20"></div>'
											+ '<div class="font-l4-color font-size-15">西安 未央区</div>'
										+ '</div>'
										+ '<div class="phone"></div>'
									+ '</div>'
									+ '<div class="font-l2-color goods-info margin-b-15">'
										+ '<span>张师傅</span>'
										+ '<span class="plate-number">沪A88888</span>'
										+ '<span>冷冻</span>'
										+ '<span>9.6米</span>'
										+ '<span>999吨</span>'
									+ '</div>'
									+ '<div class="d-flex man-info align-items-center">'
										+ '<div class="star"></div>'
										+ '<div class="star"></div>'
										+ '<div class="star"></div>'
										+ '<div class="star"></div>'
										+ '<div class="flex-auto margin-l-5 font-l2-color">100单</div>'
										+ '<div class="distance font-l2-color">6.0km</div>'
									+ '</div>'
								+ '</div>'
							+ '</li>'
		}
		$("#carList").html(temp);
	}
	
	function getCarType(){
		mui.ajax({
	  		url:basePath+"api/Common/GetCarType",
	  		contentType: "application/json",
	    async: true ,
	    dataType: 'json',
	    type: 'get',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      replaceCartype(data.data);

	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
	}
	
	function replaceCartype(data){
		var temp = "";
		for(var i=0;i<data.length;i++){
			temp += '<div class="type-sel">'+data[i].value+'</div>'
		}
		$("#cartypeList").html(temp);
		$("#cartypeList").find(".type-sel:first-child").addClass("select");
 		$("#cartypeList>.type-sel").on("click",function(){
 			var _text = $(this).text();
 			$("#carType").text(_text);
	 		$("#cartypeList").children().removeClass("select");
	 		$(this).addClass("select");
	 		getList();
	 		$(".cartype-alert").hide();
	 		
 		});
	};
	
	function getCarLength(){
		mui.ajax({
	  		url:basePath+"api/Common/GetCarLong",
	  		contentType: "application/json",
	    async: true ,
	    dataType: 'json',
	    type: 'get',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      replaceCarLength(data.data);

	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
	}
	
	function replaceCarLength(data){
		var temp = "";
		for(var i=0;i<data.length;i++){
			temp += '<div class="length-sel">'+data[i].value+'</div>'
		}
		$("#carLengthList").html(temp);
		$("#carLengthList").find(".length-sel:first-child").addClass("select");
 		$("#carLengthList>.length-sel").on("click",function(){
 			var _text = $(this).text();
 			$("#carLength").text(_text);
 			getList();
	 		$("#carLengthList").children().removeClass("select");
	 		$(this).addClass("select");
	 		$(".length-alert").hide();
	 		
 		});
	};
	
	$("#carType").on("click",function(){
		$(".length-alert").hide();
		$(".cartype-alert").show();
	});
	$("#carLength").on("click",function(){
		$(".cartype-alert").hide();
		$(".length-alert").show();
	});
	
	$("#carPublish").on("click",function(){
		mui.openWindow({
			url:'../releaseCar/releaseCar.html'
		});
	});
	
	
	
});
