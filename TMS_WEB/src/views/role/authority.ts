/**
 * User: tom
 * Date: 2018/6/22
 * Time: 10:48
 */
import {api} from "/ts/util/api";
import opg from '/ts/opg';
import {url} from 'ts/util/utils';

api({
    'getTreeModules': 'module/GetTreeModules',
    'getEnableModulesByRoleId': 'module/GetEnableModulesByRoleId',
    'roleHandler!post': 'role/RoleHandler',
    'getFunctionsByModuleId': 'function/GetFunctionsByModuleId',
    'getFunctionsByRoleIdAndModuleId': 'role/GetFunctionsByRoleIdAndModuleId',
    'roleUpFunction!post': 'role/RoleUpFunction',
});

const roleId: number = ~~opg.request['roleId'];
let moduleId: number = 0;
let modules: any;
let functions: Array = [];
let roleModules: Array = [];
let selTreeNode: any;
let functionUrl = () => {
    return api.getFunctionsByModuleId + `?moduleId=${moduleId}`
};
let page = {
    init() {
        this.initTree();
        this.initFunctionGrid();
        this.pageInit();
    },
    pageInit() {
        let that = this;
        $(window).on('resize', () => {
            that.functionGrid.jq.setGridHeight(that.gridHeight());
        });
    },
    initTree() {
        let that = this;
        const setting = {
            check: {
                enable: true
            },
            view: {
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true,
                    pIdKey: "parent"
                },
            },
            callback: {
                onCheck: function (event, treeId, treeNode) {
                    that.methods.zTreeOnCheck.call(that, event, treeId, treeNode)
                },
                onClick: function (event, treeId, treeNode) {
                    that.methods.zTreeOnClick.call(that, event, treeId, treeNode)
                }
            }
        };
        $.when(
            api.getTreeModules(data => {
                modules = data;
            }),
            api.getEnableModulesByRoleId({roleId}, data => {
                roleModules = data;
            })
        ).then(() => {
            let zNodes = modules;
            zNodes = zNodes.map(z => {
                z.checked = roleModules.includes(parseInt(z.id));
                z.url = '';
                return z;
            });
            that.moduleZtree = $.fn.zTree.init($("#moduleTree"), setting, zNodes);
            that.moduleZtree.expandAll(true);
        });
    },
    initFunctionGrid() {
        let that = this;
        that.functionGrid = opg('#functionGrid').grid({
            url: functionUrl(),
            datatype: "json",
            colNames: ['id', '功能名称', '状态'],
            colModel: [
                {name: 'function_id', key: true, hidden: true},
                {name: 'function_name', sortable: false},
                {
                    name: 'function_id', width: 100, sortable: false,
                    formatter: (cellValue, options, rowObject) => {
                        if (!functions.includes(parseInt(cellValue))) {
                            return `<label class="t-checkbox"><input functionId="${cellValue}" class="t-checkbox__inner function-disabled"  type="checkbox" value="0" ><span class="fa t-checkbox__label"></span></label>`;
                        } else {
                            return `<label class="t-checkbox"><input functionId="${cellValue}" class="t-checkbox__inner function-disabled"  type="checkbox" value="0" checked><span class="fa t-checkbox__label"></span></label>`;
                        }
                    }
                },
            ],
            autoResize: true,
            height: that.gridHeight()
        });
        that.functionGrid.jq.on('change.module', '.function-disabled', (e) => {
            let $this = $(e.target), id = $this.attr('functionId');
            if ($this.prop('checked')) {
                if (!selTreeNode.checked) {
                    opg.warn('请先对模块进行赋权');
                    $this.prop('checked', false);
                    return true;
                }
            } else {
                if (!selTreeNode.checked) {
                    $this.prop('checked', true);
                    return true;
                }
            }

            api.roleUpFunction({
                roleId,
                moduleId,
                functionId: id,
                functionChecked: $this.prop('checked')
            }, (data) => {

            });
        });
    },
    gridHeight() {
        return ($(window).outerHeight() - 60);
    },
    methods: {
        zTreeOnCheck(event, treeId, treeNode) {

            let nodes = this.moduleZtree.getChangeCheckedNodes();
            if (!nodes.length) return;
            let moduleIds = [];
            for (let i = 0, l = nodes.length; i < l; i++) {
                nodes[i].checkedOld = nodes[i].checked;
                moduleIds.push(nodes[i].id);
            }
            api.roleHandler({roleId, Checked: nodes[0].checked, moduleIds}, (data) => {

            });
        },
        zTreeOnClick(event, treeId, treeNode) {
            selTreeNode = treeNode;
            let that = this;
            that.methods.updateFunctionGrid.call(that);
        },
        updateFunctionGrid() {
            moduleId = selTreeNode.id;
            let that = this;
            api.getFunctionsByRoleIdAndModuleId({roleId, moduleId}, (data) => {
                functions = data;
                that.functionGrid.jq.setGridParam({'url': functionUrl()});
                that.functionGrid.update();
            });
        }
    }
};
page.init();