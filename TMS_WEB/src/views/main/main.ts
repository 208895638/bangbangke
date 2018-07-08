/**
 * User: tom
 * Date: 2018/6/4
 * Time: 12:46
 */
import opg from '/ts/opg';
import {store} from "../../ts/util/store";
import {api} from "/ts/util/api";
import cfg from '/ts/app.cfg'

api({
    'getCurrentUserOrg': 'org/GetCurrentUserOrg',
    'upCurrentUserOrg!post': 'user/UpCurrentUserOrg',
    'logout': 'user/Logout'
});

let page = {
    user: store.get('user'),
    init() {
        this.initPageInfo();
        this.registerDomEvent();
    },
    initPageInfo() {
        let userInfo = this.user.userInfo;
        $('#username').text(userInfo.displayName);
        this.setCurOrg();
        api.getCurrentUserOrg({}, function (data) {
            let html = template('orgTpl', data);
            $('#orgList').html(html);
        });
        this.initSidebarBarMenu();
    },
    initSidebarBarMenu() {
        let userInfo = this.user.userInfo;
        if (userInfo.roles && userInfo.roles.length) {
            let menus = userInfo.roles[0].modules;
            document.getElementById('sidebar-menu-content').innerHTML = template('menuTpl', menus);
        }
    },
    registerDomEvent() {
        $('#logout').on('click', () => {
            api.logout(() => {
                window.location.replace(cfg.loginPage);
            });
        });
        $('#orgList').on('click', 'a', (e) => {
            let $this = $(e.target),
                orgId = $this.attr('orgId'),
                user = store.get('user');
            if (orgId == user.currentUser.orgId) {
                return;
            }
            opg.danger('是否确认切换公司，确认后将刷新页面。', () => {
                let orgName = $this.text();
                let orgCode = $this.attr('orgCode');
                api.upCurrentUserOrg({orgId, orgCode, orgName,}, (data) => {
                    user.currentUser.orgId = orgId;
                    user.currentUser.orgName = orgName;
                    store.set('user', user);
                    page.setCurOrg();
                    window.location.reload();
                });
            });
        });
    },
    setCurOrg() {
        let user = store.get('user').currentUser;
        $('#curSelOrg').html(user.orgName).attr('orgId', user.orgId);
    }
};
page.init();


let expandMenu = (menu) => {
    menu.click();
    let tempParent = menu.parent().parent().siblings('a');
    let parents = [];
    while (tempParent.hasClass('has-arrow')) {
        parents.push(tempParent);
        tempParent = tempParent.parent().parent().siblings('a');
    }
    let i = parents.length;
    while (i--) {
        // console.log(parents[i].attr('sidebarid'));
        let menuUl = parents[i].siblings('ul');
        if (menuUl.attr('aria-expanded') == 'false') {
            parents[i].click();
        }

        if (i < 0) {
            break;
        }
    }
};

$(function () {
    $('#sidebar-menu').metisMenu();
});

$(function () {

    $(window).bind("load resize", function () {
        let topOffset = 50;
        const width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        let height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    let tabs = opg('#page-wrapper').tabs({
        data: [
            {
                name: '首页',
                url: '../demo/demo.html',
                id: 'demo'
            }
        ],
        onSelect: function (tab) {
            let menu = $('#sidebar-menu').find(`a[sidebarid="${tab.id}"]`);
            expandMenu(menu);
        },
        onClose: function (self, closeTab, newTab) {
            menus.removeClass('menu_active');
            if (newTab) {
                let menu = $('#sidebar-menu').find(`a[sidebarid="${newTab.id}"]`);
                expandMenu(menu);
            }
        }
    });

    let menus = $('#sidebar-menu li').find('a:not("has-arrow")');
    menus.on('click', function () {
        let $this = $(this);
        if (!$this.hasClass('has-arrow')) {
            tabs.addItem({
                name: $this.text(),
                url: $this.attr('url'),
                auto: true,
                id: $this.attr('sidebarId')
            });
            menus.removeClass('menu_active');
            $this.addClass('menu_active');
        }
    });

    window.tabs = tabs;
});