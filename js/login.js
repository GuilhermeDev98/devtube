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
       
          // window.open("index.html", "_TOP"); 
            const tokenAccess = jqXHR.accessToken

          $.ajax({
            method: "GET",
            url: "http://localhost:3333/api/v1/login",
            beforeSend : function(xhr){
                $("#login-btn").val("Buscando dados...");
                xhr.setRequestHeader("access-token", tokenAccess);
           }
        }).done(function(jqXHR){
            $('#error-login').html("Dados recebidos com sucesso.") 
            const nome = jqXHR.fullname
            $('#nomecompleto').html(nome)
    
       })




   })
   .fail(function(jqXHR){
    $('#error-login').html(jqXHR.responseJSON.message)
    console.log(jqXHR)
});
})