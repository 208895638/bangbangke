/**
 * User: tom
 * Date: 2018/6/22
 * Time: 10:48
 */
import {api} from "/ts/util/api";
import opg from '/ts/opg';
import {url} from 'ts/util/utils';

api({
    'getFunctionsByModuleId': 'function/GetFunctionsByModuleId',
    'getApisByFunId': 'apis/GetApisByFunId',
    'funAdd!post': 'function/add',
    'funEditor!post': 'function/editor',
    'apiAdd!post': 'apis/add',
    'apiEditor!post': 'apis/editor',
    'apiDelete!post': 'apis/delete',
    'functionDelete!post': 'function/delete'
});

const moduleId: number = ~~opg.request['moduleId'];
let functionId: number = 0;
let apiTitle: string = '';
let apiUrl = () => {
    return api.getApisByFunId + `?functionId=${functionId}`
};

let page = {
    init() {
        this.initFunctionGrid();
        this.initApiGrid();
        this.pageInit();
    },
    pageInit() {
        let that = this;
        $(window).on('resize', () => {
            that.functionGrid.jq.setGridHeight(that.gridHeight());
            that.apiGrid.jq.setGridHeight(that.gridHeight() - 38);
        });
    },
    gridHeight() {
        return ($(window).outerHeight() - 100);
    },
    initFunctionGrid() {
        let that = this;
        that.functionGrid = opg('#functionGrid').grid({
            url: api.getFunctionsByModuleId + `?moduleId=${moduleId}`,
            datatype: "json",
            colNames: ['id', '功能名称', '操作'],
            colModel: [
                {name: 'function_id', key: true, hidden: true},
                {name: 'function_name', sortable: false},
                {
                    name: 'function_id', width: 200, key: true,
                    formatter: (cellValue, options, rowObject) => {
                        let rowId = options.rowId;
                        return `<button cid="function_editor" class="btn btn-link operation function-editor" funId="${cellValue}" rowId="${rowId}">编辑</button><button class="btn btn-link operation function-delete" funId="${cellValue}" cId="function_delete">删除</button><button class="btn btn-link operation function-choose" funId="${cellValue}" rowId="${rowId}" cId="function_choose">选择</button>`
                    }
                }
            ],
            autoResize: true,
            toolbar: [
                {
                    id: 'function_add',
                    icon: 'fa-plus-circle',
                    name: '添加功能',
                    fun: () => {
                        that.methods.addFunction.call(that);
                    }
                }
            ],
            height: that.gridHeight()
        });
        that.functionGrid.jq.on('click.function', '.function-choose', (e) => {
            let $this = $(e.target), id = $this.attr('funid'),
                rowData = that.functionGrid.jqGridData.filter(r => r.function_id == id)[0];
            functionId = id;
            apiTitle = rowData.function_name;
            that.apiGrid.jq.setCaption(`当前选择功能名称 ${apiTitle}`).setGridParam({'url': apiUrl()});
            that.apiGrid.update();
        });
        that.functionGrid.jq.on('click.function', '.function-editor', (e) => {
            let $this = $(e.target), id = $this.attr('funid'),
                rowData = that.functionGrid.jqGridData.filter(r => r.function_id == id)[0];
            that.methods.functionForm(rowData, '编辑功能', (data) => {
                api.funEditor(data, () => {
                    that.functionGrid.update();
                    that.methods.functionPop.close();
                    top.opg.ok('更新成功');
                });
            }, 'editor');
        });
        that.functionGrid.jq.on('click.function', '.function-delete', (e) => {
            let $this = $(e.target), id = $this.attr('funid');
            console.log(id);
            opg.confirm('确认是否删除', () => {
                api.functionDelete({functionId: id}, () => {
                    that.functionGrid.update();
                });
            });
        });
    },
    initApiGrid() {
        let that = this;
        that.apiGrid = opg('#apiGrid').grid({
            caption: '当前选择功能名称',
            hidegrid: false,
            url: apiUrl(),
            datatype: "json",
            mtype: 'GET',
            multiselect: true,
            colNames: ['id', '名称', 'URL', '操作'],
            colModel: [
                {name: 'api_id', key: true, hidden: true},
                {name: 'api_name', width: 100, sortable: false},
                {name: 'api_url', width: 300, sortable: false},
                {
                    name: 'api_id', width: 100, key: true,
                    formatter: (cellValue, options, rowObject) => {
                        let rowId = options.rowId;
                        return `<button class="btn btn-link operation api-editor" apiId="${cellValue}" rowId="${rowId}" cId="function_editor">编辑</button>`
                    }
                }
            ],
            autoResize: true,
            toolbar: [
                {
                    id: 'api_add',
                    icon: 'fa-plus-circle',
                    name: '添加API',
                    fun: () => {
                        that.methods.addApi.call(that);
                    }
                },
                {
                    id: 'api_delete',
                    icon: 'fa-minus-circle',
                    name: '删除API',
                    fun: () => {
                        that.methods.delApi.call(that);
                    }
                }
            ],
            height: that.gridHeight() - 38
        });
        that.apiGrid.jq.on('click.api', '.api-editor', (e) => {
            let $this = $(e.target), id = $this.attr('apiId'),
                rowData = that.apiGrid.jqGridData.filter(r => r.api_id == id)[0];
            that.methods.apiForm(rowData, '编辑API', (data) => {
                api.apiEditor(data, () => {
                    that.apiGrid.update();
                    that.methods.apiPop.close();
                    top.opg.ok('更新成功');
                });
            }, 'editor');
        });
    },
    methods: {
        functionForm(data, title, callback, type = 'add') {
            let html = template('functionFormTpl', data);
            this.functionPop = top.opg.confirm($('<div class="padding" style="height: 211px; overflow-y: auto;"></div>').append(html), function (i, ifr) {
                functionForm.submit();
                return true;
            }, {
                title,
                width: 600,
                height: 300
            });
            let functionForm = top.window.$('#functionForm');
            functionForm
                .bootstrapValidator({
                    message: '',
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        functionName: {
                            validators: {
                                notEmpty: {
                                    message: '功能不能为空'
                                }
                            }
                        }
                    }
                })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    let $form = $(e.target),
                        params = $form.fieldsToJson();
                    params.moduleId = moduleId;
                    if (type == 'editor') {
                        params.functionId = data.function_id;
                    }
                    if ($.isFunction(callback)) {
                        callback(params);
                    }
                });
            if (type == 'editor') {
                let editorData = {
                    functionName: data['function_name'],
                    functionDescription: data['function_description']
                };
                functionForm.jsonToFields(editorData);
            }
        },
        addFunction() {
            let that = this;
            that.methods.functionForm([], '添加功能', (data) => {
                api.funAdd(data, () => {
                    that.functionGrid.update();
                    that.methods.functionPop.close();
                    top.opg.ok('添加成功');
                });
            });
        },
        apiForm(data, title, callback, type = 'add') {
            let html = template('apiFormTpl', data);
            this.apiPop = top.opg.confirm($('<div class="padding" style="height: 211px; overflow-y: auto;"></div>').append(html), function (i, ifr) {
                apiForm.submit();
                return true;
            }, {
                title,
                width: 600,
                height: 300
            });
            let apiForm = top.window.$('#apiForm');
            apiForm
                .bootstrapValidator({
                    message: '',
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        apiName: {
                            validators: {
                                notEmpty: {
                                    message: 'API名称不能为空'
                                }
                            }
                        },
                        apiUrl: {
                            validators: {
                                notEmpty: {
                                    message: 'API URL不能为空'
                                }
                            }
                        }
                    }
                })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    let $form = $(e.target),
                        params = $form.fieldsToJson();
                    params.functionId = functionId;
                    if (type == 'editor') {
                        params.apiId = data.api_id;
                    }
                    if ($.isFunction(callback)) {
                        callback(params);
                    }
                });
            if (type == 'editor') {
                let editorData = {
                    apiName: data['api_name'],
                    apiUrl: data['api_url'],
                    apiDescription: data['api_description']
                };
                apiForm.jsonToFields(editorData);
            }
        },
        addApi() {
            let that = this;
            if (functionId == 0) {
                opg.warn('请先选择功能，再进行添加API');
                return;
            }
            that.methods.apiForm([], '添加API', (data) => {
                api.apiAdd(data, () => {
                    that.apiGrid.update();
                    that.methods.apiPop.close();
                    top.opg.ok('添加成功');
                });
            });
        },
        delApi() {
            let that = this;
            let selRowKeys = that.apiGrid.jq.getGridParam("selarrrow");
            if (selRowKeys.length) {
                opg.confirm('确认是否删除', () => {
                    api.apiDelete(selRowKeys, () => {
                        that.apiGrid.update();
                    });
                });
            } else {
                opg.warn('请选择需删除的API');
            }
        }
    }
};
page.init();