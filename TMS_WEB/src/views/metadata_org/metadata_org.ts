
import { store } from 'ts/util/store.ts';
import { api } from "/ts/util/api";
import opg from 'ts/opg.ts';
import PopUp from "ts/ui/Popup";


api({
    'MetadataOrgAdd!post': 'MetadataOrg/MetadataOrgAdd',
    'login!post': 'user/login'
});

let form = $('#Addform');

$('#Add').click(function () {

    let param = form.fieldsToJson({});
    console.log(param);
api.MetadataOrgAdd(param, function (data) {
    console.log(data);
});
});