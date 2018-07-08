$(function(){

});

var app3 = new Vue({
    el: '#app',
	data: {
        stepShow1:false,
        stepShow2:true,
        stepShow3:false,
        username:"",
        idCard:"",
        companyName:"",
        companyAddress:"",
        successShow:false,
        failedShow:false,
        cartype:"aa",
        step1Show:true,
        step2Show:false,
        step3Show:false,
        selectedArea:"全国",
        provincesData:"",
        step1Border:"",
        cityList:"",
        step2Border:"",
        areasList:"",
        step3Border:"",
        selectArea:false,
        carLength:"",
        chepai:"",
        chexing:"",
        chechang:"",
        zaizhong:"",
        pinpai:"",
        year:"",
        selectType:""
    },
    computed:{
        addClass(){
            var result = false;
            if(this.username != "" && this.idCard != "")
                result = true;
            return result;
        }
    },
    mounted(){
        // this.getProvinces(); //获取省数据
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
            if( this.username == "" || this.idCard =="" ){
                 mui.toast('身份证或姓名不能为空!',{ duration:'long', type:'div' }) ;
            }else if(!this.testIdCard(this.idCard)){
                mui.toast('身份证号码格式不正确!',{ duration:'long', type:'div' }) ;
            }else if(!this.testName(this.username)){
                mui.toast('姓名格式不正确,请输入2-4位中文!',{ duration:'long', type:'div' }) ;
            }else{
                this.stepShow1 = false;
                this.stepShow2 = true;
                this.stepShow3 = false;
            }
        },
        nextStep2(){ //上传公司姓名和地址
            if( this.companyName == "" || this.companyAddress =="" ){
                mui.toast('公司姓名或公司地址不能为空!',{ duration:'long', type:'div' }) ;
            }else{
                this.sendMessage();
            }
        },
        sendMessage(){  //
            var _this = this;
            mui.ajax({
                url:basePath+"api/User/OwnerCertification",
                // headers:{'Authorization':token},
                contentType: "application/json",
                data: {
                    username:this.username,
                    mobile:getStorage("userMobile"),
                    id_card:this.idCard,
                    company:this.companyName,
                    company_address:this.companyAddress
                },
                async: true ,
                dataType: 'json',
                type: 'post',
                timeout: 10000,
                success: function(data) {
                    console.log(data);
                    if(data.code == 200){
                        _this.stepShow1 = false;
                        _this.stepShow2 = false;
                        _this.stepShow3 = true;
                    }else{
                        mui.toast(data.msg,{ duration:'long', type:'div' })
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        },
        getCitiesList (data , index){  // 选中 车长或车型或出场年份
            
            switch (this.selectType) {
                case 0:
                    this.chexing = data;
                    break;
                case 1:
                    this.chechang = data;
                    break;
                default:
                    break;
            }
            // this.step1Border = index;
            this.selectArea = false;
            this.step1Show = false;
        },
        selectCarLength( val ){ //获取车型 车长 出场年份数据
            var _this = this;
            this.selectArea = true;
            this.step1Show = true;
            switch (val) {
                case 0:
                    _this.getCarType(0);
                    break;
                case 1:
                    _this.getCarLength(1);
                    break;
                default:
                    break;
            }
            
            
        },   
        getCarLength(val){  // 获取车长数据
            var _this = this;
            this.selectType = val;
            mui.ajax({
                url:basePath+"api/Common/GetCarLong",
                contentType: "application/json",
                async: true ,
                dataType: 'json',
                type: 'get',
                timeout: 10000,
                success: function(data) {
                    if(data.code=="200"){
                        _this.carLength = data.data;
                    }else{
                            alert(data.msg);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        },
        getCarType(val){  // 获取车型数据
            var _this = this;
            this.selectType = val;
            mui.ajax({
                url:basePath+"api/Common/GetCarType",
                contentType: "application/json",
                async: true ,
                dataType: 'json',
                type: 'get',
                timeout: 10000,
                success: function(data) {
                    if(data.code=="200"){
                        _this.carLength = data.data;
                    }else{
                            alert(data.msg);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        },
	}
})