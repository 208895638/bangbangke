/**
 * User: tom
 * Date: 2018/6/14
 * Time: 15:39
 */
import {api} from "/ts/util/api";
import opg from '/ts/opg';
import {url} from 'ts/util/utils';

api({
    'getTreeModules': 'module/GetTreeModules',
    'upModuleDisabledByModuleId!post': 'module/UpModuleDisabledByModuleId',
    'deleteModuleByModuleId!post': 'module/DeleteModuleByModuleId',
    'addModule!post': 'module/AddModule',
    'editorModule!post': 'module/EditorModule',
});
const functionPage = __uri('/views/module/function.html');
let page = {
    init() {
        this.initModelGrid();
    },
    initModelGrid() {
        let that = this;
        that.moduleTreeGrid = opg("#treegrid").grid({
            url: api.getTreeModules,
            // url: 'tree.json',
            datatype: "json",
            colNames: ['id', '模块名称', 'URL', '状态', '编辑'],
            colModel: [
                {name: 'id', width: 100, key: true, hidden: true},
                {name: 'name', width: 200, sortable: false},
                {name: 'url', width: 300, sortable: false},
                {
                    name: 'disabled', width: 100, sortable: false,
                    formatter: (cellValue, options, rowObject) => {
                        if (cellValue) {
                            return `<label class="t-checkbox"><input id="module_disabled" moduleId="${rowObject.id}" class="t-checkbox__inner module-disabled"  type="checkbox" value="0" ><span class="fa t-checkbox__label"></span></label>`;
                        } else {
                            return `<label class="t-checkbox"><input id="module_disabled"  moduleId="${rowObject.id}" class="t-checkbox__inner module-disabled"  type="checkbox" value="0" checked><span class="fa t-checkbox__label"></span></label>`;
                        }
                    }
                },
                {
                    name: 'id', width: 300, key: true, sortable: false,
                    formatter: (cellValue, options, rowObject) => {
                        let rowId = options.rowId;
                        if (rowObject.isLeaf) {
                            return `<button cId="module_editor" title="编辑" class="btn btn-link operation module-editor" moduleId="${cellValue}" rowId="${rowId}" isLeaf="${rowObject.isLeaf}">编辑</button><button class="btn btn-link operation module-delete" moduleId="${cellValue}" rowId="${rowId}" title="删除" cId="module_delete">删除</button><button class="btn btn-link operation module-function" moduleId="${cellValue}" rowId="${rowId}" title="功能管理" cId="module_function_manage">功能管理</button>`;
                        } else {
                            return `<button cId="module_editor" title="编辑" class="btn btn-link operation module-editor" moduleId="${cellValue}" rowId="${rowId}" isLeaf="${rowObject.isLeaf}">编辑</button>`;
                        }
                    }
                },
            ],
            // sortname: 'parent',
            // sortorder: "asc",
            // scroll: true,
            hiddengrid: true,
            gridview: true,
            treeGrid: true,
            treeGridModel: "adjacency",
            ExpandColumn: 'name',
            ExpandColClick: true,
            height: "auto",
            autoResize: true,
            toolbar: [
                {
                    id: 'module_add',
                    icon: 'fa-plus-circle',
                    name: '添加模块',
                    fun: () => {
                        that.methods.addModule.call(that);
                    }
                }
            ],
        });
        that.moduleTreeGrid.jq.on('change.module', '.module-disabled', (e) => {
            let $this = $(e.target), id = $this.attr('moduleId');
            api.upModuleDisabledByModuleId({
                moduleId: id,
                moduleDisabled: !$this.prop('checked')
            }, (data) => {
            });
        });
        that.moduleTreeGrid.jq.on('click.module', '.module-delete', (e) => {
            let $this = $(e.target), id = $this.attr('moduleId');
            opg.confirm('确认删除此模块？', (data) => {
                api.deleteModuleByModuleId({
                    moduleId: id
                }, () => {
                    that.moduleTreeGrid.update();
                });
            });
        });

        that.moduleTreeGrid.jq.on('click.module', '.module-editor', (e) => {
            e.stopImmediatePropagation();
            let $this = $(e.target),
                moduleId = $this.attr('moduleId'),
                rowData = that.moduleTreeGrid.jqGridData.filter(r => r.id == moduleId)[0];
            that.methods.moduleForm.call(that, rowData, '更新模块', (data) => {
                api.editorModule(data, () => {
                    that.moduleTreeGrid.update();
                    this.modulePop.close();
                });
            }, 'editor');
        });
        that.moduleTreeGrid.jq.on('click.module', '.module-function', (e) => {
            let $this = $(e.target), id = $this.attr('moduleId');
            that.methods.functionManage.call(that, $this, id);
        });
    },
    methods: {
        moduleForm(data, title, callback, type = 'add') {
            let that = this;
            let html = template('moduleAddFormTpl', data);
            this.modulePop = opg.confirm($('<div id="moduleForm" class="padding" style="height: 411px; overflow-y: auto;"></div>').append(html), function (i, ifr) {
                moduleForm.submit();
                return true;
            }, {
                title,
                width: 600,
                height: 500
            });
            let moduleForm = $('#moduleForm');
            let parentModuleId = 0;
            let moduleParent = moduleForm.find('#moduleParent');
            moduleForm.find('#btnChooseParentModule').on('click.module', (e) => {
                this.ztreePop = opg.confirm($('<div class="padding" style="height: 411px; overflow-y: auto;"><ul id="parentModuleZtree" class="ztree"></ul></div>'), function (i, ifr) {
                    let selectedNodes = that.parentModuleZtree.getSelectedNodes();
                    if (selectedNodes.length) {
                        moduleParent.val(selectedNodes[0]['name']);
                        parentModuleId = selectedNodes[0]["id"];
                    }
                }, {
                    title: '模块选择',
                    width: 400,
                    height: 500
                });
                let setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            pIdKey: "parent"
                        }
                    },
                    view: {
                        showIcon: false
                    }
                };
                let zNodes = that.moduleTreeGrid.jqGridData;
                zNodes = zNodes.map(z => {
                    z.url = '';
                    return z;
                });
                zNodes.unshift({id: 0, name: '根模块'});
                that.parentModuleZtree = $.fn.zTree.init($("#parentModuleZtree"), setting, zNodes);
                that.parentModuleZtree.expandAll(true);
            });
            moduleForm
                .bootstrapValidator({
                    message: '',
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        moduleName: {
                            validators: {
                                notEmpty: {
                                    message: '模块名称不能为空'
                                }
                            }
                        }
                    }
                })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    let $form = $(e.target),
                        params = $form.fieldsToJson();
                    params.parentModuleId = parentModuleId;
                    if (type == 'editor') {
                        params.moduleId = data.id;
                    }
                    if ($.isFunction(callback)) {
                        callback(params);
                    }
                });

            if (type == 'editor') {
                let parentInfo = {
                    parentId: 0,
                    parentName: ''
                };
                if (data['parent'] != '0') {
                    let findResult = that.moduleTreeGrid.jqGridData.filter(r => r.id == data['parent']);
                    if (findResult && findResult.length) {
                        parentInfo.parentId = findResult[0].id;
                        parentInfo.parentName = findResult[0].name;
                        parentModuleId = findResult[0].id;
                    }
                }

                let editorData = {
                    moduleName: data['name'],
                    moduleParent: parentInfo.parentName,
                    moduleUrl: data['url'],
                    moduleDescription: data['description']
                };
                moduleForm.jsonToFields(editorData);
            }
        },
        addModule() {
            let that = this;
            that.methods.moduleForm.call(that, [], '添加模块', (data) => {
                console.log(data);
                api.addModule(data, () => {
                    that.moduleTreeGrid.update();
                    this.modulePop.close();
                });
            });
        },
        functionManage(e, id) {
            let src = url.setParam(functionPage, {moduleId: id});
            let pop = opg.popTop(`<iframe src="${src}" />`, {
                title: `模块功能管理`,
                btnMax: false,
                width: 1100,
                height: 600,
                onClose: function () {
                },
            });

        }
    }
};

page.init();

