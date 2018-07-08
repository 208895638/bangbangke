/**
 * User: tom
 * Date: 2018/6/14
 * Time: 15:39
 */
import {api} from "/ts/util/api";
import opg from '/ts/opg';
import {AjaxMessage} from "../../ts/util/api";
import {url, gridEditrules} from "../../ts/util/utils";

api({
    'getAllRoles': 'role/GetAllRoles',
    'editor': 'role/Editor'
});
const authorityPage = __uri('/views/role/authority.html');
let page = {
    init() {
        this.initRoleGrid();
        this.pageInit();
    },
    pageInit() {
        let that = this;
        $(window).on('resize', () => {
            that.roleGrid.jq.setGridHeight(that.gridHeight());
        });
    },
    initRoleGrid() {
        let that = this;
        that.roleGrid = opg('#roleGrid').grid({
            url: api.getAllRoles,
            editurl: api.editor,
            hidegrid: false,
            datatype: "json",
            mtype: 'GET',
            colNames: ['id', '名称', '描述', '操作', '权限管理'],
            colModel: [
                {name: 'role_id', key: true, hidden: true},
                {
                    name: 'role_name',
                    width: 100,
                    sortable: false,
                    editable: true,
                    editrules: {custom: true, custom_func: gridEditrules.required}
                },
                {name: 'role_description', width: 300, sortable: false, editable: true},
                {
                    name: "actions",
                    width: 50,
                    formatter: "actions",
                    sortable: false,
                    formatoptions: {
                        keys: false,
                        delbutton: true,
                        onError: function (rowid, jqXHR, textStatus) {
                            opg.err("保存失败");
                        },
                        delOptions: {
                            errorTextFormat: function (res) {
                                let json = res.responseJSON;
                                return `<span class='padding'>${json.error}</span>`;
                            }
                        }
                    },
                },
                {
                    name: 'role_id',
                    width: 100,
                    sortable: false,
                    // editable: false,
                    formatter: (cellValue, options, rowObject) => {
                        let rowId = options.rowId;
                        return `<button class="btn btn-link operation role-authority" roleId="${parseInt(cellValue)}" rowId="${parseInt(rowId)}" cId="role_authority_manage">权限</button>`;
                    }
                }
            ],
            autoResize: true,
            height: that.gridHeight(),
            toolbar: [
                {
                    id: 'role_add',
                    icon: 'fa-plus-circle',
                    name: '添加角色',
                    fun: (e) => {
                        that.methods.addRole.call(that, e);
                    }
                }
            ],
        });

        that.roleGrid.jq.on('click.role', '.role-authority', (e) => {
            let $this = $(e.target), id = $this.attr('roleId');
            that.methods.authorityManage.call(that, $this, id);
        });

    },
    gridHeight() {
        return ($(window).outerHeight() - 100);
    },
    methods: {
        addRole(e) {
            this.roleGrid.jq.addRow({
                useFormatter: true
            });
        },
        authorityManage(e, id) {
            let src = url.setParam(authorityPage, {roleId: id});
            let pop = opg.popTop(`<iframe src="${src}" />`, {
                title: `权限管理`,
                btnMax: false,
                width: 1100,
                height: 600,
                onClose: function () {
                }
            });
        }
    }
};
page.init();