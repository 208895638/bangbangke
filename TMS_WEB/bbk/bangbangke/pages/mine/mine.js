$(function(){
	$("#home").on("click",function(){
		mui.openWindow({
			url:'../home/home.html'
		});
	});
	$("#order").on("click",function(){
		mui.openWindow({
			url:'../orderList/orderList.html'
		});
	});
})