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
});

var app3 = new Vue({
    el: '#app',
	data: {},
	methods:{
		openWindow(val){
			switch (val) {
				case 0:
					
					break;
				case 1:
					mui.openWindow({
						url:'../ownerOfGoods/ownerOfGoods.html'
					});
					break;
				default:
					break;
			}
		}
	}
})
	

