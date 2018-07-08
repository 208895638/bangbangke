/**
 * User: tom
 * Date: 2018/6/5
 * Time: 12:35
 */
import opg from 'ts/opg'

window.addTabItem = function (name, url, id) {
    top.window.tabs.addItem({
        name,
        url: `../demo/${url}`,
        auto: true,
        id
    });
};

$(document).ready(function () {
    $('.templateOperationContainer').each(function (index, elem) {
        var tmpl = `<div> ${$('script', this).html()}</div>`;
        let $tmpl = $(tmpl);
        $tmpl.find('#delete').remove();
        var render = template.compile($tmpl.html());
        elem.innerHTML = render({});
    });

    $('#add').on('click', function () {
        opg.ok('add');
    });
    $('#delete').on('click', function () {
        opg.err('delete');
    });

    let selectedIndex = 0;
    let data = [
        {
            id: 0,
            name: '0'
        },
        {
            id: 1,
            name: '1'
        },
        {
            id: 2,
            name: '2'
        }
    ];
    let tdStage = opg('#tdStage').radioBox({
        data,
        selectedIndex,
    });

    $('#btnRadioDisabled').on('click', () => {
        tdStage.setDisabled(0)
    });
    $('#btnRadioUnDisabled').on('click', () => {
        tdStage.setDisabled(0, false)
    });

    $('#btnRadioGetText').on('click', () => {
        console.log(tdStage.getText());
    });
    $('#btnRadioGetValue').on('click', () => {
        console.log(tdStage.getValue());
    });


    let tdStage1 = opg('#tdStage1').checkBox({
        data,
        selectedIndex,
    });

    $('#btnCheckboxDisabled').on('click', () => {
        tdStage1.setDisabled(0);
    });
    $('#btnCheckboxUnDisabled').on('click', () => {
        tdStage1.setDisabled(0, false);
    });
    $('#btnCheckboxGetText').on('click', () => {
        console.log(tdStage1.getText());
    });
    $('#btnCheckboxGetValue').on('click', () => {
        console.log(tdStage1.getValue());
    });

    let tdSelect = opg('#tdSelect').listBox({
        data,
        autoPrependBlank: false,
        selectedIndex: 1
    });
    console.log(tdSelect);
    setTimeout(() => {
        // tdSelect.setValue(0)
        console.log(tdSelect.getValue());
    }, 1000);

});