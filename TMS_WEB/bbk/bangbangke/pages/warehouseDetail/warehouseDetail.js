$(function(){
    var data = JSON.parse(getStorage("data"));
    console.log(data);
    $("#Contact_information").html(data.Contact_information);
    $("#Contact_person").html(data.Contact_person);
    $("#Fire_class").html(data.Fire_class);
    $("#Price").html(data.Price);
    $("#Title").html(data.Title);
    $("#Warehouse_address").html(data.Warehouse_address);
    $("#Warehouse_area").html(data.Warehouse_area);
    $("#Warehouse_floor").html(data.Warehouse_floor);
    $("#Warehouse_type").html(data.Warehouse_type);
    var map = new BMap.Map("map");
	var token = getStorage("appToken");
	var _userMobile = getStorage("userMobile");
	map.centerAndZoom("上海", 11);
    map.enableScrollWheelZoom(true);
    var geolocation = new BMap.Geolocation();
    map.addControl(new BMap.NavigationControl());    
    map.addControl(new BMap.ScaleControl());    
    map.addControl(new BMap.OverviewMapControl());    
    map.addControl(new BMap.MapTypeControl());    
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            console.log(r.point.lng+','+r.point.lat)
        }
        else {
            alert('failed'+this.getStatus());
        }        
    },{enableHighAccuracy: true})
})