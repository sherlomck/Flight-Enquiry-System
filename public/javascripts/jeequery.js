$(document).ready(function(){
    $.getJSON('/enquiry/fetch_states',function(data){
        data.map((item)=>{
            $('#sourcestate').append($('<option>').text(item.statename).val(item.stateid))
            $('#desstate').append($('<option>').text(item.statename).val(item.stateid))
        })
        $('#sourcestate').formSelect();
        $('#desstate').formSelect();
    })
    $('#sourcestate').change(function(){
        $('#sourcecity').empty();
        $('#sourcecity').append($('<option disabled selected>').text("--Choose option--"))
        $.getJSON('/enquiry/fetch_city', {stateid:$('#sourcestate').val()}, function(data){
            data.map((item)=>{
                $('#sourcecity').append($('<option>').text(item.cityname).val(item.cityid))
            })
            $('#sourcecity').formSelect();
        })
    })
    $('#desstate').change(function(){
        $('#descity').empty();
        $('#descity').append($('<option disabled selected>').text("--Choose option--"))
        $.getJSON('/enquiry/fetch_city', {stateid:$('#desstate').val()}, function(data){
            data.map((item)=>{
                $('#descity').append($('<option>').text(item.cityname).val(item.cityid))
            })
            $('#descity').formSelect();
        })
    })
})


