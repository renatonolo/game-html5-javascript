function checkEmptyInputText(id){
    var name = $('#' + id).val();
    if(name == ""){
        $('#grp_' + id).addClass('has-error');
        $('#grp_' + id).addClass('has-feedback');
    } else {
        $('#grp_' + id).removeClass('has-error');
        $('#grp_' + id).removeClass('has-feedback');
    }
}

function create(){
    var name = $('#playerName').val();
    var email = $('#email').val();
    var facebookID = $('#facebookID').val();

    $.post(
        '/create',
        {
            name: name,
            email: email,
            facebookID: facebookID
        },
        function(result){
            console.log(result);
            if(result.status == 0){
                window.location = "/";
            }
        }
    );
}