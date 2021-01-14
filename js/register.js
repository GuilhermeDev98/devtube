var registerBtn = document.querySelector("#register-btn");

registerBtn.addEventListener("click", function (e) {
    e.preventDefault()


    const data = $('#registerForm').serialize()

    $.ajax({
        method: "POST",
        url: "http://localhost:3333/api/v1/users",
        data,
        beforeSend : function(){
            $("#register-btn").val("Criando...");
       }
    }).done(function(msg){
        $('#error-register').html("Cadastrado com sucesso")
   })
   .fail(function(jqXHR){
    $('#error-register').html(jqXHR.responseJSON.message)
    console.log(jqXHR)
});
})
