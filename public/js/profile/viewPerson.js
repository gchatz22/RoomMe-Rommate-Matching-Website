function main() {
    const profileId = window.location.search.substring(1);
    get('/api/whoami', {}).then(current_user => {
        if(!current_user._id) {
            window.location.pathname = '/'
        }
        else {
            get('/api/user', {"_id": profileId}).then(profileUser => {
                renderUserData(profileUser, current_user);
            });
            renderNavbar(current_user);
        }
    });
}

function renderUserData(user, current_user) {

    const start = document.getElementById("start");

    const grid = document.createElement("div");
    grid.setAttribute("class","ui three column grid");

    const row = document.createElement("div");
    row.setAttribute("class","row");


    // Image
    const columnImage = document.createElement("div");
    columnImage.setAttribute("class","four wide column left-margin padding-right padding-left");

    const image = document.createElement("img");
    image.setAttribute("src", user.image);
    image.setAttribute("id", "userImage");

    const mediaDiv = document.createElement("div");
    mediaDiv.setAttribute("class", "right floated column right-margin");

    const hrefFa = document.createElement("a");
    hrefFa.setAttribute("class", "left-margin-media");
    hrefFa.setAttribute("href", user.info.facebook);
    hrefFa.setAttribute("target", "_blank");

    const buttonFa = document.createElement("button");
    buttonFa.setAttribute("class", "ui facebook button left-margin-icons top-margin");
    buttonFa.innerHTML = "<i class='facebook icon'></i>Facebook"
    hrefFa.appendChild(buttonFa);


    const hrefInsta = document.createElement("a");
    hrefInsta.setAttribute("class", "left-margin-media");
    hrefInsta.setAttribute("href", user.info.instagram);
    hrefInsta.setAttribute("target", "_blank");

    const buttonInsta = document.createElement("button");
    buttonInsta.setAttribute("class", "ui instagram button top-margin left-margin-icons");
    buttonInsta.innerHTML = "<i class='instagram icon'></i>Instagram"
    hrefInsta.appendChild(buttonInsta);

    mediaDiv.appendChild(hrefFa);
    mediaDiv.appendChild(hrefInsta);

    columnImage.appendChild(image);
    columnImage.appendChild(mediaDiv);
    row.appendChild(columnImage);


    // Content
    const columnContent = document.createElement("div");
    columnContent.setAttribute("class","eight wide column vline");

    const name = document.createElement("div");
    name.setAttribute("class","ui dividing huge header margin-bottom center aligned");
    name.innerText = user.info.firstName + " " + user.info.lastName;
    columnContent.appendChild(name);

    const gridContent = document.createElement("div");
    gridContent.setAttribute("class", "ui padding-left two column grid");

    const row1 = document.createElement("div");
    row1.setAttribute("class", "row");

    const column1 = document.createElement("div");
    column1.setAttribute("class", "eight wide column");

    rowContent = document.createElement("div");
    rowContent.setAttribute("class", "row top-margin-special");
    rowContent.innerHTML = "<b>Age:</b> "+user.info.age;
    column1.appendChild(rowContent);

    rowContent1 = document.createElement("div");
    rowContent1.setAttribute("class", "row top-margin-content");
    rowContent1.innerHTML = "<b>Class:</b> "+user.info.classYear;
    column1.appendChild(rowContent1);

    rowContent3 = document.createElement("div");
    rowContent3.setAttribute("class", "row top-margin-content");
    rowContent3.innerHTML = "<b>Country:</b> "+user.info.country;
    column1.appendChild(rowContent3);

    rowContent4 = document.createElement("div");
    rowContent4.setAttribute("class", "row top-margin-content");
    if (user.info.state==="International"){
        rowContent4.innerHTML = "<b>State:</b> None ("+user.info.state+")";
    }
    else {
        rowContent4.innerHTML = "<b>State:</b> "+user.info.state;
    }
    column1.appendChild(rowContent4);

    rowContent5 = document.createElement("div");
    rowContent5.setAttribute("class", "row top-margin-content");
    rowContent5.innerHTML = "<b>City:</b> "+user.info.city;
    column1.appendChild(rowContent5);

    const column2 = document.createElement("div");
    column2.setAttribute("class", "eight wide column");

    if (user.info.dorm){
        rowContent6 = document.createElement("div");
        rowContent6.setAttribute("class", "row top-margin-special padding-right");
        rowContent6.innerHTML = "<b>Preffered Dorm:</b> "+user.info.dorm;
        column2.appendChild(rowContent6);
    }

    if (user.info.major){
        rowContent7 = document.createElement("div");
        rowContent7.setAttribute("class", "row  top-margin-content padding-right");
        rowContent7.innerHTML = "<b>Anticipated Major:</b> "+user.info.major;
        column2.appendChild(rowContent7);
    }


    if (user.info.kerberos){
        rowContent8 = document.createElement("div");
        rowContent8.setAttribute("class", "row top-margin-content padding-right");
        rowContent8.innerHTML = "<b>Kerberos:</b> "+user.info.kerberos;
        column2.appendChild(rowContent8);
    }

    if (user.info.description){
        rowContent8 = document.createElement("div");
        rowContent8.setAttribute("class", "row top-margin-content padding-right-content");
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
    
    if(current_user._id!==user._id) {
        get('api/compatibility', {"user1": current_user._id, "user2": user._id}).then(score => {

            const match = document.createElement("div");
            match.setAttribute("class","ui dividing large padding-top header margin-bottom center aligned");
            match.innerText = "Match";
            columnCompat.appendChild(match);


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

        });
    }


    grid.appendChild(row);

    // Questionnaire Icon

    const rowIcon = document.createElement("div");
    
    const columnIcon = document.createElement("div");
    columnIcon.setAttribute("class", "column");

    const header = document.createElement("div");
    header.setAttribute("class", "ui huge header margin-q");

    const icon = document.createElement("i");
    icon.setAttribute("class", "question circle icon");
    header.appendChild(icon);

    const content = document.createElement("div");
    content.setAttribute("class", "content");
    if (user._id===current_user._id){
        content.innerHTML = "Questionnaire <div class='sub header'> Your responses </div> "
    }
    else {
        content.innerHTML = "Questionnaire <div class='sub header'> Responses of " + user.info.firstName + "</div> "
    }

    header.appendChild(content);
    columnIcon.appendChild(header);
    rowIcon.appendChild(columnIcon);
    grid.appendChild(rowIcon);

    // Questionnaire Content

    get('/api/answers', {"user": user._id}).then(answers => {
        let sort_by = function(field, reverse, primer){

            let key = primer ? 
                function(x) {return primer(x[field])} : 
                function(x) {return x[field]};
         
            reverse = !reverse ? 1 : -1;
         
            return function (a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
              } 
        }

        answers.sort(sort_by('parent_question',false, function(a){return a.toUpperCase()}));
        for(let i = 0; i < answers.length; i++) {
            grid.appendChild(createResponseCard(answers[i],i));
        }
    });

    `   `
    start.appendChild(grid);
}

const importanceArray = ["I don't care at all","Not very important","Somewhat important","Very important", "Crucially important"]

function createResponseCard(question, number) {

    let qNumber = number + 1;
    let returnCard = document.createElement('div');
    returnCard.setAttribute('class','row');

    let questionArea = document.createElement('div');
    questionArea.setAttribute('class', 'seven wide column margin-left padding-bottom-q padding-top border padding-right center');
    questionArea.innerHTML = "<b>" + qNumber + ". " + question.parent_question + "</b>";

    let responseArea = document.createElement('div');
    responseArea.setAttribute('class','four wide padding-bottom-q column border padding-top-an center');
    responseArea.innerText = question.answer;

    let preferenceArea = document.createElement('div');
    preferenceArea.setAttribute('class','three wide column border padding-bottom-q padding-top-an padding-left-pref center');
    preferenceArea.innerText = importanceArray[question.preference-1];

    returnCard.appendChild(questionArea);
    returnCard.appendChild(responseArea);
    returnCard.appendChild(preferenceArea);

    return returnCard;
}




main()