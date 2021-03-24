(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],[,,,,,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var c=n(0),s=n.n(c),a=n(8),o=n.n(a),r=(n(17),n(6)),i=(n(18),window.socket),l="studygorize-",u={setItem:function(e,t){t=JSON.stringify({value:t}),localStorage.setItem(l+e,t)},getItem:function(e){var t=localStorage.getItem(l+e);return null!==t?JSON.parse(t).value:null},removeItem:function(e){localStorage.removeItem(l+e)},clear:function(){localStorage.clear()}},d=u,j=(n(19),n(1));var m=function(e){var t=Object(c.useState)(d.getItem("partyId")),n=Object(r.a)(t,2),s=n[0],a=n[1],o=Object(c.useState)(d.getItem("name")),l=Object(r.a)(o,2),u=l[0],m=l[1],b=Object(c.useState)(),O=Object(r.a)(b,2),h=O[0],f=O[1],p=Object(c.useState)(),x=Object(r.a)(p,2),v=x[0],g=x[1],y=Object(c.useState)(!1),N=Object(r.a)(y,2),I=N[0],S=N[1];return Object(c.useEffect)((function(){var t=d.getItem("uuid");return null!==t&&i.emit("rejoinParty",t),i.on("partyNotExist",(function(){e.setModalTitle("Uh oh!"),e.setModalBody("It looks like that party doesn't exist \ud83d\ude41"),e.setShowModal(!0),S(!1)})),i.on("nameTaken",(function(){e.setModalTitle("Oh no!"),e.setModalBody("It looks like that name is already taken \ud83d\ude26\nTry something a little more unique!"),e.setShowModal(!0),S(!1)})),i.on("uuidNotExist",(function(){d.removeItem("uuid"),S(!1)})),function(){i.off("partyNotExist"),i.off("nameTaken"),i.off("uuidNotExist")}}),[]),Object(j.jsxs)("div",{className:"Join-container",children:[Object(j.jsx)("div",{className:"row",children:Object(j.jsx)("div",{className:"Join-header",children:Object(j.jsx)("h1",{className:"theme-font text-light",children:"Studygorize Party"})})}),Object(j.jsx)("div",{className:"row",children:Object(j.jsxs)("form",{onSubmit:function(t){t.preventDefault();var n=!0;if(s.length<4&&(f(!0),n=!1),u.length<1&&(g(!0),n=!1),n){S(!0),console.log("Connected:",i.connected),i.disconnected&&i.connect();var c=d.getItem("uuid");null!==c?i.emit("rejoinParty",c):(i.emit("joinParty",{name:u,partyId:s}),d.setItem("name",u),e.emitName(u),e.emitPartyId(s))}},id:"joinForm",children:[Object(j.jsxs)("div",{className:"form-group",children:[Object(j.jsx)("label",{htmlFor:"partyCodeInput",id:"partyCodeLabel",className:"text-light",children:"Party Code"}),Object(j.jsx)("input",{onChange:function(e){return a(e.target.value)},value:s,type:"text",id:"partyCodeInput",className:"form-control text-uppercase",maxLength:"4",placeholder:"enter 4-letter code",autoComplete:"off",required:!0}),h&&Object(j.jsx)("div",{className:"alert alert-warning mt-1",children:"The code needs to be 4 letters long"})]}),Object(j.jsxs)("div",{className:"form-group",children:[Object(j.jsx)("label",{htmlFor:"nameInput",id:"nameLabel",className:"text-light",children:"Name"}),Object(j.jsx)("input",{onChange:function(e){return m(e.target.value)},value:u,type:"text",id:"nameInput",className:"form-control",maxLength:"12",placeholder:"enter your name",required:!0}),v&&Object(j.jsx)("div",{className:"alert alert-warning mt-1",children:"Enter your name"})]}),Object(j.jsxs)("button",{type:"submit",id:"joinBtn",className:"btn btn-light",children:[I&&Object(j.jsx)("span",{class:"join-spinner spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}),!I&&Object(j.jsx)("span",{children:"Join"})]})]})}),Object(j.jsx)("div",{className:"row",children:Object(j.jsxs)("footer",{className:"Join-footer text-light text-center",children:["Create your own Studygorize account at",Object(j.jsx)("strong",{children:Object(j.jsx)("a",{className:"text-light",href:"https://studygorize.web.app",target:"_blank",children:" studygorize.web.app"})})]})})]})};n(21);var b=function(e){var t=e.title,n=e.message;return Object(j.jsxs)("div",{className:"WaitingRoom",children:[Object(j.jsx)("h2",{className:"theme-font",children:t}),Object(j.jsx)("span",{children:n})]})};n(22);var O=function(){return Object(j.jsx)("button",{className:"QuitBtn btn",onClick:function(){d.removeItem("uuid"),i.emit("leaveParty"),i.close()},children:Object(j.jsx)("strong",{children:"Quit"})})};n(23);var h=function(e){var t=e.name,n=e.score;return Object(j.jsxs)("footer",{className:"NameScorePanel-container",children:[Object(j.jsx)("span",{className:"NameScorePanel-name",children:t}),null!==n&&NaN!==n&&Object(j.jsx)("span",{className:"NameScorePanel-score",children:n})]})};n(24);var f=function(){return Object(j.jsxs)("div",{className:"QuestionLoading-container",children:[Object(j.jsx)("div",{className:"spinner-custom spinner-border mb-2",role:"status",children:Object(j.jsx)("span",{className:"sr-only",children:"Loading..."})}),Object(j.jsx)("h3",{className:"text-light",children:"Get Ready!"})]})};n(25),n(26);var p=function(e){var t=e.letter,n=e.value,c=e.color,s=e.disabled,a=e.isSelected,o=e.onClick,r="text-".concat(c," theme-font QuestionOption");return s&&a?r+=" selected":s&&!a&&(r+=" unselected"),Object(j.jsx)("button",{className:r,onClick:o,value:n,disabled:s,children:t})};var x=function(e){var t=e.count,n=Object(c.useState)(void 0),s=Object(r.a)(n,2),a=s[0],o=s[1],l=["A","B","C","D"],u=["red","purple","green","yellow"];function d(e){e.preventDefault();var t=parseInt(e.currentTarget.value);o(t),i.emit("selectOption",t)}for(var m=[],b=0;b<t;b++)m.push(Object(j.jsx)(p,{onClick:d,value:b,letter:l[b],color:void 0===a||a===b?u[b]:"gray",isSelected:a===b,disabled:void 0!==a}));return Object(j.jsx)("div",{className:"QuestionOptions-container",children:Object(j.jsx)("div",{className:"QuestionOptions-options-container",children:m})})},v=n(35),g=n(36);var y=function(e){function t(){e.setIsOpen(!1)}return Object(j.jsxs)(v.a,{show:e.isOpen,onHide:t,children:[Object(j.jsx)(v.a.Header,{closeButton:!0,children:Object(j.jsx)(v.a.Title,{children:e.title})}),Object(j.jsx)(v.a.Body,{children:e.body}),Object(j.jsx)(v.a.Footer,{children:Object(j.jsx)(g.a,{variant:"secondary",onClick:t,children:"Close"})})]})};n(30);var N=function(e){var t=e.isCorrect,n=e.score,c=t?"Correct!":"Incorrect!",s=t?"check":"close",a=t?"bg-success":"bg-danger";return a+=" QuestionResult-container",Object(j.jsxs)("div",{className:a,children:[Object(j.jsx)("h2",{className:"QuestionResult-text",children:c}),Object(j.jsx)("div",{className:"QuestionResult-icon",children:Object(j.jsx)("i",{className:"material-icons",children:s})}),Object(j.jsxs)("span",{className:"QuestionResult-points",children:["+",n]})]})};n(31);var I=function(e){var t=e.score;return Object(j.jsxs)("div",{className:"PartyResults",children:[Object(j.jsx)("h1",{className:"theme-font",children:"You scored:"}),Object(j.jsxs)("h2",{children:[t," ",1===t?"point":"points"]})]})};var S=function(){var e=Object(c.useState)(!1),t=Object(r.a)(e,2),n=t[0],s=t[1],a=Object(c.useState)(d.getItem("uuid")),o=Object(r.a)(a,2),l=(o[0],o[1],Object(c.useState)(d.getItem("name"))),u=Object(r.a)(l,2),p=u[0],v=u[1],g=Object(c.useState)(d.getItem("partyId")),S=Object(r.a)(g,2),C=S[0],w=S[1],k=Object(c.useState)(0),P=Object(r.a)(k,2),R=P[0],E=P[1],T=Object(c.useState)(!1),B=Object(r.a)(T,2),J=B[0],L=B[1],M=Object(c.useState)(""),Q=Object(r.a)(M,2),q=Q[0],F=Q[1],D=Object(c.useState)(""),z=Object(r.a)(D,2),Y=z[0],A=z[1],W=Object(c.useRef)();W.current=R;var H=Object(j.jsx)(m,{name:p,partyId:C,emitName:v,emitPartyId:w,setShowModal:L,setModalTitle:F,setModalBody:A}),G=Object(c.useState)(H),U=Object(r.a)(G,2),_=U[0],K=U[1];function V(e){var t=e.isCorrect,n=e.points;E(W.current+n),K(Object(j.jsx)(N,{isCorrect:t,score:n}))}return Object(c.useEffect)((function(){return i.on("partyJoined",(function(e){var t=e.partyId,n=e.uuid;d.setItem("partyId",t),d.setItem("uuid",n),s(!0),K(Object(j.jsx)(b,{title:"You're in!",message:"Waiting for the party to start..."})),console.log("Party ".concat(t," joined!"))})),i.on("partyRejoined",(function(e){var t=e.name,n=e.score;E(n),v(t),d.setItem("name",t),s(!0),K(Object(j.jsx)(b,{title:"You're back in!",message:"Waiting for the next question..."}))})),i.on("partyEnded",(function(){s(!1),E(0),F("Disconnected"),A("You were disconnected from the party because it ended \ud83d\ude25"),L(!0),K(H),d.removeItem("partyId"),d.removeItem("uuid")})),i.on("questionLoading",(function(){K(Object(j.jsx)(f,{}))})),i.on("showOptions",(function(e){K(Object(j.jsx)(x,{count:e}))})),i.on("questionResult",V),i.on("partyResults",(function(e){K(Object(j.jsx)(I,{score:e})),E(0)})),i.on("disconnect",(function(){console.log("DISCONNECTED"),s(!1),w(d.getItem("partyId")),E(0),K(H),i.connect()})),function(){i.off("partyJoined"),i.off("partyRejoined"),i.off("partyEnded"),i.off("questionLoading"),i.off("showOptions"),i.off("questionResult"),i.off("partyResults"),i.off("disconnect")}}),[]),Object(j.jsx)("div",{className:"App bg-primary",children:Object(j.jsxs)("div",{className:"App-content",children:[Object(j.jsx)(y,{title:q,body:Y,isOpen:J,setIsOpen:L}),n&&Object(j.jsx)(O,{}),_,n&&Object(j.jsx)(h,{name:p,score:R})]})})},C=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,37)).then((function(t){var n=t.getCLS,c=t.getFID,s=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),c(e),s(e),a(e),o(e)}))};o.a.render(Object(j.jsx)(s.a.StrictMode,{children:Object(j.jsx)(S,{})}),document.getElementById("root")),C()}],[[32,1,2]]]);
//# sourceMappingURL=main.d6b98367.chunk.js.map