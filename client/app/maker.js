const handleDomo = (e) => {
e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'},350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("Rawr X3 || All fields required UwU");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
              onSubmit={handleDomo}
              name="domoForm"
              action="/maker"
              method="POST"
              className="domoForm"
        >
        
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="kills">Kills: </label>
        <input id="domoKills" type="number" name="kills" placeholder="0"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />

            
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="domoName"> Name: {domo.name} </h3>
            <h3 className="domoAge"> Age: {domo.age} </h3>
            <h3 className="domoKills"> War Crimes Committed: {domo.kills} </h3>   
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};


const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    ReactDOM.render (
        <MyButton label={"See All Users"} />, document.querySelector("#buttonSpan")
    );
    
     ReactDOM.render(
        <UserList users={[]} />, document.querySelector("#users")
    );
    
    loadDomosFromServer();
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
            <div className="domoList">
                <h3 className="emptyDomo">No Users Yet</h3>
            </div>
        );
    }
    
    const userNodes = props.users.map(function(user) {
        return (
            <div key={user._id} className="domo">
           
            <h3 className="domoName"> User Name: {user.username} </h3>
            <h3 className="domoAge"> Birthday: {user.createdDate} </h3>   
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {userNodes}
        </div>
    );
};


$(document).ready(function() {
    getToken();
});















