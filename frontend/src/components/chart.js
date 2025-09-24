$('#hiddenInput').datepicker({
    showOn: 'button',
    // buttonImage: 'date',
    buttonImageOnly: true,
    onSelect: function (selectedDate) {
        $('#calendarDay').text(selectedDate);
        $('#hiddenInput').datepicker('destroy');
    }
});

const datepicker = jQuery('#datepicker');
console.log(datepicker);
(typeof jQuery != 'undefined')
{
    console.log('jQuery подключён');
}



