function newNavbarItem(text, url, extra) {
  const itemLink = document.createElement('a');
  if (extra){
    itemLink.className =  extra + ' item';
  }
  else {
    itemLink.className = 'item';
  }
  if (text==="Logout"){
    itemLink.id="logout"
  }
  if(text==="Home") {
    let icon = document.createElement('i')
    icon.setAttribute('class','home large icon');
    itemLink.href=url;
    itemLink.appendChild(icon);
  } else if (text==="Profile") {
    let icon = document.createElement('i')
    icon.setAttribute('class','user circle outline large icon');
    itemLink.href=url;
    itemLink.appendChild(icon);
  } else if(text==="Edit Profile") {
    let icon = document.createElement('i')
    icon.setAttribute('class','edit outline large icon');
    itemLink.href=url;
    itemLink.appendChild(icon);
  } else {
    itemLink.innerHTML = text;
    itemLink.href = url;
  }

  return itemLink
}

function newNavbarItemResponsive(text, url, extra) {

  const itemLink = document.createElement('a');
  if (extra){
    itemLink.className =  extra + ' item';
  }
  else {
    itemLink.className = 'item';
  }
  if (text==="Logout"){
    itemLink.id="logout"
  }
  if(text==="Home") {

    itemLink.innerText = "Home";
    itemLink.href=url;
  } else if(text==="Profile") {
    itemLink.innerText = "Profile";
    itemLink.href=url;
  } else if(text==="Edit Profile") {
    itemLink.innerText = "Edit Profile";
    itemLink.href=url;
  }
  else {
    itemLink.innerHTML = text;
    itemLink.href = url;
  }

  return itemLink;
}

  
function helloUserDiv(text) {
  const itemLink = document.createElement('div');
  itemLink.setAttribute("style", "padding-right: 125px;");
  
  itemLink.innerHTML = text;
  itemLink.id="name"
  itemLink.className = 'item';

  return itemLink
}
    
function renderNavbar(user) {
  const navbarDiv = document.getElementById('nav-item-container');

  navbarDiv.appendChild(newNavbarItem('Home', '/feed'));

  if (user._id !== undefined) {
    navbarDiv.appendChild(newNavbarItem('Profile', '/viewprofile?'+user._id, 'active'));
    navbarDiv.appendChild(newNavbarItem('Edit Profile', '/profile?'+user._id));
    navbarDiv.appendChild(helloUserDiv("Hello, "+user.info.firstName));
    navbarDiv.appendChild(newNavbarItem('Logout', '/logout', 'right floated'));
  }

  let icon = document.createElement('i')
  icon.setAttribute('id','menu');
  icon.setAttribute('class','bars icon');
  icon.addEventListener("click", responsive);
  navbarDiv.appendChild(icon);


}

function renderNavbarResponsive(user) {
  const navbarDiv = document.getElementById('nav-container');
  const dropdown = document.getElementById('dropdown');

  dropdown.appendChild(newNavbarItemResponsive('Home', '/feed'));

  if (user._id !== undefined) {
    dropdown.appendChild(newNavbarItemResponsive('Profile', '/viewprofile?'+user._id));
    dropdown.appendChild(newNavbarItemResponsive('Edit Profile', '/profile?'+user._id));
    dropdown.appendChild(newNavbarItemResponsive('Logout', '/logout', 'right floated'));
  }

  navbarDiv.appendChild(dropdown);

}

get('/api/whoami', {}).then(user => {
  renderNavbarResponsive(user);
});
    
    
function responsive(){
  let navbar = document.getElementById("nav-item-container");
  let dropdown = document.getElementById("dropdown");

  if (navbar.className === "ui inverted secondary pointing menu"){
    navbar.className = "ui inverted secondary pointing menu responsive";
    dropdown.className = "show";

  }
  else {
    navbar.className = "ui inverted secondary pointing menu";
    dropdown.className = "";
  }
}
