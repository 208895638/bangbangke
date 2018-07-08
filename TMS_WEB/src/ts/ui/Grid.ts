/**
 * User: tom
 * Date: 2018/6/14
 * Time: 16:07
 */

import {AjaxMessage, loading, onServerError} from "../util/api";
import opg from '../opg';
import {DisplayObject} from "./DisplayOject";

enum EditTypeEnum {
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete'
}

enum ToolBarButtonAlign {
    Left = 'left',
    Right = 'right'
}

interface ToolBarButton {
    icon: string | Function,
    name: string,
    align?: ToolBarButtonAlign,
    fun: Function
}

class ToolBar extends DisplayObject {
    buttonTpl: string = '<button type="button" class="btn btn-link fa btn-custom-toolbar">${name}</button>';

    constructor(jq: JQuery, cfg: any) {
        cfg = $.extend({
            css: {
                backgroundColor: '#d9edf7',
                borderColor: '#bce8f1',
                color: '#31708f'
            }
        }, cfg);
        // noinspection JSAnnotator
        super(jq, cfg)
    }

    init(jq, cfg) {
        let toolbarContent = $('<div class="panel-heading toolbar"></div>').css(cfg.css);
        this.data = cfg.data || [];
        this.toolbarContent = toolbarContent;
        this.bindItems(this.data);
        jq.append(toolbarContent);
    }

    bindItems(items: ToolBarButton[]) {
        let that = this, pattern = /\${(\w*[:]*[=]*\w+)\}(?!})/g;
        for (let i = 0; i < items.length; i++) {
            let item: ToolBarButton = items[i];
            let str = that.buttonTpl.replace(pattern, function (match, key, i) {
                return item[key];
            });
            let $str = $(str);
            $str
                .css('float', item.align || 'left')
                .css('display', item.hidden ? 'none' : 'block')
                .addClass(item.icon)
                .attr('cId', item.id || '')
                .on('click', item.fun)
                .appendTo(that.toolbarContent);
        }
    }

    get items() {
        return this.toolbarContent.find('.btn-custom-toolbar');
    }

    showItem(index: number) {
        this.items.eq(index).show();
        return this;
    }

    hideItem(index: number) {
        this.items.eq(index).hide();
        return this;
    }
}

class Grid {
    public jq: JQuery;
    public jqGridParent: JQuery;
    private jqGrid: JQuery = $.jgrid;
    private options: JQuery;
    public jqGridData: any;


    constructor(jq: JQuery, cfg: any) {
        let defaults = {
            autowidth: false
        };
        if (cfg.pager) {
            defaults = {
                autowidth: false,
                height: 300,
                rowNum: 20,
                rowList: [20, 30, 50],
                rownumbers: true,
                rownumWidth: 25
            }
        }
        cfg = $.extend({}, defaults, cfg);
        this.onServerError = onServerError;
        this.jq = jq;
        this.init(jq, cfg);
        this.jqGridHandler();
    }

    /**
     * AJAX 出错统一处理
     * @param code
     * @param error
     * @param callback
     * @returns
     */
    handleError(code, error, callback): void {
        if (typeof this.onError === 'function')
            return this.onError.call(this, code, error, callback);
        else
            return this.onServerError.call(this, code, error, callback);
    }

    init(jq, cfg) {
        let that = this;

        // 统一AJAX处理
        cfg['beforeProcessing'] = cfg.beforeProcessing || function (json, st, xhr) {
            // console.log(json, st, xhr);
            let error = json.error;
            if (error) {
                // if (error == '20000') error = '数据操作未获取到权限;
                that.handleError.call(that, 200, error);
                return false;
            }
            return true;
        };

        cfg['ajaxGridOptions'] = cfg.ajaxGridOptions || {
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (jqXHR: JQueryXHR, settings: JQueryAjaxSettings) {
                loading.handlers++;

                if (loading.timer) clearTimeout(loading.timer);
                loading.timer = 0;
                loading.show();

            },
            complete: function () {
                loading.handlers--;
                loading.timer = setTimeout(loading.hide, 1000);

                // that.accessible = true;
                // that = null;
            },
            error: function (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
                let code: number = jqXHR.status;
                if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                    that.handleError.call(that, code, jqXHR.responseJSON.error);
                }
                else {
                    if (!errorThrown)
                        errorThrown = 'server connection lost';

                    that.handleError.call(that, code, errorThrown);
                }

            }
        };

        // 行编辑时出错统一提示
        cfg['validationCell'] = cfg.validationCell || function (ele, cv, iRow, iCol) {
            // console.log(ele, cv, iRow, iCol);
            ele.off('focus.t').on('focus.t', (e) => {
                let $this = $(e.target);
                $this.tooltip('destroy');
            });
            ele.attr({
                'data-toggle': 'tooltip',
                'title': cv,
                'data-placement': that.jq[0].rows.length - 1 <= 1 ? 'right' :
                    that.jq[0].rows.length - 1 == iRow ? 'top' : 'bottom'
            }).tooltip('show');
        };

        // cfg['ajaxRowOptions'] = cfg.ajaxRowOptions || {
        //     xhrFields: {
        //         withCredentials: true
        //     }
        // };

        // cfg['ajaxDelOptions'] = cfg.ajaxDelOptions || {
        //     xhrFields: {
        //         withCredentials: true
        //     }
        // };
        //
        // cfg['ajaxOptions'] = cfg.ajaxOptions || {
        //     xhrFields: {
        //         withCredentials: true
        //     }
        // };

        // 后台返回数据统一格式
        cfg['jsonReader'] = cfg.jsonReader || {
            root: function (obj) {
                if (obj.data.records) {
                    return obj.data.rows;
                }
                return obj.data;
            },
            records: function (obj) {
                return obj.data.records || 0;
            },
            page: function (obj) {
                return obj.data.page || 1;
            },
            total: function (obj) {
                return obj.data.total || 1;
            }
        };

        // cfg['gridComplete'] = cfg.gridComplete || function () {
        //     // console.log(that.jq.find('[cId]').attr('disabled','disabled'));
        // };

        this.options = cfg;
    }

    jqGridHandler() {
        let that = this;
        // console.log(that.options);
        let cfgLoadComplete = that.options.loadComplete;
        that.options.loadComplete = function (json) {
            that.jqGridData = json.data;
            if (!that.options.autowidth) {
                that.setJqGridWidth();
            }
            if ($.isFunction(cfgLoadComplete)) {
                cfgLoadComplete();
            }
        };

        let cfgGridComplete = that.options.gridComplete;
        that.options.gridComplete = function () {
            if ($.isFunction(cfgGridComplete)) {
                setTimeout(() => {
                    cfgGridComplete();
                }, 0);
            }
        };

        that.jq.jqGrid(that.options);
        that.jqGridParent = that.jq.parents('.ui-jqgrid').parent();
        that.setToolBar();
        if (that.options.settingToolBar) {
            that.addSettingToolBar();
        }

        if (that.options.autoResize) {
            that.jqGridLayout();
        }
    }

    /**
     * 自动设置宽度
     */
    jqGridLayout() {
        let that = this;
        $(window).on('resize', function () {
            that.setJqGridWidth();
        });
    }

    /**
     * 初始化时设置宽度
     */
    setJqGridWidth() {
        let that = this, jqGridParent = that.jqGridParent,
            jqGridView = jqGridParent.find('.ui-jqgrid-view'),
            jqGridBody = jqGridParent.find('.ui-jqgrid-bdiv');
        that.jq.setGridWidth(jqGridParent.width());
        jqGridView.width(jqGridParent.width() + 1);
        jqGridBody.width(jqGridParent.width() + 1);
    }

    /**
     * 初始化时设置TOOLBAR
     */
    setToolBar() {
        let that = this;
        if ($.isArray(that.options.toolbar) && that.options.toolbar.length) {
            let toolBar = opg($('<div></div>')).toolBar({
                data: that.options.toolbar
            });
            that.toolBar = toolBar;
            that.jqGridParent.prepend(toolBar.jq);
        }
    }

    /**
     * 更新数据
     * @param {Object} options jqGrid reload options
     * @returns {this}
     */
    update(options?: Object) {
        let that = this;
        that.jq.trigger('reloadGrid', options);
        setTimeout(function () {
            if (that.options.autoResize) {
                that.jqGridLayout();
            }
        }, 10);
        return that;
    }

    /**
     * 添加TOOLBAR
     */
    addSettingToolBar() {
        let that = this;
        if (!that.options.toolbar) {
            throw new Error('grid toolbar params is null');
        }

        that.toolBar.bindItems([
            {
                icon: 'fa-cog toolbar-setting',
                name: '',
                align: ToolBarButtonAlign.Right,
                fun: () => {
                    that.gridSetting.call(that);
                }
            }
        ]);
    }

    /**
     * 列显示与隐藏
     */
    gridSetting() {
        let that = this;
        let data = [], initSelIndex = [];
        let gridColModels = that.jq.getGridParam('colModel');
        for (let i = 0; i < gridColModels.length; i++) {
            let col = gridColModels[i];
            if (col.name == 'cb' || col.name == 'rn') {
                continue;
            }
            data.push(col);
            if (!col.hidden) {
                initSelIndex.push(data.length - 1);
            }
        }

        let chCols = opg('<div></div>').checkBox({
            data,
            text: 'label',
            value: 'name',
            selectedIndex: initSelIndex
        });
        let pop: PopUp = opg.confirm($('<div class="padding" style="height: 111px; overflow-y: auto;"></div>').append(chCols.jq), function (i, ifr) {
            for (let j = 0; j < chCols.unSelectedData.length; j++) {
                let hideCol = chCols.unSelectedData[j];
                console.log('hidecol', hideCol);
                that.jq.hideCol(hideCol.name);
            }
            for (let j = 0; j < chCols.selectedData.length; j++) {
                let showCol = chCols.selectedData[j];
                that.jq.showCol(showCol.name);
            }
            that.update({current: true});
            pop.close();
            return true;
        }, {
            title: `设置`,
            width: 500,
            height: 200,
            buttons: {
                ok: '保存',
                cancel: '取消'
            },
        });
    }

    gridEditorRowData(rowid, o = {}) {
        let that = this, $t = that.jq[0];
        let ind = $($t).jqGrid("getInd", rowid, true);
        if (ind === false) {
            return null;
        }
        let errors = $.jgrid.getRegional($t, 'errors'),
            edit = $.jgrid.getRegional($t, 'edit'),
            bfsr = $.isFunction(o.beforeSaveRow) ? o.beforeSaveRow.call($t, o, rowid) : undefined;
        if (bfsr === undefined) {
            bfsr = true;
        }
        if (!bfsr) {
            return null;
        }

        let editable = $(ind).attr("editable");
        o.url = o.url || $t.p.editurl;
        let tmp = {}, tmp2 = {}, tmp3 = {}, cv;
        if (editable === "1") {
            let cm, index, elem, nm;
            $('td[role="gridcell"]', ind).each(function (i) {
                cm = $t.p.colModel[i];
                nm = cm.name;
                elem = "";
                if (nm !== 'cb' && nm !== 'subgrid' && cm.editable === true && nm !== 'rn' && !$(this).hasClass('not-editable-cell')) {
                    switch (cm.edittype) {
                        case "checkbox":
                            let cbv = ["Yes", "No"];
                            if (cm.editoptions && cm.editoptions.value) {
                                cbv = cm.editoptions.value.split(":");
                            }
                            tmp[nm] = $("input", this).is(":checked") ? cbv[0] : cbv[1];
                            elem = $("input", this);
                            break;
                        case 'text':
                        case 'password':
                        case 'textarea':
                        case "button" :
                            tmp[nm] = $("input, textarea", this).val();
                            elem = $("input, textarea", this);
                            break;
                        case 'select':
                            if (!cm.editoptions.multiple) {
                                tmp[nm] = $("select option:selected", this).val();
                                tmp2[nm] = $("select option:selected", this).text();
                            } else {
                                let sel = $("select", this), selectedText = [];
                                tmp[nm] = $(sel).val();
                                if (tmp[nm]) {
                                    tmp[nm] = tmp[nm].join(",");
                                } else {
                                    tmp[nm] = "";
                                }
                                $("select option:selected", this).each(
                                    function (i, selected) {
                                        selectedText[i] = $(selected).text();
                                    }
                                );
                                tmp2[nm] = selectedText.join(",");
                            }
                            if (cm.formatter && cm.formatter === 'select') {
                                tmp2 = {};
                            }
                            elem = $("select", this);
                            break;
                        case 'custom' :
                            try {
                                if (cm.editoptions && $.isFunction(cm.editoptions.custom_value)) {
                                    tmp[nm] = cm.editoptions.custom_value.call($t, $(".customelement", this), 'get');
                                    if (tmp[nm] === undefined) {
                                        throw "e2";
                                    }
                                } else {
                                    throw "e1";
                                }
                            } catch (e) {
                                if (e === "e1") {
                                    $.jgrid.info_dialog(errors.errcap, "function 'custom_value' " + edit.msg.nodefined, edit.bClose, {styleUI: $t.p.styleUI});
                                }
                                else {
                                    $.jgrid.info_dialog(errors.errcap, e.message, edit.bClose, {styleUI: $t.p.styleUI});
                                }
                            }
                            break;
                    }
                    cv = $.jgrid.checkValues.call($t, tmp[nm], i);
                    if (cv[0] === false) {
                        index = i;
                        return false;
                    }
                    if ($t.p.autoencode) {
                        tmp[nm] = $.jgrid.htmlEncode(tmp[nm]);
                    }
                    if (o.url !== 'clientArray' && cm.editoptions && cm.editoptions.NullIfEmpty === true) {
                        if (tmp[nm] === "") {
                            tmp3[nm] = 'null';
                            nullIfEmpty = true;
                        }
                    }
                }
            });

            if (cv[0] === false) {
                try {
                    if ($.isFunction($t.p.validationCell)) {
                        $t.p.validationCell.call($t, elem, cv[1], ind.rowIndex, index);
                    } else {
                        var tr = $($t).jqGrid('getGridRowById', rowid),
                            positions = $.jgrid.findPos(tr);
                        $.jgrid.info_dialog(errors.errcap, cv[1], edit.bClose, {
                            left: positions[0],
                            top: positions[1] + $(tr).outerHeight(),
                            styleUI: $t.p.styleUI,
                            onClose: function () {
                                if (index >= 0) {
                                    $("#" + rowid + "_" + $t.p.colModel[index].name).focus();
                                }
                            }
                        });
                    }
                } catch (e) {
                    alert(cv[1]);
                }

                return null;
            }

            let idname, opers = $t.p.prmNames, oldRowId = rowid;
            if ($t.p.keyName === false) {
                idname = opers.id;
            } else {
                idname = $t.p.keyName;
            }
            if (tmp) {
                tmp[opers.oper] = opers.editoper;
                if (tmp[idname] === undefined || tmp[idname] === "") {
                    tmp[idname] = rowid;
                } else if (ind.id !== $t.p.idPrefix + tmp[idname]) {
                    // rename rowid
                    let oldid = $.jgrid.stripPref($t.p.idPrefix, rowid);
                    if ($t.p._index[oldid] !== undefined) {
                        $t.p._index[tmp[idname]] = $t.p._index[oldid];
                        delete $t.p._index[oldid];
                    }
                    rowid = $t.p.idPrefix + tmp[idname];
                    $(ind).attr("id", rowid);
                    if ($t.p.selrow === oldRowId) {
                        $t.p.selrow = rowid;
                    }
                    if ($.isArray($t.p.selarrrow)) {
                        let i = $.inArray(oldRowId, $t.p.selarrrow);
                        if (i >= 0) {
                            $t.p.selarrrow[i] = rowid;
                        }
                    }
                    if ($t.p.multiselect) {
                        let newCboxId = "jqg_" + $t.p.id + "_" + rowid;
                        $("input.cbox", ind)
                            .attr("id", newCboxId)
                            .attr("name", newCboxId);
                    }
                    // TODO: to test the case of frozen columns
                }
                if ($t.p.inlineData === undefined) {
                    $t.p.inlineData = {};
                }
                tmp = $.extend({}, tmp, $t.p.inlineData, o.extraparam);
                // let row = $($t).jqGrid('getRowData', rowid, true);
                // row = $.extend(row, tmp);
                // return row;
                return tmp;
            }
            return null;
        }
    }

    saveClientRowData(rowid, tmp, o = {}) {
        let that = this, $t = that.jq[0];
        if ($t.p.autoencode) {
            $.each(tmp, function (n, v) {
                tmp[n] = $.jgrid.htmlDecode(v);
            });
        }
        var k, resp = $($t).jqGrid("setRowData", rowid, tmp), ind = $($t).jqGrid("getInd", rowid, true),
            oldRowId = rowid, fr;
        $(ind).attr("editable", "0");
        for (k = 0; k < $t.p.savedRow.length; k++) {
            if (String($t.p.savedRow[k].id) === String(oldRowId)) {
                fr = k;
                break;
            }
        }
        $($t).triggerHandler("jqGridInlineAfterSaveRow", [rowid, resp, tmp, o]);
        if ($.isFunction(o.aftersavefunc)) {
            o.aftersavefunc.call($t, rowid, resp, tmp, o);
        }
        if (fr >= 0) {
            $t.p.savedRow.splice(fr, 1);
        }
        $(ind).removeClass("jqgrid-new-row").off("keydown");
    }
}

export {Grid, ToolBar, ToolBarButtonAlign, EditTypeEnum}