$(function(){
	var token  = getStorage("appToken");
	var userMobile = getStorage("userMobile");
	getOrderList();
	$("#home").on("click",function(){
		mui.openWindow({
			url:'../home/home.html'
		});
	});
	$("#mine").on("click",function(){
		mui.openWindow({
			url:'../mine/mine.html'
		});
	});
	//top切换
	$(".orderType").on("click",function(){
		$("#orderHeard").children().removeClass("active");
		$(this).addClass("active");
		getOrderList();
	});
	
	//获取订单
	function getOrderList(){
		var orderType = $("#orderHeard>.active").text();
		mui.ajax({
	  		url:basePath+"api/SupplyOfGoods/TransportOrder",
	  		data:{
	  			mobile: userMobile,
  				status: orderType
	  		},
	  		contentType: "application/json",
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
	//替换数据
	function replaceData(data){
		var temp = "";
		for(var i=0;i<data.length;i++){
			var _priceSource = (data[i].Price_source!="不限"&&data[i].Price_source!="报价不限"&&data[i].Price_source)?"一口价:"+data[i].Price:"自由报价";
			
			temp += '<li priceType="'+data[i].Price_source+'" goodId="'+data[i].Id+'" class="order-detail d-flex bg-white padding-b-15 flex-column bor-bottom margin-b-10">'
								+ '<div class="d-flex padding-a-15 padding-b-15">'
									+ '<div class="flex-auto font-l3-color">'+data[i].Status+'</div>'
									+ '<div>'+_priceSource+'</div>'
								+ '</div>'
								+ '<div style="background-color: #FAFAFA;" class="d-flex flex-column padding-t-15 padding-b-15">'
									+ '<div class="d-flex align-items-center padding-l-15 padding-r-15 margin-b-8">'
										+ '<div class="start-area margin-r-15">起始地</div>'
										+ '<div class="">'+(data[i].Start_place?data[i].Start_place:"")+(data[i].Start_place_detail?data[i].Start_place_detail:"")+'</div>'
									+ '</div>'
									+ '<div class="d-flex align-items-center padding-l-15 padding-r-15 margin-b-10">'
										+ '<div class="end-area margin-r-15">目的地</div>'
										+ '<div class="">'+(data[i].End_place?data[i].End_place:"")+(data[i].End_place_detail?data[i].End_place_detail:"")+'</div>'
									+ '</div>'
									+ '<div class="d-flex padding-l-25 font-l2-color font-size-10">'
										+ '<span class="margin-r-5">'+data[i].Car_long+'</span>'
										+ '<span class="margin-r-5">'+data[i].Car_type+'</span>'
										+ '<span class="margin-r-5">'+data[i].Goods_name+'</span>'
										+ '<span class="margin-r-5">'+data[i].Goods_weight+'吨</span>'
										+ '<span class="margin-r-5">'+data[i].Goods_volume+'方</span>'
										+ '<span class="margin-r-5">'+data[i].Load_type+'</span>'
									+ '</div>'
								+ '</div>'
							+ '</li>'
		}
		$("#orderList").html(temp);
		$(".order-detail").on("click",function(){
			var goodId = $(this).attr("goodId");
			var priceType = $(this).attr("priceType");
			mui.openWindow({
				url:'../orderDetail/orderDetail.html?priceType='+priceType+'&goodId='+goodId
			});
		});
	}
	
	
	
	
	
	
});
