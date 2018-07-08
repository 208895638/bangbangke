import {store} from 'ts/util/store';

//Store.use('sessionStorage');

interface IConfig {
    apiServer: string;
    ajaxTimeOut: number;
    loginPage: string;
    version: string;
    onServerError?: Function;
    onUnauthorizedError?: Function;
}

let cfg: IConfig = {
    apiServer: (window.CONFIG && window.CONFIG.apiServer) ? window.CONFIG.apiServer : (store.get('apiServer') || null),
    ajaxTimeOut: 1800000,
    loginPage: (window.CONFIG && window.CONFIG.loginPage) ? window.CONFIG.loginPage : (store.get('loginPage') || '../login/index.html'),
    version: '1.0.3_20180411',
};

cfg.onUnauthorizedError = function () {
    let param = '', url = cfg.loginPage;
    if (top.window.location.hash) {
        param = '?ReturnUrl=' + encodeURIComponent(top.window.location.hash);
        url += param;
    }
    top.window.location.href = url;
};


const globalErrorCodes = {
    'exception': '服务器内部错误',
    'delete_failure': '删除失败',
    'add_failure': '新增失败',
    'update_failure': '更新失败',
    'query_failure': '查询失败',
    'max_length': '输入超出最大长度',
    'token_exception': 'token验证失败',
};


cfg.onServerError = function (code: number, errorMsg: string = 'unknown error', callback?: Function) {

    if (code === 401 && location.pathname != cfg.loginPage) {
        cfg.onUnauthorizedError();
    }
    // else if (code === 200 && location.pathname != cfg.loginPage && errorMsg == 20000) {
    //    top.opg.err(`api.${this.name} 未获取到权限`);
    // }
    else {
        //top.opg.err(`api.${this.name} error ${code} (${errorMsg})`);
        // top.opg.err(`api.${this.name} error (${errorMsg})`);
        top.opg.err(`${errorMsg}`);
    }

};


export default cfg;


