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
})