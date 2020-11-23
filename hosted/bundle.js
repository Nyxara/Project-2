"use strict";

var handleChar = function handleChar(e) {
  e.preventDefault();
  $("#failMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#charName").val() == '' || $("#charLevel").val() == '') {
    handleError("Rawr X3 || All fields required UwU");
    return false;
  }

  sendAjax('POST', $("#charForm").attr("action"), $("#charForm").serialize(), function () {
    loadCharsFromServer();
  });
  return false;
};

var CharForm = function CharForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "charForm",
    onSubmit: handleChar,
    name: "charForm",
    action: "/maker",
    method: "POST",
    className: "charForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "charName",
    type: "text",
    name: "name",
    placeholder: "Character Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "level"
  }, "Level: "), /*#__PURE__*/React.createElement("input", {
    id: "charLevel",
    type: "text",
    name: "level",
    placeholder: "Character Level"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "class"
  }, "Class: "), /*#__PURE__*/React.createElement("input", {
    id: "charClass",
    type: "text",
    name: "class",
    placeholder: "Character Class"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "race"
  }, "Race: "), /*#__PURE__*/React.createElement("input", {
    id: "charRace",
    type: "text",
    name: "race",
    placeholder: "Character Race"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "ref"
  }, "Ref Sheet Link: "), /*#__PURE__*/React.createElement("input", {
    id: "charRef",
    type: "url",
    name: "ref",
    placeholder: "Character Reference"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeCharSubmit",
    type: "submit",
    value: "Make Character"
  }));
};

var CharList = function CharList(props) {
  if (props.chars.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "charList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyChar"
    }, "No Characters Yet"));
  }

  var charNodes = props.chars.map(function (_char) {
    return /*#__PURE__*/React.createElement("div", {
      key: _char._id,
      className: "char"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "charName"
    }, " Name: ", _char.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "charLevel"
    }, " Level: ", _char.level, " "), /*#__PURE__*/React.createElement("h3", {
      className: "charClass"
    }, " Class: ", _char["class"], " "), /*#__PURE__*/React.createElement("h3", {
      className: "charRace"
    }, " Race: ", _char.race, " "), /*#__PURE__*/React.createElement("h3", {
      className: "charRef"
    }, " Ref Sheet Link: ", /*#__PURE__*/React.createElement("a", {
      href: "{char.ref}"
    }, _char.ref), " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "charList"
  }, charNodes);
};

var loadCharsFromServer = function loadCharsFromServer() {
  sendAjax('GET', '/getChars', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
      chars: data.chars
    }), document.querySelector("#chars"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(CharForm, {
    csrf: csrf
  }), document.querySelector("#makeChar"));
  ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
    chars: []
  }), document.querySelector("#chars"));
  ReactDOM.render( /*#__PURE__*/React.createElement(MyButton, {
    label: "See All Users"
  }), document.querySelector("#buttonSpan"));
  ReactDOM.render( /*#__PURE__*/React.createElement(UserList, {
    users: []
  }), document.querySelector("#users"));
  loadCharsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var downloadUsers = function downloadUsers() {
  console.log("users downloaded");
  sendAjax('GET', '/getUsers', null, function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(UserList, {
      users: result.users
    }), document.querySelector("#users"));
  });
};

var MyButton = function MyButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: downloadUsers
  }, props.label);
};

var UserList = function UserList(props) {
  if (props.users.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "userList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyUser"
    }, "No Users Yet"));
  }

  var userNodes = props.users.map(function (user) {
    return /*#__PURE__*/React.createElement("div", {
      key: user._id,
      className: "user"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "userName"
    }, " User Name: ", user.username, " "), /*#__PURE__*/React.createElement("h3", {
      className: "userAge"
    }, " Birthday: ", user.createdDate, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "charList"
  }, userNodes);
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("errorMessage").text(message);
  $("failMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("failMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
