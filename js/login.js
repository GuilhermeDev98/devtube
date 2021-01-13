var loginBtn = document.querySelector("#login-btn");

 
loginBtn.addEventListener("click", function(e){
    e.preventDefault()

    const data = $('#loginForm').serialize()
    $.ajax({
        method: "POST",
        url: "http://localhost:3333/api/v1/auth",
        data,
        beforeSend : function(){
            $("#login-btn").val("Logando...");
       }
    }).done(function(jqXHR){
        $('#error-login').html("Logado com sucesso")
        

        $.ajax({
            method: "POST",
            url: "http://localhost:3333/api/v1/auth",
            data,
            beforeSend : function(){
                $("#login-btn").val("Logando...");
           }
        }).done(function(jqXHR){
            $('#error-login').html("Logado com sucesso")  
       })
   })
   .fail(function(jqXHR){
    $('#error-login').html(jqXHR.responseJSON.message)
    console.log(jqXHR)
});
})