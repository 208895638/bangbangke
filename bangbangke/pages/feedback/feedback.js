$(function(){
    
});
var app1 = new Vue({
    el: '#app',
    data:{
        suggesstionShow:false,
        noResult:true,
        hasResult:false,
        
        mySuggestion:""
    },
    computed:{
        addClass(){
            console.log(this.mySuggestion)
            if(this.mySuggestion != ""){
                return true;
            }else {
                return false;
            }
        }
    },
    methods:{
        feedBack(){ //点击添加反馈 
            this.suggesstionShow = true;
            this.noResult = false;
            this.hasResult = false;
        },
        nextStep2(){ //向后台发送添加反馈的信息
            mui.toast('提交成功',{ duration:'long', type:'div' }) 
            // var _this = this;
            // mui.ajax({
            //     url:basePath+"api/User/GetUser?mobile="+getStorage("userMobile"),
            //     headers:{'Authorization':getStorage("appToken")},
            //     contentType: "application/json",
            //     // data: {
			// 	// 	mobile:getStorage("userMobile")
            //     // },
            //     async: true ,
            //     dataType: 'json',
            //     type: 'get',
            //     timeout: 10000,
            //     success: function(data) {
            //         console.log(JSON.stringify(data.data));
            //         _this.userMessage = data.data;
            //     },
            //     error: function(err) {
            //         mui.toast(err.msg,{ duration:'long', type:'div' }) ;
            //     }
            // });
        }
    },
    mounted() {
        
    }
})