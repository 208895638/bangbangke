$(function(){
    $(".inforBox .span1").on("click",function(){
        $(".inforBox").addClass("on");
    });
    $(".inforBox .span2").on("click",function(){
        $(".inforBox").removeClass("on");
    });
    
});
var app1 = new Vue({
    el: '#app',
    data:{
        message:''
    },
    methods:{
        getMessage(){
            var m = JSON.parse(getStorage("secondCarData"));
            console.log(m);
            this.message = m;
            
        }
    },
    mounted() {
        this.getMessage();
    }
})