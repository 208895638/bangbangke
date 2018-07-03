$(function(){
	var token  = getStorage("appToken");
	var goodId = getPar("goodId");
	var priceType = getPar("priceType");
	var userMobile = getStorage("userMobile");
	var startStation="";
	var endStation="";
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
		var _startStation = (!data.Start_place&&!data.Start_place_detail)?"":(data.Start_place+data.Start_place_detail);
		var _endStation = (!data.End_place&&!data.End_place_detail)?"":(data.End_place+data.End_place_detail);
		startStation = _startStation;
		endStation = _endStation
		var _priceType = priceType?"一口价":"自由报价";
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
		$("#price").text((_priceType=="自由报价" )?"自由报价" : "￥"+data.Price);
		$("#offerType").text(_priceType)
		$("#goodsLink").attr("href","tel:"+data.Order_taker);
		
	}
	
	//跳转地图
	$("#goMap").on("click",function(){
		mui.openWindow({
			url:'../pathDistance/pathDistance.html?start='+startStation+"&end="+endStation
		})
	});
	
	
	//接单
	$("#submit").on("click",function(){
		mui.ajax({
	  		url:basePath+"api/SupplyOfGoods/GoodsReceiveOrder",
	  		data:{
	  			goodsid: goodId,
			  mobile: userMobile,
			  type:"1"
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
		      alert("接单成功");
		     mui.openWindow({
					url:'../orderList/orderList.html'
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
	
})
