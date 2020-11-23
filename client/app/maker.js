const handleChar = (e) => {
e.preventDefault();
    
    $("#failMessage").animate({width:'hide'},350);
    
    if($("#charName").val() == '' || $("#charLevel").val() == '') {
        handleError("Rawr X3 || All fields required UwU");
        return false;
    }
    
    sendAjax('POST', $("#charForm").attr("action"), $("#charForm").serialize(), function() {
        loadCharsFromServer();
    });
    
    return false;
};

const CharForm = (props) => {
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

const CharList = function(props) {
    if(props.chars.length === 0) {
        return (
            <div className="charList">
                <h3 className="emptyChar">No Characters Yet</h3>
            </div>
        );
    }
    
    const charNodes = props.chars.map(function(char) {
        return (
            <div key={char._id} className="char">
            
            <h3 className="charName"> Name: {char.name} </h3>
            <h3 className="charLevel"> Level: {char.level} </h3>
            <h3 className="charClass"> Class: {char.class} </h3>  
            <h3 className="charRace"> Race: {char.race} </h3>
            <h3 className="charRef"> Ref Sheet Link: <a href="{char.ref}">{char.ref}</a> </h3>   
            </div>
        );
    });
    
    return (
        <div className="charList">
            {charNodes}
        </div>
    );
};

const loadCharsFromServer = () => {
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
    
    ReactDOM.render(
        <CharList chars={[]} />, document.querySelector("#chars")
    );
    
    ReactDOM.render (
        <MyButton label={"See All Users"} />, document.querySelector("#buttonSpan")
    );
    
     ReactDOM.render(
        <UserList users={[]} />, document.querySelector("#users")
    );
    
    loadCharsFromServer();
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const downloadUsers = () => {
    console.log("users downloaded");
     sendAjax('GET', '/getUsers', null, (result) => {
        ReactDOM.render(
            <UserList users={result.users} />, document.querySelector("#users")
        );
    });
};

const MyButton = (props) => {
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
    
    const userNodes = props.users.map(function(user) {
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















