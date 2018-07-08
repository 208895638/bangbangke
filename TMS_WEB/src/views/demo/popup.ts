/**
 * User: tom
 * Date: 2018/6/8
 * Time: 11:19
 */
import opg from 'ts/opg.ts';

$('#btnOk').click(() => {
    // console.log(opg().popup(`<div>1111</div>`));
    opg.ok('ok message');
});

$('#btnDanger').click(() => {
    opg.err('danger message');
});

$('#btnConfirm').click(() => {
    opg.danger('confirm message', () => {
        opg.ok('ok');
    });
});

$('#btnPopIframe').click(() => {
    let pop: PopUp = opg.confirm(`<div>pop content</div>`, function (i, ifr) {
        top.opg.ok('ok');
        return true;
    }, {
        title: `popup`,
        width: 500,
        height: 450,
        buttons: {
            ok: 'ok',
            cancel: 'cancel'
        },
    });
});

$('#btnTopPopIframe').click(() => {
    let pop = opg.popTop('<div style="height: 300px;width: 100%;overflow: auto;"><iframe src="http://www.bing.com" style="width: 100%;height: 100%"></iframe></div>', {
        title: 'title',
        width: 500,
        height: 300,
        buttons: {
            ok: {
                text: 'ok',
                className: 'btn-success',
                onClick: function (i, iframe) {
                    console.log(i, iframe);
                    return true;
                }
            },
            cancel: 'cancel'
        }
    })
});

window.otherClick = function () {
    opg.ok('其他操作')
};

let searchPanel = opg('#panel').panel({
    panelCls: 'panel-primary',
    title: '人员搜索',
    btnSearchClick: function () {
        opg.ok('检索')
    }
});
searchPanel.addToBody(`
        <div class="form-group input-group">
            <span class="input-group-addon">姓名</span>
            <input type="text" class="form-control" placeholder="Username">
        </div>`);
searchPanel.addToFoot('<button class="btn btn-info" style="margin-left: 10px;" onclick="window.otherClick()">其他操作</button>');

