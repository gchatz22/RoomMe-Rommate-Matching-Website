function renderCards() {
  const cardContainer = document.getElementById("start");
  get('/api/whoami', {}).then(current_user => {
    get('api/users', {"gender": current_user.info.gender}).then(users => {
      if(current_user.completed_form && current_user.info.lastName) {
        for(user of users) {
          if (user._id !== current_user._id) {
            cardContainer.appendChild(createUserCardDOM(user, current_user));
          }
        }
      } else {
        if (current_user.completed_form===false){
          window.location.pathname = '/questionnaire';
        }
        else {
          window.location.pathname = '/profile';
        }
      }
    });
  });
}

function createUserCardDOM(user, current_user) {

  const container = document.createElement("div");
  container.setAttribute("class","container");

  const grid = document.createElement("div");
  grid.setAttribute("class","ui three column grid");

  const row = document.createElement("div");
  row.setAttribute("class","row");


  // Image
  const columnImage = document.createElement("div");
  columnImage.setAttribute("class","four wide column left-margin padding-left");

  const image = document.createElement("img");
  image.setAttribute("src", user.image);
  image.setAttribute("id", "userImage");

  columnImage.appendChild(image);
  row.appendChild(columnImage);


  // Content
  const columnContent = document.createElement("div");
  columnContent.setAttribute("class","eight wide column vline");

  const name = document.createElement("div");
  name.setAttribute("class","ui dividing huge header margin-bottom center aligned");
  name.innerText = user.info.firstName + " " + user.info.lastName;
  const viewPerson = document.createElement("a");
  viewPerson.setAttribute("href", "/viewprofile?"+user._id)
  viewPerson.appendChild(name);
  columnContent.appendChild(viewPerson);

  const gridContent = document.createElement("div");
  gridContent.setAttribute("class", "ui two column grid top-margin");

  const row1 = document.createElement("div");
  row1.setAttribute("class", "row");

  const column1 = document.createElement("div");
  column1.setAttribute("class", "eight wide column");

  rowContent = document.createElement("div");
  rowContent.setAttribute("class", "row");
  rowContent.innerHTML = "<b>Age:</b> "+user.info.age;
  column1.appendChild(rowContent);

  rowContent1 = document.createElement("div");
  rowContent1.setAttribute("class", "row");
  rowContent1.innerHTML = "<b>Class:</b> "+user.info.classYear;
  column1.appendChild(rowContent1);

  rowContent3 = document.createElement("div");
  rowContent3.setAttribute("class", "row");
  rowContent3.innerHTML = "<b>Country:</b> "+user.info.country;
  column1.appendChild(rowContent3);

  rowContent4 = document.createElement("div");
  rowContent4.setAttribute("class", "row");
  if (user.info.state==="International"){
    rowContent4.innerHTML = "<b>State:</b> None ("+user.info.state+")";
  }
  else {
    rowContent4.innerHTML = "<b>State:</b> "+user.info.state;
  }
  column1.appendChild(rowContent4);

  rowContent5 = document.createElement("div");
  rowContent5.setAttribute("class", "row");
  rowContent5.innerHTML = "<b>City:</b> "+user.info.city;
  column1.appendChild(rowContent5);

  const column2 = document.createElement("div");
  column2.setAttribute("class", "eight wide column");

  if (user.info.dorm){
    rowContent6 = document.createElement("div");
    rowContent6.setAttribute("class", "row");
    rowContent6.innerHTML = "<b>Preffered Dorm:</b> "+user.info.dorm;
    column2.appendChild(rowContent6);
  }

  if (user.info.major){
    rowContent7 = document.createElement("div");
    rowContent7.setAttribute("class", "row");
    rowContent7.innerHTML = "<b>Anticipated Major:</b> "+user.info.major;
    column2.appendChild(rowContent7);
  }


  if (user.info.kerberos){
    rowContent8 = document.createElement("div");
    rowContent8.setAttribute("class", "row");
    rowContent8.innerHTML = "<b>Kerberos:</b> "+user.info.kerberos;
    column2.appendChild(rowContent8);
  }

  if (user.info.description){
    rowContent8 = document.createElement("div");
    rowContent8.setAttribute("class", "row");
    rowContent8.innerHTML = "<b>About " + user.info.firstName + ":</b> "+user.info.description;
    column2.appendChild(rowContent8);
  }

  
  row1.appendChild(column1);
  row1.appendChild(column2);
  gridContent.appendChild(row1);
  columnContent.appendChild(gridContent);
  row.appendChild(columnContent);

  // Compatibility
  const columnCompat = document.createElement("div");
  columnCompat.setAttribute("class","three wide column");

  const match = document.createElement("div");
  match.setAttribute("class","ui dividing large padding-top header margin-bottom center aligned");
  match.innerText = "Match";
  columnCompat.appendChild(match);

  get('api/compatibility', {"user1": current_user._id, "user2": user._id, "updatedQ1": current_user.updatedQ, "updatedQ2": user.updatedQ}).then(score => {

    let percentage = Math.round(score.score);

    const percDiv = document.createElement("div");
    percDiv.setAttribute("class", "c100 p"+percentage+" center");

    const inner = document.createElement("span");
    inner.setAttribute("id", "inner");
    inner.innerHTML = percentage+"%";
    percDiv.appendChild(inner);

    const slice = document.createElement("div");
    slice.setAttribute("class", "slice");

    const bar = document.createElement("div");
    bar.setAttribute("class", "bar");

    const fill = document.createElement("div");
    fill.setAttribute("class", "fill");

    slice.appendChild(bar);
    slice.appendChild(fill);
    percDiv.appendChild(slice);
    columnCompat.appendChild(percDiv);

    row.appendChild(columnCompat);
  
})

  grid.appendChild(row);
  container.appendChild(grid);

  return container
}

get('/api/whoami', {}).then(user => {

  if (user._id){

    renderNavbar(user);

    if (user.info.lastName){
      renderCards();
    }
    else {
      const start = document.getElementById("start");
      const message = document.createElement("div");
      message.setAttribute("class", "ui warning message center top-margin");
      message.innerHTML= "Please set up your profile before you start matching with your classmates by <a href='/profile?" + user._id + "'>editting your profile</a> and completing the required fields.";
      start.appendChild(message);
    }

  }
  else {
    window.location.pathname = '/';
}
});
