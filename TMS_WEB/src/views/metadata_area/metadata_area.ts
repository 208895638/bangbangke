import {store} from 'ts/util/store.ts';
import opg from 'ts/opg.ts';
import PopUp from "ts/ui/Popup";
store.set('apiServer', window.CONFIG.apiServer);
store.set('loginPage', window.CONFIG.loginPage);

opg.api({
    'login!post': 'user/login'
});


