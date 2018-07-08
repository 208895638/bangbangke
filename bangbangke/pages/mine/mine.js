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
	data: {
		userMessage:""
	},
	methods:{
		openWindow(val){  // 点击跳转到货主认证 司机认证 意见反馈
			switch (val) {
				case 0:
					
					break;
				case 1:
					mui.openWindow({
						url:'../ownerOfGoods/ownerOfGoods.html'
					});
					break;
				case 2:
					mui.openWindow({
						url:'../certifiedDriver/certifiedDriver.html'
					});
					break;
				case 3:
					mui.openWindow({
						url:'../feedback/feedback.html'
					});
					break;
				default:
					break;
			}
		},
		init(){   // 获取用户信息
			var _this = this;
            mui.ajax({
                url:basePath+"api/User/GetUser?mobile="+getStorage("userMobile"),
                headers:{'Authorization':getStorage("appToken")},
                contentType: "application/json",
                // data: {
				// 	mobile:getStorage("userMobile")
                // },
                async: true ,
                dataType: 'json',
                type: 'get',
                timeout: 10000,
                success: function(data) {
                    console.log(JSON.stringify(data.data));
                    _this.userMessage = data.data;
                },
                error: function(err) {
                    mui.toast(err.msg,{ duration:'long', type:'div' }) ;
                }
            });
		}
	},
	mounted(){
		this.init();
	}
})
	

