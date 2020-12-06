const handleLogin = (e) => {
    e.preventDefault();
    
    $("#failMessage").animate({width:'hide'},350);
    
    if($("#user").val() == '' || $("#pass").val() == '') {   //provides error message to display on screen
        handleError("Both Username and Password are required");
        return false;
    }
    
    console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    
    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    
    $("#failMessage").animate({width:'hide'},350);
    
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {   //supposed to write an error on screen, but never worked
        handleError("All Fields Required");
        return false;
    }
    
    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords Do Not Match");
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    
    return false;
};

const LoginWindow = (props) => {   //sets up the login page
    return (
    <form id="loginForm" 
        name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
    >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username"/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="formSubmit" type="submit" value="Sign In" />
            
        </form>
    );
};

const SignupWindow = (props) => {  //sets up sign up page
    return (
    <form id="signupForm" 
        name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm"
    >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username"/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password"/>
    <label htmlFor="pass2">Password: </label>
    <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="formSubmit" type="submit" value="Sign Up" />
            
        </form>
    );
};

const createLoginWindow = (csrf) => {   //renders login page
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {   //renders signUp page
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {   //sets up the buttons on login and signUp buttons with eventListeners
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });
    
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
    
    createLoginWindow(csrf); //default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});













