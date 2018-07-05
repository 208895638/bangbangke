$(function(){
	
	
	mui.ajax({
  		url:basePath+"api/Common/GetHome",
  		contentType: "application/json",
    async: true ,
    dataType: 'json',
    type: 'get',
    timeout: 10000,
    success: function(data) {
    		console.log(data);
      if(data.code=="200"){
	      replaceImg(data.data.head);
	      replaceAdvert(data.data.tail);
      }else{
      		alert(data.msg);
      }
    },
    error: function(err) {
      alert(err);
    }
	});
	
	function replaceImg(data){
		var temp = "";
		for(var i=0;i<data.length;i++){
			temp += '<div style="background-image: url('+data[i].img+')" class="swiper-slide imgs">'
								+ '<a href="'+data[i].openurl+'" class="path"></a>'
							+ '</div>'
		}
		$(".swiper-wrapper").html(temp);
		var mySwiper = new Swiper('.swiper-container', {
			autoplay: 3000,//可选选项，自动滑动
		})
	}
	function replaceAdvert(data){
		var temp = "";
		for(var i=0;i<data.length;i++){
			temp += '<div style="background-image: url('+data[i].img+')" class="content-img margin-a-5">'
							+ '<a href="'+data[i].openurl+'" class="path"></a>'
							+'</div>'
		}
		$("#advert").html(temp);
	}
	
	//货源
	$("#goods").on("click",function(){
		mui.openWindow({
			url:'../supplyGoods/supplyGoods.html'
		});
	});
	
	//车源
	$("#cars").on("click",function(){
		mui.openWindow({
			url:'../supplyCar/supplyCar.html'
		});
	});
	
	//运单
	$("#order").on("click",function(){
		mui.openWindow({
			url:'../orderList/orderList.html'
		});
	});
	
	//专线
	$("#line").on("click",function(){
		mui.openWindow({
			url:'../specialLine/specialLine.html'
		});
	});
	
	//我的
	$("#mine").on("click",function(){
		mui.openWindow({
			url:'../mine/mine.html'
		});
	});
	
	//带发布
	$(".develop").on("click",function(){
		mui.openWindow({
			url:'../default/default.html'
		});
	});
	//仓库
	$("#warehouse").on("click",function(){
		mui.openWindow({
			url:'../warehouse/warehouse.html'
		});
	});
	//二手车
	$("#secondHandleCar").on("click",function(){
		mui.openWindow({
			url:'../secondhandCar/secondhandCar.html'
		});
	});
	//维修保养
	$("#maintenance").on("click",function(){
		mui.openWindow({
			url:'../maintenance/maintenance.html'
		});
	});
});
