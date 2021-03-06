const handleChar = (e) => {
e.preventDefault();
    
    $("#failMessage").animate({width:'hide'},350);
    
    if($("#charName").val() == '' || $("#charLevel").val() == '' || $("#charClass").val() == '' || $("#charRace").val() == '' || $("#charRef").val() == '') {   //creates text to show error
        handleError("All fields required");
        return false;
    }
    
    sendAjax('POST', $("#charForm").attr("action"), $("#charForm").serialize(), function() {   //sends data put into program to server
        loadCharsFromServer();
    });
    
    return false;
};

const CharForm = (props) => {   //sets up the character info input bar
    return(
        <form id="charForm"
              onSubmit={handleChar}
              name="charForm"
              action="/maker"
              method="POST"
              className="charForm"
        >
        
        <label htmlFor="name">Name: </label>
        <input id="charName" type="text" name="name" placeholder="Character Name"/>
        <label htmlFor="level">Level: </label>
        <input id="charLevel" type="text" name="level" placeholder="Character Level"/>
        <label htmlFor="class">Class: </label>
        <input id="charClass" type="text" name="class" placeholder="Character Class"/>
        <label htmlFor="race">Race: </label>
        <input id="charRace" type="text" name="race" placeholder="Character Race"/>
        <label htmlFor="ref">Ref Sheet Link: </label>
        <input id="charRef" type="url" name="ref" placeholder="Character Reference"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeCharSubmit" type="submit" value="Make Character" />

            
        </form>
    );
};

const CharList = function(props) {   //creates the list of characters
    if(props.chars.length === 0) {
        return (
            <div className="charList">
                <h3 className="emptyChar">No Characters Yet</h3>
            </div>
        );
    }
    
    const charNodes = props.chars.map(function(char) {  //sets up how character data is displayed
        return (
            <div key={char._id} className="char">
            
            <button type="button" className="charName">{char.name} </button>
                
            <div className="dropdown">
                <ul>
                <li>Name: {char.name} </li>
                <li>Level: {char.level} </li>
                <li>Class: {char.class} </li>
                <li>Race: {char.race} </li>
                <li>Ref Sheet Link => {char.ref} </li>
                </ul>
                </div> 
            
            </div>
        );
    });
    
    return (
        <div className="charList">
            {charNodes}
        </div>
    );
};

const loadCharsFromServer = () => {   //recalls all characters for a specified user
    sendAjax('GET', '/getChars', null, (data) => {
        ReactDOM.render(
            <CharList chars={data.chars} />, document.querySelector("#chars")
        );
    });
};


const setup = function(csrf) {
    ReactDOM.render(
        <CharForm csrf={csrf} />, document.querySelector("#makeChar")
    );
    
    ReactDOM.render(   //creates the array that characters will be stored in
        <CharList chars={[]} />, document.querySelector("#chars")
    );
    
    ReactDOM.render (   //sets up button to call user list
        <MyButton label={"See All Users"} />, document.querySelector("#buttonSpan")
    );
    
     ReactDOM.render(   //creates the array that users will be stored in
        <UserList users={[]} />, document.querySelector("#users")
    );
    
    loadCharsFromServer();
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const downloadUsers = () => { //gets list of users from the account collection of this database
    console.log("users downloaded");
     sendAjax('GET', '/getUsers', null, (result) => {
        ReactDOM.render(
            <UserList users={result.users} />, document.querySelector("#users")
        );
    });
};

const MyButton = (props) => {   //calls download users
    return(
        <button onClick={downloadUsers}>{ props.label }</button>
    );
};

const UserList = function(props) {
    if(props.users.length === 0) {
        return (
            <div className="userList">
                <h3 className="emptyUser">No Users Yet</h3>
            </div>
        );
    }
    
    const userNodes = props.users.map(function(user) {   //Creates the list of users that displays under the character list
        return (
            <div key={user._id} className="user">
           
            <h3 className="userName"> User Name: {user.username} </h3>
            <h3 className="userAge"> Birthday: {user.createdDate} </h3>   
            </div>
        );
    });
    
    return (
        <div className="charList">
            {userNodes}
        </div>
    );
};


$(document).ready(function() {
    getToken();
});















