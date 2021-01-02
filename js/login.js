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
        console.log('Fazendo Login')
   })
   .fail(function(jqXHR, textStatus, msg){
    console.log('Deu Merda')
});
})