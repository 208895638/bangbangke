/**
 * User: tom
 * Date: 2018/6/14
 * Time: 15:39
 */
import {api} from "/ts/util/api";
import opg from '/ts/opg';
import {gridEditrules, url} from "../../ts/util/utils";
import {EditTypeEnum} from "../../ts/ui/Grid";

api({
    'getFreightRules!post': 'freightrule/GetFreightRules',
    'saveFreightRule!post': 'freightrule/SaveFreightRule',
    'batchSaveFreightRule!post': 'freightrule/BatchSaveFreightRule',
    'deleteFreightRuleById': 'freightrule/DeleteFreightRuleById'
});

let editRowIds: Array = [];
let editType: EditTypeEnum;
const detailPage = __uri('/views/freightrule/freightruledtl.html');
let page = {
    init() {
        this.initSearchPanel();
        this.initFreightruleGrid();
    },
    initSearchPanel() {
        let that = this;
        let searchPanel = opg('#freightruleSearchPanel').panel({
            panelCls: 'panel-info',
            title: '运费规则搜索',
            btnSearchClick() {
                that.freightruleGrid.update();
            }
        });
        searchPanel.addToBody(`
            <div class="row">
               <div class="col-md-6">
                   <div class="form-group form-inline form-group-sm">
                       <label for="freightRuleCode" class="mr10">规则编号</label>
                       <input type="text" class="form-control w90" name="freightRuleCode" id="freightRuleCode" placeholder="">
                   </div>
               </div> 
               <div class="col-md-6">
                   <div class="form-group form-inline form-group-sm">
                       <label for="freightRuleName" class="mr10">规则名称</label>
                       <input type="text" class="form-control w90" name="freightRuleName" id="freightRuleName" placeholder="">
                   </div>
               </div> 
            </div>
        `);
    },
    initFreightruleGrid() {
        let that = this;
        that.freightruleGrid = opg('#freightruleGrid').grid({
            url: api.getFreightRules,
            datatype: 'json',
            mtype: 'POST',
            postData: {
                freightRuleCode: () => {
                    return $('#freightRuleCode').val()
                },
                freightRuleName: () => {
                    return $('#freightRuleName').val()
                }
            },
            colModel: [
                {label: '序号', name: 'freightRuleId', width: 16, sortable: false, keys: true},
                {label: '创建日期', name: 'freightRuleCreateDate', width: 30, sortable: false},
                {
                    label: '规则编号',
                    name: 'freightRuleCode',
                    width: 40,
                    sortable: false,
                    editable: true,
                    editrules: {custom: true, custom_func: gridEditrules.required}
                },
                {
                    label: '规则名称',
                    name: 'freightRuleName',
                    width: 50,
                    sortable: false,
                    editable: true,
                    editrules: {custom: true, custom_func: gridEditrules.required}
                },
                {label: '备注', name: 'freightRuleNote', sortable: false},
                {
                    label: '编辑', width: 50, key: true, sortable: false, editable: false,
                    formatter: (cellValue, options, rowObject) => {
                        let rowId = options.rowId;
                        return `<button class="btn btn-link operation freightrule-show-detail" rowId="${rowId}" cId="freightrule_show_detail">规则明细</button><button class="btn btn-link operation freightrule-delete" rowId="${rowId}" cId="freightrule_delete">删除</button>`;
                    }
                }
            ],
            height: 'auto',
            autoResize: true,
            ondblClickRow: function (rowId) {
                that.methods.editorRule.call(that, rowId);
            },
            toolbar: [
                {
                    id: 'freightrule_add',
                    icon: 'fa-plus-circle',
                    name: '添加规则',
                    fun: () => {
                        that.methods.addRule.call(that);
                    }
                },
                {
                    id: 'freightrule_save',
                    icon: 'fa-save',
                    name: '保存规则',
                    hidden: true,
                    fun: () => {
                        that.methods.saveRule.call(that);
                    }
                },
                {
                    id: 'freightrule_cancel',
                    icon: 'fa-mail-reply-all',
                    name: '放弃',
                    hidden: true,
                    fun: () => {
                        that.methods.cancelRule.call(that);
                    }
                }
            ]
        });
        that.freightruleGrid.jq.on('click', '.freightrule-delete', (e) => {
            e.stopImmediatePropagation();
            let $this = $(e.target),
                rowId = $this.attr('rowId'),
                rowData = that.freightruleGrid.jq.getRowData(rowId, true);
            that.methods.deleteRule.call(that, rowId, rowData);
        });

        that.freightruleGrid.jq.on('click', '.freightrule-show-detail', e => {
            e.stopImmediatePropagation();
            let $this = $(e.target),
                rowId = $this.attr('rowId'),
                rowData = that.freightruleGrid.jq.getRowData(rowId, true);
            that.methods.showRuleDetail.call(that, rowId, rowData);
        });
    },
    methods: {
        initEditor() {
            editRowIds = [];
            editType = null;
            this.freightruleGrid.toolBar
                .hideItem(1)
                .hideItem(2)
                .showItem(0);
        },
        addRule() {
            if (editType) return;
            editType = EditTypeEnum.Add;
            let that = this;
            that.freightruleGrid.toolBar
                .hideItem(0)
                .showItem(1)
                .showItem(2);
            that.freightruleGrid.jq.addRow();
        },
        saveRule() {
            let that = this;
            if (editType == EditTypeEnum.Add) {
                let rowId = that.freightruleGrid.jq.getGridParam('selrow');
                $.jgrid.inlineEdit = {restoreAfterError: false};
                that.freightruleGrid.jq.saveRow(rowId, function (res) {
                    let json = res.responseJSON;
                    if (json.error) {
                        return [false, json.error];
                    }
                    that.methods.initEditor.call(that);
                    return [true, res.responseJSON.data];
                }, api.saveFreightRule, {oper: editType}, null, function (rId, res, stat) {
                    // that.methods.initEditor.call(that);
                    opg.err(res.responseJSON.error);
                });
            } else if (editType == EditTypeEnum.Edit) {
                let data = [];
                for (let i = 0; i < editRowIds.length; i++) {
                    let rowId = editRowIds[i];
                    let tmp = that.freightruleGrid.gridEditorRowData(rowId);
                    if (tmp) {
                        let obj = {};
                        let oldRowData = that.freightruleGrid.jq.getRowData(rowId, true);
                        tmp['freightRuleId'] = oldRowData.freightRuleId;
                        obj[rowId] = tmp;
                        data.push(obj);
                    }
                }
                if (data.length == editRowIds.length) {
                    api.batchSaveFreightRule(data, (data) => {
                        let errorInfo = [];
                        for (let key in data) {
                            let remoteData = data[key];
                            if (remoteData) {
                                let oldRowData = that.freightruleGrid.jq.getRowData(key, true);
                                let newRowData = $.extend(oldRowData, {
                                    freightRuleCode: remoteData.freightRuleCode,
                                    freightRuleName: remoteData.freightRuleName,
                                    freightRuleCreateDate: remoteData.freightRuleCreateDate
                                });
                                // that.freightruleGrid.jq.setRowData(key, newRowData);
                                that.freightruleGrid.saveClientRowData(key, newRowData);
                            } else {
                                errorInfo.push(remoteData);
                            }
                        }
                        if (errorInfo.length) {
                            opg.err('存在错误，请检查数据后再保存');
                        } else {
                            that.methods.initEditor.call(that);
                        }
                    });
                }
            }

        },
        cancelRule() {
            let that = this;
            if (editType == EditTypeEnum.Add) {
                let rowId = that.freightruleGrid.jq.getGridParam('selrow');
                that.freightruleGrid.jq.restoreRow(rowId);
                that.methods.initEditor.call(that);
            } else if (editType == EditTypeEnum.Edit) {
                for (let i = 0; i < editRowIds.length; i++) {
                    let rowId = editRowIds[i];
                    that.freightruleGrid.jq.restoreRow(rowId);
                }
                that.methods.initEditor.call(that);
            }
        },
        editorRule(rowId) {
            // if (editType) return;
            if (editType != EditTypeEnum.Edit) {
                editType = EditTypeEnum.Edit;
            }
            let that = this;
            editRowIds.push(rowId);
            that.freightruleGrid.toolBar
                .hideItem(0)
                .showItem(1)
                .showItem(2);
            that.freightruleGrid.jq.editRow(rowId);
        },
        deleteRule(rowId, rowData) {
            let that = this;
            if (editType) {
                return;
            }
            opg.confirm('确认是否删除', () => {
                editType = EditTypeEnum.Delete;
                that.methods.initEditor.call(that);
                api.deleteFreightRuleById({freightRuleId: rowData.freightRuleId}, (data) => {
                    that.freightruleGrid.update();
                });
            });
        },
        showRuleDetail(rowId, rowData) {
            let that = this;
            let src = url.setParam(detailPage, {freightRuleId: rowData.freightRuleId});
            let pop = opg.popTop(`<iframe src="${src}" />`, {
                title: `${rowData.freightRuleName}(${rowData.freightRuleCode}) - 规则明细`,
                btnMax: false,
                width: 1100,
                height: 600,
                onClose: function () {
                    that.freightruleGrid.update();
                }
            });
        }
    }
};

page.init();