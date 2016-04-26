// general ad-hoc scripts for UI components
$(function() {
    $('#clear-filter-btn').click(function() {
        $( document ).trigger( 'filter:clearRebind' );
        $('#lunr-filter').val('');
        // $('#filter-organization').val('*').change();
        // $('#filter-objective').val('**').change();
        // $('#filter-methodology').val('***').change();
        // $('#filter-sector').val('****').change();
        // $('#filter-region').val('*****').change();
        // $('#filter-type').val('******').change();

        $('select.b-filter option').prop('selected', false).removeClass('m-active');
        $("#filter-organization option[data-filter='*']").prop('selected', true).addClass('m-active');
        $("#filter-objective option[data-filter='**']").prop('selected', true).addClass('m-active');
        $("#filter-methodology option[data-filter='***']").prop('selected', true).addClass('m-active');
        $("#filter-sector option[data-filter='****']").prop('selected', true).addClass('m-active');
        $("#filter-region option[data-filter='*****']").prop('selected', true).addClass('m-active');
        $("#filter-type option[data-filter='******']").prop('selected', true).addClass('m-active');
    });
});