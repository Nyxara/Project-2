const handleError = (message) => {   //displays error messages set in controllers
    $("#errorMessage").text(message);
    $("#failMessage").animate({width:'toggle'},350); //pulls error message onscreen
};

const redirect = (response) => {
    $("#failMessage").animate({width:'hide'},350); //hides error message
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};