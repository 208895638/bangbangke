$(function(){
	var _userMobile = getStorage("userMobile");
	var token  = getStorage("appToken");
	var carId = getPar("carId");
	mui.ajax({
  		url:basePath+'api/VehicleSource/VehicleSourceId/'+carId,
    headers:{'Authorization':token},
  		contentType: "application/json",
    async: true ,
    dataType: 'json',
    type: 'post',
    timeout: 10000,
    success: function(data) {
    		console.log(data);
      if(data.code=="200"){
	      replaceData(data.data[0]);
      }else{
      		alert(data.msg);
      }
    },
    error: function(err) {
      alert(err);
    }
	});
	
	function replaceData(data){
		$("#start").text(data.Starting_ground);
		$("#end").text(data.Destination);
		$("#userName").text(data.userName?("司机姓名："+data.userName):("司机姓名：暂无"));
		$("#info1").text("车牌:"+data.Vehicle_number);
		$("#info2").text("车型:"+data.Vehicle_type);
		$("#info3").text("重量:"+data.Load);
		$("#info4").text("车长:"+data.car_long);
		$("#phone").attr("href","tel:"+data.Driver_mobile)
		
	}
		
})
