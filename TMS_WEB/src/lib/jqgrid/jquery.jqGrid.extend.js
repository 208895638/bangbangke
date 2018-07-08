/**
 * User: tom
 * Date: 2018/6/8
 * Time: 16:16
 */

let orgViewModal = $.jgrid.viewModal;
$.extend($.jgrid, {
    viewModal: function (selector, o) {
        const $gbox = $(o.gbox), $selector = $(selector);
        const of = $gbox.offset(), w = $gbox.width(), h = $gbox.height();
        const w1 = $selector.width(), h1 = $selector.height();
        $selector.css({
            'top': of.top,
            'left': ((w - w1) / 2)
        });
        orgViewModal.call(this, selector, o);
    }
});
$.extend($.jgrid.ajaxOptions, {
    xhrFields: {
        withCredentials: true
    }
});