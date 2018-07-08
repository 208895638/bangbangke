/**
 * User: tom
 * Date: 2018/6/7
 * Time: 16:55
 */
import {Languages} from 'ts/util/Languages';
jQuery.datetimepicker.setLocale(Languages.current);
$('#starttime,#stoptime').each(function (i, elem) {
    $(elem).datetimepicker({
        timepicker: false,
        //closeOnDateSelect: true,
        format: 'Y-m-d'
    });
});