/**
 * User: tom
 * Date: 2018/6/14
 * Time: 15:39
 */
import {api} from "/ts/util/api";
import opg from '/ts/opg';

api({
    'queryUserListForPage!post': 'user/QueryUserListForPage',
    'getAllRoles': 'role/getAllRoles',
    'getAllOrgs': 'org/GetAllOrgs',
    'add!post': 'user/add',
    'editor!post': 'user/editor',
    'disabled!post': 'user/disabled',
    'delete!post': 'user/delete',
    'resetPwd': 'user/ResetPwd'
});
let page = {
    init() {
        this.initSearchPanel();
        this.initUserGrid();
    },
    initSearchPanel() {
        let that = this;
        let searchPanel = opg('#userSearchPanel').panel({
            panelCls: 'panel-info',
            title: '用户搜索',
            btnSearchClick() {
                that.userGrid.update({page: 1});
            },
            collapseFun() {
                that.userGrid.jq.setGridHeight(($(window).outerHeight() - $('#userSearchPanel').outerHeight() - 150));
            }
        });
        searchPanel.addToBody(`
          <div class="form-group">
            <label for="searchAccount">帐号</label>
            <input type="text" class="form-control" name="searchAccount" id="searchAccount" placeholder="">
          </div>
          <div class="form-group">
            <label for="searchDisplayName">显示名</label>
            <input type="text" class="form-control" name="searchDisplayName" id="searchDisplayName" placeholder="">
          </div>
        `);
    },
    initUserGrid() {
        let that = this;
        that.userGrid = opg('#userGrid').grid({
            url: api.queryUserListForPage,
            datatype: 'json',
            mtype: 'POST',
            postData: {
                account: () => {
                    return $('#searchAccount').val()
                },
                displayName: () => {
                    return $('#searchDisplayName').val()
                }
            },
            colModel: [
                {label: '帐户', name: 'user_account', width: 100, sortable: false},
                {label: '显示名', name: 'user_displayname', width: 100, sortable: false},
                {label: '公司', name: 'org_name', width: 200, sortable: false},
                {label: '角色', name: 'role_name', width: 200, sortable: false},
                {
                    label: '状态', name: 'user_disabled', width: 200, sortable: false,
                    formatter: (cellValue, options, rowObject) => {
                        if (!!cellValue) {
                            return '禁用'
                        } else {
                            return '正常'
                        }
                    }
                },
                {
                    label: '编辑', name: 'user_id', width: 200, key: true, sortable: false,
                    formatter: (cellValue, options, rowObject) => {
                        // console.log('rowObject:', rowObject);
                        let rowId = options.rowId;
                        let statusTxt = !!rowObject['user_disabled'] ? '启用' : '禁用';
                        return `<button id="user_editor" class="btn btn-link operation user-editor" userId="${cellValue}" rowId="${rowId}">编辑</button><button class="btn btn-link operation user-disabled" userId="${cellValue}" userDisabled="${!!rowObject.user_disabled}" cId="user_status">${statusTxt}</button><button class="btn btn-link operation user-delete" userId="${cellValue}" cId="user_delete">删除</button><button class="btn btn-link operation user-reset-pwd" userId="${cellValue}" cId="user_reset_password">重置密码</button>`
                    }
                }
            ],
            multiselect: true,
            pager: "#userGridPager",
            toolbar: [
                {
                    id: 'user_add',
                    icon: 'fa-plus-circle',
                    name: '添加用户',
                    fun: () => {
                        that.methods.addUser.call(that);
                    }
                },
                {
                    id: 'user_deletes',
                    icon: 'fa-minus-circle',
                    name: '删除用户',
                    fun: () => {
                        that.methods.delUsers.call(that);
                    }
                }
            ],
            settingToolBar: true,
            height: ($(window).outerHeight() - $('#userSearchPanel').outerHeight() - 150),
            autoResize: true
        });
        that.userGrid.jq.on('click', '.user-editor', (e) => {
            e.stopImmediatePropagation();
            let $this = $(e.target),
                userId = $this.attr('userId'),
                rowData = that.userGrid.jqGridData.rows.filter(r => r.user_id == userId)[0];
            // console.log('rowData:', rowData);
            that.methods.userForm(rowData, '更新用户', (data) => {
                api.editor(data, () => {
                    opg.ok('更新成功');
                    that.userGrid.update({current: true});
                    that.methods.userPop.close();
                });
            }, 'editor');
        });
        that.userGrid.jq.on('click', '.user-delete', (e) => {
            e.stopImmediatePropagation();
            let $this = $(e.target),
                userId = $this.attr('userId');
            opg.confirm('确认是否删除', () => {
                api.delete([userId], () => {
                    that.userGrid.update({current: true});
                });
            });
        });
        that.userGrid.jq.on('click', '.user-disabled', (e) => {
            e.stopImmediatePropagation();
            let $this = $(e.target);
            let user = {
                userId: $this.attr('userId'),
                disabled: !($this.attr('userDisabled') == "true")
            };
            api.disabled(user, () => {
                that.userGrid.update({current: true});
            });
        });
        that.userGrid.jq.on('click', '.user-reset-pwd', (e) => {
            e.stopImmediatePropagation();
            let $this = $(e.target),
                userId = $this.attr('userId');
            opg.confirm('确认是否重置密码', () => {
                api.resetPwd({userId}, () => {
                    opg.ok('重置密码成功');
                });
            });
        });
    },
    methods: {
        orgList(data) {
            let that = this;
            let orgs,
                curSelOrgIds = (data['org_id'] || '').split(','),
                curSelOrgDefaults = (data['org_default'] || '').split(',');
            let curSelOrg = {};
            for (let i = 0; i < curSelOrgIds.length; i++) {
                curSelOrg[curSelOrgIds[i]] = curSelOrgDefaults[i];
            }
            console.log(data, curSelOrg, that);
            $.when(
                api.getAllOrgs((data) => {
                    orgs = data;
                }),
            ).then(() => {
                that.orgGridPopup = opg.confirm($('<div class="padding" style="height: 211px; overflow-y: auto;"><table id="orgGrid"></table></div>'), function (i, ifr) {
                    let selRowKeys = orgGrid.jq.getGridParam("selarrrow");
                    let newSelOrgs = {
                        defaultOrgId: $('input[name="org"]:checked').attr('orgid'),
                        orgIds: [],
                        orgNames: []
                    };

                    for (let i = 0; i < selRowKeys.length; i++) {
                        let rowId = selRowKeys[i], rowData = orgGrid.jq.getRowData(rowId);
                        if (rowData.org_id) {
                            newSelOrgs.orgIds.push(rowData.org_id);
                        }
                        if (rowData.org_name) {
                            newSelOrgs.orgNames.push(rowData.org_name);
                        }
                    }

                    if (newSelOrgs.orgIds.length && (!newSelOrgs.defaultOrgId || newSelOrgs.orgIds.indexOf(newSelOrgs.defaultOrgId) == -1)) {
                        opg.err('默认公司未设置');
                        return true;
                    }

                    $('#orgs')
                        .val(newSelOrgs.orgNames.join(','))
                        .attr('org_id', newSelOrgs.orgIds.join(','))
                        .attr('default_org_id', newSelOrgs.defaultOrgId);

                    that.orgGridPopup.close();

                    return true;
                }, {
                    title: '选择公司',
                    width: 400,
                    height: 200
                });
                let orgGrid = opg('#orgGrid').grid({
                    datatype: "jsonstring",
                    datastr: orgs,
                    jsonReader: {repeatitems: false},
                    loadonce: true,
                    multiselect: true,
                    rownumbers: true,
                    rownumWidth: 20,
                    colModel: [
                        {label: 'org_id', name: 'org_id', hidden: true},
                        {label: '公司名称', name: 'org_name'},
                        {label: '公司代号', name: 'org_code', width: 60},
                        {
                            label: '是否默认', width: 60, key: true,
                            formatter: (cellValue, options, rowObject) => {
                                console.log('rowObject:', rowObject);
                                cellValue = rowObject.org_id;
                                if (curSelOrg[parseInt(cellValue)]) {
                                    let v = curSelOrg[parseInt(cellValue)];
                                    if (v == '1') {
                                        return `<input type="radio" name="org" orgId="${cellValue}" checked/>`;
                                    }
                                }
                                return `<input type="radio" name="org" orgId="${cellValue}"/>`;
                            }
                        }
                    ],
                    autowidth: true
                });
                for (let i = 0; i < curSelOrgIds.length; i++) {
                    orgGrid.jq.setSelection(curSelOrgIds[i], true);
                }
            });
        },
        userForm(data, title, callback, type = 'add') {
            let that = this;
            let html = template('userAddFormTpl', data);
            this.userPop = opg.confirm($('<div id="userForm" class="padding" style="height: 411px; overflow-y: auto;"></div>').append(html), function (i, ifr) {
                userForm.submit();
                return true;
            }, {
                title,
                width: 600,
                height: 500
            });
            let userForm = $('#userForm');
            userForm
                .bootstrapValidator({
                    message: '',
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        account: {
                            validators: {
                                notEmpty: {
                                    message: '帐户不能为空'
                                }
                            }
                        },
                        displayName: {
                            validators: {
                                notEmpty: {
                                    message: '显示名不能为空'
                                }
                            }
                        }
                    }
                })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    let $form = $(e.target),
                        params = $form.fieldsToJson();

                    let orgs = $('#orgs');
                    params.orgs = (orgs.attr('org_id') || '').split(',');
                    params.defaultOrg = orgs.attr('default_org_id');
                    if (type == 'editor') {
                        params.userId = data.user_id;
                    }
                    params.disabled = params.disabled == "1";
                    if ($.isFunction(callback)) {
                        callback(params);
                    }
                });


            $('#btnChooseOrgs').on('click', () => {
                that.orgList(data);
            });


            let role = opg('#role').listBox({
                api: api.getAllRoles,
                value: 'role_id',
                text: 'role_name',
                name: 'role',
                selectedIndex: -1,
                autoPrependBlank: '请选择',
                onBind: function (json) {
                    if (type == 'editor') {
                        let editorRole = data['role_id'];
                        role.setValue(editorRole);
                    } else {
                        role.setValue(0);
                    }
                }
            });
            let disabled = opg('#disabled').radioBox({
                data: [{id: 0, name: '正常'}, {id: 1, name: '禁用'}],
                name: 'disabled',
            });

            if (type == 'editor') {
                let editorData = {
                    account: data['user_account'],
                    displayName: data['user_displayname'],
                    disabled: !data['user_disabled'] ? 0 : 1,
                    orgs: data['org_name']
                };
                userForm.jsonToFields(editorData);
                $('#orgs').attr('org_id', data['org_id']);
            }


        },
        addUser() {
            let that = this;
            that.methods.userForm([], '添加用户', (data) => {
                api.add(data, () => {
                    opg.ok('添加成功');
                    that.methods.userPop.close();
                });
            });
        },
        delUsers() {
            let that = this;
            let selRowKeys = that.userGrid.jq.getGridParam("selarrrow");
            if (selRowKeys.length) {
                opg.confirm('确认是否删除', () => {
                    api.delete(selRowKeys, () => {
                        that.userGrid.update({current: true});
                    });
                });
            } else {
                opg.warn('请选择需删除的用户');
            }
        }
    }
};

page.init();