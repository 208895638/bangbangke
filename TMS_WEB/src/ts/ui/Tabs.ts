/**
 * User: tom
 * Date: 2018/6/5
 * Time: 12:44
 */
import {DisplayObject} from "./DisplayOject";

class Tabs extends DisplayObject {

    data: Array;

    navOffset: number = 0;

    selectedIndex: number;
    onSelect?: Function;
    onClose?: Function;

    tabsHeaderWrap: JQuery;
    tabsHeaderScroll: JQuery;
    tabsHeaderTabPre: JQuery;
    tabsHeaderTabNext: JQuery;
    tabsHeaderNav: JQuery;
    tabsContent: JQuery;

    tabItemTpl: string = '<div role="tab"  class="t-tabs__item is-top is-closable">${name}<span class="fa t-icon-close"></span></div>';
    tabContentTpl: string = '<div role="tabpanel"  class="t-tabs__pane"><iframe src="" frameborder="0"></iframe></div>';

    constructor(jq, cfg) {
        cfg = $.extend({
            selectedIndex: 0
        }, cfg);
        this.onClose = cfg.onClose;
        this.onSelect = cfg.onSelect;
        // noinspection JSAnnotator
        super(jq, cfg);
    }

    init(jq, cfg) {
        let tabs = $('<div class="t-tabs t-tabs--card t-tabs--top"></div>');
        let tabsHeader = $('<div class="t-tabs__header is-top">' +
            '<div class="t-tabs__nav-wrap is-top">' +
            '<span class="t-tabs__nav-prev" style="display: none;"><i class="glyphicon glyphicon-menu-left"></i></span>' +
            '<span class="t-tabs__nav-next" style="display: none;"><i class="glyphicon glyphicon-menu-right"></i></span>' +
            '<div class="t-tabs__nav-scroll">' +
            '<div role="tablist" class="t-tabs__nav"></div>' +
            '</div></div></div>');
        let tabsContent = $('<div class="t-tabs__content"></div>');
        tabs.append(tabsHeader);
        tabs.append(tabsContent);

        this.tabsHeaderWrap = tabsHeader.find('.t-tabs__nav-wrap'); //is-scrollable
        this.tabsHeaderScroll = tabsHeader.find('.t-tabs__nav-scroll');
        this.tabsHeaderTabPre = tabsHeader.find('.t-tabs__nav-prev'); //show or hide
        this.tabsHeaderTabNext = tabsHeader.find('.t-tabs__nav-next');// show or hide
        this.tabsHeaderNav = tabsHeader.find('.t-tabs__nav');
        this.tabsContent = tabsContent;

        this.data = [];
        if (cfg.data) {
            for (let i = 0; i < cfg.data.length; i++) {
                let d = cfg.data[i];
                d['show'] = false;
                this.data.push(d);
            }
        }


        this.tabsHeaderNav.bindList({
            list: this.data,
            template: this.tabItemTpl
        });

        this.tabsContent.bindList({
            list: this.data,
            template: this.tabContentTpl
        });


        let self = this;
        this.tabsHeaderNav.on('click.opg', '.t-tabs__item', (evt) => {
            self.selectHandler.call(self, evt);
        });

        this.tabsHeaderNav.on('click.opg', '.t-icon-close', (evt) => {
            self.closeHandler.call(self, evt);
        });

        this.tabsHeaderTabPre.on('click.opg', (evt) => {
            this._moveScrollBar(evt, 'pre');
        });
        this.tabsHeaderTabNext.on('click.opg', (evt) => {
            this._moveScrollBar(evt, 'next');
        });

        this.selectedIndex = cfg.selectedIndex || -1;
        if (this.selectedIndex === -1 && this.data.length) {
            self.selectHandlerByIndex(0);
        } else {
            self.selectHandlerByIndex(this.selectedIndex);
        }

        if (typeof cfg.onSelect === 'function') {
            this.onSelect = cfg.onSelect;
        }

        this.createdHandler(this.data);
        this.jq.empty().append(tabs);
        return this;
    }

    addItem(item) {
        let index = -1;
        for (let i = 0; i < this.data.length; i++) {
            let d = this.data[i];
            if (d.id == item.id) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            this.selectHandlerByIndex(index);
            return this;
        }


        item.show = false;
        this.data.push(item);
        this.tabsHeaderNav.bindList({
            mode: 'append',
            list: [item]
        });
        this.tabsContent.bindList({
            mode: 'append',
            list: [item]
        });
        if (item.auto) {
            this.selectHandlerByIndex(this.data.length - 1)
        }


        return this;
    }

    scrollToActiveTab() {
        // console.group('scrollToActiveTab');
        let activeTab = this.tabsHeaderNav.find('.t-tabs__item').eq(this.selectedIndex);
        const activeTabBounding = activeTab[0].getBoundingClientRect();
        const navScrollBounding = this.tabsHeaderScroll[0].getBoundingClientRect();
        // const navBounding = this.tabsHeaderNav[0].getBoundingClientRect();
        // console.log('activeTabBounding:', activeTabBounding, 'navScrollBounding:', navScrollBounding, 'navBounding:', navBounding);

        this._scrollBarHandler();

        const currentOffset = this.navOffset;
        let newOffset = currentOffset;

        // console.log('currentOffset:', currentOffset, 'activeTabBoundingLeft:', activeTabBounding.left, 'navScrollBoundingLeft:', navScrollBounding.left);
        // console.log('currentOffset:', currentOffset, 'activeTabBoundingRight:', activeTabBounding.right, 'navScrollBoundingRight:', navScrollBounding.right);

        if (activeTabBounding.left < navScrollBounding.left) {
            // newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
            this._initScrollBar();
        }
        if (activeTabBounding.right > navScrollBounding.right) {
            newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
            this.tabsHeaderNav.css('transform', `translateX(-${newOffset}px)`);
        }
        this.navOffset = Math.max(newOffset, 0);
        // console.log(this.navOffset);
        // console.groupEnd();
        // this.tabsHeaderNav.css('transform', `translateX(-${newOffset}px)`)
        // console.log(this.tabsHeaderScroll,this.tabsHeaderNav,this.tabsHeaderNav.find('.t-tabs__item').eq(this.selectedIndex),this.selectedIndex);
    }

    _scrollBarHandler() {
        const navScrollBounding = this.tabsHeaderScroll[0].getBoundingClientRect();
        const navBounding = this.tabsHeaderNav[0].getBoundingClientRect();
        if (navBounding.width > navScrollBounding.width) {
            this.tabsHeaderWrap.addClass('is-scrollable');
            this.tabsHeaderTabPre.show();
            this.tabsHeaderTabNext.show();
        } else {
            this.tabsHeaderWrap.removeClass('is-scrollable');
            this.tabsHeaderTabPre.hide();
            this.tabsHeaderTabNext.hide();
            this._initScrollBar();
        }
    }

    _initScrollBar() {
        let newOffset = 0;
        this.navOffset = Math.max(newOffset, 0);
        this.tabsHeaderNav.css('transform', `translateX(${newOffset}px)`);
    }

    _moveScrollBar(evt, type) {
        evt.stopImmediatePropagation();
        if (type == 'pre') {
            let newOffset = this.tabsHeaderNav[0].offsetWidth - this.tabsHeaderScroll[0].offsetWidth;
            this.navOffset = Math.max(newOffset, 0);
            this.tabsHeaderNav.css('transform', `translateX(-${this.navOffset}px)`);
        } else {
            this._initScrollBar();
        }
    }

    selectHandler(evt) {
        evt.stopImmediatePropagation();
        let tabs = this.tabsHeaderNav.find('.t-tabs__item'),
            tab = $(evt.target),
            index = tabs.index(tab);
        this.selectHandlerByIndex(index);
        return this;
    }

    selectHandlerByIndex(index) {
        if (this.selectedIndex != index) {
            let tabs = this.tabsHeaderNav.find('.t-tabs__item'),
                tabContents = this.tabsContent.find('.t-tabs__pane');
            let tab = tabs.eq(index),
                tabContent = tabContents.eq(index);
            tabs.removeClass('is-active');
            tabContents.hide();
            if (!this.data[index].show) {
                tabContent.find('iframe').attr('src', this.data[index].url);
                this.data[index].show = true;
            }
            tab.addClass('is-active');
            tabContent.css('display', 'block');
            this.selectedIndex = Number(index);
            if (typeof this.onSelect === 'function') {
                this.onSelect.call(this, this.data[index]);
            }

            this.scrollToActiveTab();
        }
        return this;
    }

    closeHandler(evt) {
        evt.stopImmediatePropagation();
        let tabs = this.tabsHeaderNav.find('.t-tabs__item'),
            tabContents = this.tabsContent.find('.t-tabs__pane');
        let tab = $(evt.target).parent(),
            index = tabs.index(tab), oldActiveTabData = this.data[index];
        let isActive = tab.hasClass('is-active');
        tab.remove();
        tabContents.eq(Number(index)).remove();
        this.data.splice(index, 1);

        this._scrollBarHandler();
        if (!isActive) return this;
        let newIndex = -1;
        if (this.data.length) {
            if (this.selectedIndex == 0) {
                this.selectedIndex = -1;
                newIndex = 0;
            } else {
                newIndex = --index;
            }
        } else {
            this.selectedIndex = newIndex;
        }
        setTimeout(() => {
            let newActiveTabData = null;
            if (newIndex !== -1) {
                newActiveTabData = this.data[newIndex];
                if (!newActiveTabData.auto) {
                    this.selectHandlerByIndex(newIndex);
                }
            }
            if (typeof this.onClose === 'function') this.onClose(this, oldActiveTabData, newActiveTabData);
        }, 0);
        return this;
    }
}

export {Tabs}