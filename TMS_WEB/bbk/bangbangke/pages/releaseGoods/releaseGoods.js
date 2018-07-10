$(function(){
	var token = getStorage("appToken");
	var _userMobile = getStorage("userMobile");
	$("#phoneNum").text(_userMobile);
	var _isCarInfo = false;
	var priceData=[
		{"name":"直营司机", "value":"直营司机" },
		{"name":"委外司机", "value":"委外司机" },
		{"name":"不限", "value":"不限" }
	];
	var zhuanxieData=[{
		"name":"包提送",
		"value":"包提送","child":[
			{"name":"一装一卸", "value":"一装一卸"},
			{"name":"一装两卸", "value":"一装两卸"},
			{"name":"一装多卸", "value":"一装多卸"},
			{"name":"两装一卸", "value":"两装一卸"},
			{"name":"两装两卸", "value":"两装两卸"},
			{"name":"多装多卸", "value":"多装多卸"},
		]},{
		"name":"仅送货",
		"value":"仅送货","child":[
			{"name":"一装一卸", "value":"一装一卸"},
			{"name":"一装两卸", "value":"一装两卸"},
			{"name":"一装多卸", "value":"一装多卸"},
			{"name":"两装一卸", "value":"两装一卸"},
			{"name":"两装两卸", "value":"两装两卸"},
			{"name":"多装多卸", "value":"多装多卸"},
		]},{
		"name":"仅提货",
		"value":"仅提货","child":[
			{"name":"一装一卸", "value":"一装一卸"},
			{"name":"一装两卸", "value":"一装两卸"},
			{"name":"一装多卸", "value":"一装多卸"},
			{"name":"两装一卸", "value":"两装一卸"},
			{"name":"两装两卸", "value":"两装两卸"},
			{"name":"多装多卸", "value":"多装多卸"},
		]},{
		"name":"自提送",
		"value":"自提送","child":[
			{"name":"一装一卸", "value":"一装一卸"},
			{"name":"一装两卸", "value":"一装两卸"},
			{"name":"一装多卸", "value":"一装多卸"},
			{"name":"两装一卸", "value":"两装一卸"},
			{"name":"两装两卸", "value":"两装两卸"},
			{"name":"多装多卸", "value":"多装多卸"},
		]}];
	var zhuangcheData=getDateJson();
	var payData=[
		{"name":"回单结账", "value":"回单结账" },
		{"name":"货到打卡", "value":"货到打卡" },
		{"name":"现付+到付", "value":"现付+到付" }
	];
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
	
	var price=$('#price').mPicker({
    level:1,
    dataJson:priceData,
    Linkage:false,
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
 	var zhuanxie=$('#zhuanxie').mPicker({
    level:2,
    dataJson:zhuanxieData,
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
 	var zhuangche=$('#zhuangche').mPicker({
    level:4,
    dataJson:zhuangcheData,
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
 	var pay=$('#pay').mPicker({
    level:1,
    dataJson:payData,
    Linkage:false,
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
 	$("#submit").on("click",function(){
 		_isCarInfo = true;
 		$("#selCarProp").text($("#carList").find(".select").text()+" / "+$("#lengthList").find(".select").text());
 		$("#selCarProp").removeClass("font-l1-color");
 		$(".selCarProperty").hide();
 	});
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
 	
 	$(".submit").on("click",function(){
 		_car_long = "";
 		_car_type = "";
 		if(_isCarInfo){
 			_car_long = $("#selCarProp").text().split("/")[1];
 			_car_type = $("#selCarProp").text().split("/")[0];
 		}
		var info	= {
			goods_name : $("#goods").val(),
		  order_taker: $("#phoneNum").text(),
		  start_area: $('#startStation').data('value3'),
		  start_place:$('#startStation').data('value1')+$('#startStation').data('value2')+$('#startStation').data('value3'),
			start_province: $('#startStation').data('value1'),
			start_city: $('#startStation').data('value2'),
		  start_place_detail: $("#startDetail").val(),
		  end_place:$('#endStation').data('value1')+$('#endStation').data('value2')+$('#endStation').data('value3'),
		  end_province: $('#endStation').data('value1'),
			end_city: $('#endStation').data('value2'),
		  end_area: $('#endStation').data('value3'),
		  end_place_detail: $("#endDetail").val(),
		  car_long: _car_long,
		  car_type: _car_type,
		  price_source: $('#price').data('value1'),
		  quotation_Type: $(".radio-sel").attr("type"),
		  load_type: $("#zhuanxie").data('value2'),
		  load_time:  $("#zhuangche").data('value1')+"-"+$("#zhuangche").data('value2')+"-"+$("#zhuangche").data('value3')+"-"+$("#zhuangche").data('value4'),
		  pay_type: $("#pay").data('value1'),
		  price: $("#offer").val(),
		  comments: $("#comments").val(),
		  goods_weight: $("#weight").val(),
		  goods_volume: $("#volume").val()
		}
		mui.ajax({
	  		url:basePath+'api/SupplyOfGoods/SupplyOfGoodsAdd',
	    data: info,
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      mui.openWindow({
						url:'../supplyGoods/supplyGoods.html'
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
