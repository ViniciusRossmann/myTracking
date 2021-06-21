// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
		"paging": false,
		"searching": false,
		"ordering": false,
		"aaSorting": [],
        "language": {
            "sProcessing": "Aguarde enquanto os dados são carregados ...",
			"sLengthMenu": "Mostrar _MENU_ registros por pagina",
			"sZeroRecords": "Nenhum registro encontrado",
			"sInfoEmtpy": "",
			"infoEmpty": "",
			"sInfo": "",
			"sInfoFiltered": "",
			"sSearch": "Procurar",
			"oPaginate": {
			   "sFirst":    "Primeiro",
			   "sPrevious": "Anterior",
			   "sNext":     "Próximo",
			   "sLast":     "Último"
			}
        }
    });
});
