$(function(){
	var token  = getStorage("appToken");
	var goodId = getPar("goodId");
	var priceType = getPar("priceType");
	var userMobile = getStorage("userMobile");
	var _role = true;
	mui.ajax({
  		url:basePath+"api/SupplyOfGoods/GetGoodsId?id="+goodId,
  		contentType: "application/json",
    async: true ,
    dataType: 'json',
    type: 'get',
    timeout: 10000,
    success: function(data) {
    		console.log(data);
      if(data.code=="200"){
	      replaceData(data.data.goods);
	      replaceData2(data.data);
      }else{
      		alert(data.msg);
      }
    },
    error: function(err) {
      alert(err);
    }
	});
	
	//替换数据
	function replaceData(data){
		var _startStation = (data.Start_place||data.Start_place_detail)?(data.Start_place?data.Start_place:""+data.Start_place_detail?data.Start_place_detail:""):"";
		var _endStation = (data.End_place||data.End_place_detail)?(data.End_place?data.End_place:""+data.End_place_detail?data.End_place_detail:""):"";
		var _priceType = priceType?"一口价":"自由报价";
		if(data.Order_taker == data.Publish_man){
    		_role = true;
    		if(data.Status=="待确认"){
    			$("#subButton").show();
    			$("#cancel").show();
    			$("#statusText").text("状态:司机已接单");
    			$("#submit").text("确认接单");
    		}else if(data.Status=="运输中"){
    			$("#subButton").hide();
    			$("#cancel").hide();
    			$("#statusText").text("运输中");
    		}else{
    			$("#cancel").hide();
    			$("#subButton").hide();
    		}
    }else{
    		_role = false;
    		$("#cancel").hide();
    		if(data.Status=="待确认"){
    			$("#subButton").show();
    			$("#statusText").text("等待货主确认");
    			$("#submit").text("待确认");
    		}else if(data.Status=="运输中"){
    			$("#subButton").show();
    			$("#statusText").text("货主已确认");
    			$("#submit").text("完成订单");
    		}else{
    			$("#subButton").hide();
    		}
    }
    
		$("#time").text((data.Load_time)?data.Load_time:"");
		$("#startStation").text(_startStation);
		$("#endStation").text(_endStation);
		$("#goodName").text(data.Goods_name);
		$("#goodsType").text(data.Billing_type);
		$("#goodsWeight").text(data.Goods_weight+"吨");
		$("#goodsVolume").text(data.Goods_volume+"方");
		$("#installType").text(data.Load_type);
		$("#sendType").text(data.Load_type);
		$("#carLong").text(data.Car_long);
		$("#carType").text(data.Car_type);
		$("#priceType").text(data.Pay_type);
		
	}
	
	function replaceData2(data){
		if(data.goods.Order_taker == data.goods.Publish_man){
			if(data.goods.Status=="待运输"){
				$("#dirverInfo").hide();
			}else{
				$("#dirverInfo").hide();
			}
		}else{
			$("#dirverInfo").hide();
		}
		$("#carNum").text(data.car_no);
		$(".driver-link").attr("href","tel:"+data.usermobile);
		$("#userName").text(data.username);
		$("#userType").text(data.usertype);
	}
	
	
	
	//确认接单
	$("#submit").on("click",function(){
		if(!_role){
			if($("#submit").text()=="完成订单"){
				alert("完成订单");
				mui.back();
			}else{
				return false;
			}
		}
		mui.ajax({
	  		url:basePath+"api/SupplyOfGoods/GoodsReceiveOrder",
	  		data:{
	  			goodsid: goodId,
			  mobile: userMobile,
			  type:"2"
	  		},
	  		contentType: "application/json",
	  		headers:{'Authorization':token},
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      alert("确认成功");
		      mui.back();
	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
	});
	
	
	$("#cancel").on("click",function(){
		if(!_role){
			return false;
		}
		mui.ajax({
	  		url:basePath+"api/SupplyOfGoods/CancelOrder",
	  		data:{
	  			goodsid: goodId
	  		},
	  		contentType: "application/json",
	  		headers:{'Authorization':token},
	    async: true ,
	    dataType: 'json',
	    type: 'post',
	    timeout: 10000,
	    success: function(data) {
	    		console.log(data);
	      if(data.code=="200"){
		      alert("取消成功");
		      mui.back();
	      }else{
	      		alert(data.msg);
	      }
	    },
	    error: function(err) {
	      alert(err);
	    }
		});
		
		
		
	});
	
})
