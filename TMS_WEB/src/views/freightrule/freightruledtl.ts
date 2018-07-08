/**
 * User: tom
 * Date: 2018/6/29
 * Time: 15:48
 */

import {api} from "/ts/util/api";
import opg from '/ts/opg';
import {array, gridEditrules} from "../../ts/util/utils";
import {EditTypeEnum} from "../../ts/ui/Grid";
import set = Reflect.set;


api({
    'getAllRangetype': 'freightruledtl/GetAllRangetype',
    'getAllChargemode': 'freightruledtl/GetAllChargemode',
    'getFreightRuledtlsByRuleId': 'freightruledtl/GetFreightRuledtlsByRuleId',
    'saveFreightRuleDetail!post': 'freightruledtl/SaveFreightRuleDetail',
    'batchSaveFreightRuleDetail!post': 'freightruledtl/BatchSaveFreightRuleDetail'
});
const freightRuleId: number = ~~opg.request['freightRuleId'];
let editRowIds: Array = [];
let editType: EditTypeEnum;
let rangeTypes: any;
let chargeModes: any;
let rangeTypesSelOptions: Array = [];
let chargeModesSelOptions: Array = [];
let isEditor: boolean = false;
let page = {
    init() {
        let that = this;
        $.when(
            api.getAllRangetype(d => {
                rangeTypes = d;
            }),
            api.getAllChargemode(d => {
                chargeModes = d;
            })
        ).then(() => {
            console.log(rangeTypes, chargeModes);
            rangeTypes.forEach(item => {
                rangeTypesSelOptions.push(`${item.freightruledtl_rangetype_id}:${item.freightruledtl_rangetype_name}`);
            });
            chargeModes.forEach(item => {
                chargeModesSelOptions.push(`${item.freightruledtl_chargemode_id}:${item.freightruledtl_chargemode_name}`);
            });
            that.initFreightruledtlGrid();
        });
    },
    initFreightruledtlGrid() {
        let that = this;
        that.freightruledtlGrid = opg('#freightruledtlGrid').grid({
            url: `${api.getFreightRuledtlsByRuleId}?freightRuleId=${freightRuleId}`,
            datatype: 'json',
            height: 'auto',
            autoResize: true,
            multiselect: true,
            colModel: [
                {
                    name: 'freightrule_id',
                    id: 'freightrule_id',
                    editable: false,
                    sortable: false,
                    hidden: true
                },
                {
                    name: 'freightruledtl_id',
                    id: 'freightruledtl_id',
                    editable: false,
                    // sortable: false,
                    sorttype: "int",
                    hidden: true
                },
                {
                    label: '序号', name: 'freightruledtl_code',
                    width: 16,
                    sortable: false,
                    editable: true,
                    editrules: {
                        number: true,
                        required: true,
                        minValue: 0
                    }
                },
                {
                    label: '区间类型',
                    name: 'freightruledtl_rangetype_name',
                    width: 50,
                    sortable: false,
                    editable: true,
                    edittype: "select",
                    editoptions: {
                        value: rangeTypesSelOptions.join(';')
                    }
                },
                {
                    label: '计算方式',
                    name: 'freightruledtl_chargemode_name',
                    width: 50,
                    sortable: false,
                    editable: true,
                    edittype: "select",
                    editoptions: {
                        value: chargeModesSelOptions.join(';')
                    }
                },
                {
                    label: '最低',
                    name: 'range_minimum',
                    width: 50,
                    sortable: false,
                    editable: true,
                    editrules: {
                        number: true,
                        required: true,
                        minValue: 0
                    }
                },
                {
                    label: '最高',
                    width: 50,
                    name: 'range_maximum',
                    sortable: false,
                    editable: true,
                    editrules: {
                        number: true,
                        required: true,
                        minValue: 0
                    }
                },
                {
                    label: '区间名称',
                    name: 'range_name',
                    sortable: false
                },
            ],
            toolbar: [
                {
                    id: 'freightrule_add',
                    icon: 'fa-plus-circle',
                    name: '添加规则明细',
                    fun: () => {
                        that.methods.addRuleDetail.call(that);
                    }
                },
                {
                    id: 'freightrule_save',
                    icon: 'fa-save',
                    name: '保存规则明细',
                    hidden: true,
                    fun: () => {
                        that.methods.saveRuleDetail.call(that);
                    }
                },
                {
                    id: 'freightrule_cancel',
                    icon: 'fa-mail-reply-all',
                    name: '放弃',
                    hidden: true,
                    fun: () => {
                        that.methods.cancelRuleDetail.call(that);
                    }
                },
                {
                    id: 'freightrule_editor',
                    icon: 'fa-edit',
                    name: '编辑',
                    hidden: true,
                    fun: () => {
                        that.methods.editorRuleDetail.call(that);
                    }
                }
            ],
            gridComplete: function () {
                that.methods.gridComplete.call(that);
            }
        });
    },
    methods: {
        initEditor() {
            editRowIds = [];
            editType = null;
            this.freightruledtlGrid.toolBar
                .hideItem(1)
                .hideItem(2)
                .showItem(0);

            if (isEditor) {
                this.freightruledtlGrid.toolBar
                    .showItem(3);
            }
        },
        addRuleDetail() {
            if (editType) return;
            editType = EditTypeEnum.Add;
            let that = this;
            that.freightruledtlGrid.toolBar
                .hideItem(0)
                .showItem(1)
                .showItem(2);
            that.freightruledtlGrid.jq.addRow();
        },
        saveRuleDetail() {
            let that = this;
            if (editType == EditTypeEnum.Add) {
                let rowId = that.freightruledtlGrid.jq.getGridParam('selrow');
                $.jgrid.inlineEdit = {restoreAfterError: false};
                that.freightruledtlGrid.jq.saveRow(rowId, function (res) {
                    let json = res.responseJSON;
                    if (json.error) {
                        return [false, json.error];
                    }
                    that.methods.initEditor.call(that);
                    return [true, res.responseJSON.data[0]];
                }, api.saveFreightRuleDetail, {
                    oper: editType,
                    freightrule_id: freightRuleId
                }, null, function (rId, res, stat) {
                    // that.methods.initEditor.call(that);
                    opg.err(res.responseJSON.error);
                });
            } else if (editType == EditTypeEnum.Edit) {
                let data = [];
                for (let i = 0; i < editRowIds.length; i++) {
                    let rowId = editRowIds[i];
                    let tmp = that.freightruledtlGrid.gridEditorRowData(rowId);
                    if (tmp) {
                        let obj = {};
                        let oldRowData = that.freightruledtlGrid.jq.getRowData(rowId, true);
                        tmp['freightrule_id'] = oldRowData.freightrule_id;
                        tmp['freightruledtl_id'] = oldRowData.freightruledtl_id;
                        obj[rowId] = tmp;
                        data.push(obj);
                    }
                }

                if (data.length == editRowIds.length) {
                    api.batchSaveFreightRuleDetail(data, (data) => {
                        let errorInfo = [];
                        for (let key in data) {
                            let remoteData = data[key];
                            if (remoteData) {
                                let rangeType = rangeTypes.filter(r => r.freightruledtl_rangetype_id == remoteData.freightruledtl_rangetype_id)[0];
                                let chargMode = chargeModes.filter(c => c.freightruledtl_chargemode_id == remoteData.freightruledtl_chargemode_id)[0];
                                let oldRowData = that.freightruledtlGrid.jq.getRowData(key, true);
                                let newRowData = $.extend(oldRowData, {
                                    freightruledtl_code: remoteData.freightruledtl_code,
                                    freightruledtl_rangetype_name: rangeType.freightruledtl_rangetype_name,
                                    freightruledtl_chargemode_name: chargMode.freightruledtl_chargemode_name,
                                    range_minimum: remoteData.range_minimum,
                                    range_maximum: remoteData.range_maximum,
                                    range_name: remoteData.range_name
                                });
                                console.log('remoteData:', remoteData, 'newRowData:', newRowData);
                                that.freightruledtlGrid.saveClientRowData(key, newRowData);
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
        cancelRuleDetail() {
            let that = this;
            if (editType == EditTypeEnum.Add) {
                let rowId = that.freightruledtlGrid.jq.getGridParam('selrow');
                that.freightruledtlGrid.jq.restoreRow(rowId);
                that.methods.initEditor.call(that);
            } else if (editType == EditTypeEnum.Edit) {
                for (let i = 0; i < editRowIds.length; i++) {
                    let rowId = editRowIds[i];
                    that.freightruledtlGrid.jq.setSelection(rowId);
                    that.freightruledtlGrid.jq.restoreRow(rowId);
                }
                that.methods.initEditor.call(that);
            }
        },
        gridComplete() {
            let that = this;
            let gridData = that.freightruledtlGrid.jqGridData;
            if (gridData.length) {
                that.freightruledtlGrid.toolBar.showItem(3);
                isEditor = true;
            }
        },
        editorRuleDetail() {
            if (editType) return;
            editType = EditTypeEnum.Edit;
            let that = this;
            let selRowKeys = that.freightruledtlGrid.jq.getGridParam("selarrrow");
            if (selRowKeys.length) {
                that.freightruledtlGrid.toolBar
                    .hideItem(3)
                    .showItem(1)
                    .showItem(2);

                for (let i = 0; i < selRowKeys.length; i++) {
                    let rowId = selRowKeys[i];
                    editRowIds.push(rowId);
                    that.freightruledtlGrid.jq.editRow(rowId);
                }

            } else {
                that.methods.initEditor.call(that);
                top.opg.warn('选择后再进行编辑');
            }
        }
    }
};
page.init();