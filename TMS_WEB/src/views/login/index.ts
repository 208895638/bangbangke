import {store} from 'ts/util/store.ts';
import {api} from "/ts/util/api.ts";
import opg from 'ts/opg.ts';
import PopUp from "ts/ui/Popup.ts";

store.set('apiServer', window.CONFIG.apiServer);
store.set('loginPage', window.CONFIG.loginPage);

api({
    'getUserOrgsByUserAccount': 'user/GetUserOrgsByUserAccount',
    'login!post': 'user/login'
});

api.login.set('onError', function (code, error, callback) {
    top.opg.err(error, function () {
        allowSubmit = true;
    });
});

let allowSubmit = true;
let form = $('#loginForm');

type userParam = {
    orgId: number,
    username: string;
    password: string;
}
let account = '';
let getOrgUrl = function () {
    return `${opg.api.getUserOrgsByUserAccount}?=account=${account}`;
};
let orgs = [];
let orgSel = opg('#orgId').listBox({
    data: orgs,
    autoPrependBlank: false,
    name: 'orgId',
    value: 'org_id',
    text: 'org_name',
    selectedIndex: -1,
    onBind: function (data) {
        for (let i = 0; i < data.length; i++) {
            let temp = data[i];
            if (temp.org_default) {
                orgSel.setValue(temp.org_id);
                break;
            }
        }
    }
});

$(document).keypress(function (e) {
    // 回车键事件
    if (e.which == 13) {
        $('#btnLogin').trigger('click');
    }
});

function Login(param: userParam) {
    api.login(param, function (data) {

        let url = __uri('../main/main.html');


        let previousLoginName = store.get('user');
        //debugger;
        if (previousLoginName && previousLoginName === param.username) {
            let hash = opg.request['ReturnUrl'];
            if (hash) {
                url += hash;
            }
        }

        // store.set('Authorization', data);
        store.set('user', data);


        window.location.replace(url);

    });
}

$('#loginName').blur(function () {
    const $this = $(this);
    api.getUserOrgsByUserAccount({account: $this.val()}, data => {
        orgSel.update(data);
    });
//    console.log('loginName:', $this.val());
});

$('#btnLogin').click(function () {
    if (!allowSubmit) {
        return;
    }
    allowSubmit = false;

    let param = form.fieldsToJson({
        orgId: {
            name: '请选择公司',
            require: true,
        },
        username: {
            name: '用户名不能为空',
            require: true,
        },
        password: {
            name: '密码不能为空',
            require: true,
        },
    }, function () {
        allowSubmit = true;
    });

    if (param) {
        Login(param);
    }
});

