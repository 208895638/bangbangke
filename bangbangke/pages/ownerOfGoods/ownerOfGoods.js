$(function(){

});

var app3 = new Vue({
    el: '#app',
	data: {
        stepShow1:true,
        stepShow2:false,
        stepShow3:false,
        username:"",
        idCard:"",
        companyName:"",
        companyAddress:""
    },
    computed:{
        addClass(){
            var result = false;
            if(this.username != "" && this.idCard != "")
                result = true;
            return result;
        }
    },
	methods:{
		testIdCard: function (val) { //检查身份证
            var myreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return myreg.test(val);
        },
        testName:function(val){ //检查输入的姓名
            var myreg = /^[\u4E00-\u9FA5]{2,4}$/;
            return myreg.test(val);
        },
        nextStep1(){  // 上传姓名 身份证
            if( this.username == "" || this.idCard =="" )
                mui.toast('身份证或姓名不能为空!',{ duration:'long', type:'div' }) ;
            
            if(!this.testIdCard(this.idCard))
                mui.toast('身份证号码格式不正确!',{ duration:'long', type:'div' }) ;
            if(!this.testName(this.username))
                mui.toast('姓名格式不正确,请输入2-4位中文!',{ duration:'long', type:'div' }) ;
            this.stepShow1 = false;
            this.stepShow2 = true;
            this.stepShow3 = false;
        },
        nextStep2(){ //上传公司姓名和地址
            if( this.companyName == "" || this.companyAddress =="" )
                mui.toast('公司姓名或公司地址不能为空!',{ duration:'long', type:'div' }) ;
            this.stepShow1 = false;
            this.stepShow2 = false;
            this.stepShow3 = true;
        }
	}
})