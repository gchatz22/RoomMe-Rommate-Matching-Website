function main() {

  get('/api/whoami', {}).then(user => {
    if (user._id){
      
      renderNavbar(user);
      const profileId = window.location.search.substring(1);
      if (user._id===profileId){

        const facebookIcon = document.getElementById("facebookIcon");
        const instagramIcon = document.getElementById("instagramIcon");

        facebookIcon.setAttribute("href", user.info.facebook);
        instagramIcon.setAttribute("href", user.info.instagram);

        const altImageButton = document.getElementById("altImageButton");
        altImageButton.addEventListener("click", setAltImage);

        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");
        const country = document.getElementById("country");
        const state = document.getElementById("state");
        const city = document.getElementById("city");
        const gender = document.getElementById("gender");
        const age = document.getElementById("age");
        const classYear = document.getElementById("classYear");
        const dorm = document.getElementById("dorm");
        const major = document.getElementById("major");
        const description = document.getElementById("description");
        const facebook = document.getElementById("facebook");
        const instagram = document.getElementById("instagram");
        const kerberos = document.getElementById("kerberos");

        firstName.value = user.info.firstName;
        lastName.value = user.info.lastName;
        country.value = user.info.country;
        state.value = user.info.state;
        city.value = user.info.city;
        gender.value = user.info.gender;
        age.value = user.info.age;
        classYear.value = user.info.classYear;

        if (dorm.value!==undefined){
          dorm.value = user.info.dorm;
        }

        if (major.value!==undefined){
          major.value = user.info.major;
        }

        if (description.value!==undefined){
          description.value = user.info.description;
        }

        if (facebook.value!==undefined){
          facebook.value = user.info.facebook;
        }
        
        if (instagram.value!==undefined){
        instagram.value = user.info.instagram;
        }

        if (kerberos.value!==undefined){
          kerberos.value = user.info.kerberos;
        }


        const submitButton = document.getElementById("submitButton");
        submitButton.addEventListener('click', profile);
      }
      else {
        //show viewPerson
        console.log("not your profile")
      }


    }
    else {
      window.location.pathname="/";
    }
  });
}

function profile(){

  const infoMessage = document.getElementById("infoMessage");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const gender = document.getElementById("gender");
  const age = document.getElementById("age");
  const classYear = document.getElementById("classYear");
  const dorm = document.getElementById("dorm");
  const major = document.getElementById("major");
  const description = document.getElementById("description");
  const facebook = document.getElementById("facebook");
  const instagram = document.getElementById("instagram");
  const kerberos = document.getElementById("kerberos");
  const genderDropdown = document.getElementById("dropdown Gender");
  const country = document.getElementById("country");
  const city = document.getElementById("city");
  const stateDropdown = document.getElementById("dropdown State");  
  const dormDropdown = document.getElementById("dropdown Dorm");  
  const altImageInput = document.getElementById("altImageInput");

  infoMessage.setAttribute("class", "ui teal message")


  if (submitButton.innerText==="Submit"){

    if (firstName.value && lastName.value && gender.value && age.value && classYear.value && country.value && state.value && city.value){
      data = {
        "firstName": firstName.value,
        "lastName": lastName.value,
        "country": country.value,
        "state": state.value,
        "city": city.value,
        "gender": gender.value,
        "age": age.value,
        "classYear": classYear.value,
        "dorm": dorm.value,
        "major": major.value,
        "description": description.value,
        "facebook": facebook.value,
        "instagram": instagram.value,
        'kerberos': kerberos.value
      }
  
      post('api/submitProfile', data).then(a => {
        window.location.pathname = "/logout";
      });
    }
    else {

      const errorDiv = document.getElementById("error-message");
  
      if (errorDiv.className==="right floated column right-margin sth"){
  
        errorDiv.setAttribute("class", "right floated column right-margin sthi")
        const message = document.createElement("div");
        message.setAttribute("class", "ui error message");
        message.innerText = "You haven't completed all the required fields"
    
        errorDiv.appendChild(message);
  
      }
  
  
    }

  }

  firstName.setAttribute("disabled", "true");
  lastName.setAttribute("disabled", "true");
  genderDropdown.setAttribute("class", "ui selection dropdown");
  country.setAttribute("disabled", "true");
  stateDropdown.setAttribute("class", "ui selection dropdown");
  city.setAttribute("disabled", "true");
  age.setAttribute("disabled", "true");
  classYear.setAttribute("disabled", "true");
  dormDropdown.setAttribute("class", "ui selection dropdown");
  major.setAttribute("disabled", "true");
  description.setAttribute("disabled", "true");
  facebook.setAttribute("disabled", "true");
  instagram.setAttribute("disabled", "true");
  kerberos.setAttribute("disabled", "true");
  altImageInput.setAttribute("disabled", "true");

  const errorDiv = document.getElementById("error-message");

  if (errorDiv.className!="right floated column right-margin sthi" && errorDiv.className!="right floated column right-margin sth"){
    errorDiv.setAttribute("class", "right floated column right-margin sth")
    const message = document.createElement("div");
    message.setAttribute("class", "ui warning message");
    message.innerText = "Once you finish editting you profile, you will be logged out."
    errorDiv.appendChild(message);
  }


  submitButton.innerText="Submit"

  const editQ = document.getElementById("editQ");
  editQ.setAttribute("class", "ui large underline header show left-margin")

  firstName.removeAttribute("disabled");
  lastName.removeAttribute("disabled");
  country.removeAttribute("disabled");
  stateDropdown.setAttribute("class", "ui selection dropdown");
  city.removeAttribute("disabled");
  genderDropdown.setAttribute("class", "ui selection dropdown");
  age.removeAttribute("disabled");
  classYear.removeAttribute("disabled");
  dormDropdown.setAttribute("class", "ui selection dropdown");
  major.removeAttribute("disabled");
  description.removeAttribute("disabled");
  facebook.removeAttribute("disabled");
  instagram.removeAttribute("disabled");
  kerberos.removeAttribute("disabled");
  altImageInput.removeAttribute("disabled");


}

function image(){

  get('/api/whoami', {}).then(user => {
    const imageDiv = document.getElementById("userImage");
    imageDiv.setAttribute("src", user.image);
  })

}

function setAltImage(){
  const altImageInput = document.getElementById("altImageInput")

  if (altImageInput.value){
    post('api/altImage', {"altImage": altImageInput.value}).then(a => {
      window.location.pathname = "/logout";
    });
  }

}

main();
image();
