get('/api/whoami', {}).then(user => {
    if(!user._id) {
        window.location.pathname = '/';
    }
});

function createQuestionDOMObject(questionNumber, question, answerArr) {
   
    const row = document.createElement('div');
    row.setAttribute('class', 'row');

    const column1 = document.createElement('div');
    column1.setAttribute('class', 'column');

    const form1 = document.createElement('div');
    form1.setAttribute('class', 'ui form');

    const groupedFields1 = document.createElement('div');
    groupedFields1.setAttribute('class', 'grouped fields');

    const questionText = document.createElement('label'); // Intended to render "1. What time do you go to sleep"
    questionText.innerText = "" + questionNumber + ". " + question;
    groupedFields1.appendChild(questionText);



    for(let i = 0; i < answerArr.length; i++) {
        // trying to make <label for="something">Something</label>
        // <input type="radio" name="questionName" value="something"></input>

        const field = document.createElement('div');
        field.setAttribute('class', 'field');

        const radioBox = document.createElement('div');
        radioBox.setAttribute('class', 'ui checkbox');

        let answerCheckbox = document.createElement('input');
        answerCheckbox.setAttribute('type', 'radio');
        answerCheckbox.setAttribute('required', 'true');
        answerCheckbox.setAttribute('name', question);
        answerCheckbox.setAttribute('id', question+i);
        answerCheckbox.setAttribute('class', "hidden");
        answerCheckbox.setAttribute('value', i+1);
        answerCheckbox.setAttribute('response', answerArr[i]);


        let answerLabel = document.createElement('label');
        answerLabel.setAttribute('for', question+i);
        answerLabel.innerText = answerArr[i];

        radioBox.appendChild(answerCheckbox); 
        radioBox.appendChild(answerLabel);
        field.appendChild(radioBox);
        groupedFields1.appendChild(field);

    }


    form1.appendChild(groupedFields1);
    column1.appendChild(form1);
    row.appendChild(column1);


    const column2 = document.createElement('div');
    column2.setAttribute('class', 'column');

    const form2 = document.createElement('div');
    form2.setAttribute('class', 'ui form');

    const field = document.createElement('div');
    field.setAttribute('class', 'field');


    const importanceLabel = document.createElement('label');
    importanceLabel.innerText = "How important is this question to you?";
    field.appendChild(importanceLabel);

    const dropdown = document.createElement('div');
    dropdown.setAttribute('class', 'ui selection dropdown');
    dropdown.setAttribute('tabindex', 0);

    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('class', 'ui input focus');
    dropdown.appendChild(input);

    const icon = document.createElement('i');
    icon.setAttribute('class', 'dropdown icon');
    dropdown.appendChild(icon);

    const def = document.createElement('div');
    def.setAttribute('class', 'default text');
    def.innerText = "Importance";
    dropdown.appendChild(def);

    const menu = document.createElement('div');
    menu.setAttribute('class', 'menu');
    menu.setAttribute('tabindex', -1);

    const importanceArray = ["I don't care at all","Not very important","Somewhat important","Very important", "Crucially important"]

    for(let i = 0; i < 5; i++) {

        let option = document.createElement('div');
        option.setAttribute('class', 'item');
        option.innerText = importanceArray[i];
        option.setAttribute('name', 'importance' + questionNumber);
        option.setAttribute('data-value', i+1);
        option.setAttribute('value', i+1);

        menu.appendChild(option);

    }
    
    dropdown.appendChild(menu);
    field.appendChild(dropdown);
    form2.appendChild(field);
    column2.appendChild(form2);
    row.appendChild(column2);

    $(function() {
        $('.ui.dropdown').dropdown();
    });
    
    return row;
}

const formContainer = document.getElementById('startDiv');

get('/api/questions', {}).then(questionsArr => {

    for (i=0; i<questionsArr.length; i++){
        formContainer.appendChild(createQuestionDOMObject(i+1, questionsArr[i].question, questionsArr[i].answers));
    }

    const row1 = document.createElement('div');
    row1.setAttribute('class','row');

    const column = document.createElement('div');
    column.setAttribute('class','column sixteen wide center aligned');


    const popup = document.createElement('div');
    popup.setAttribute('class','hiddenMessage');
    popup.setAttribute('id','popup');

    column.appendChild(popup);
    row1.appendChild(column);

    //
    const row3 = document.createElement('div');
    row3.setAttribute('class','row');

    const column3 = document.createElement('div');
    column3.setAttribute('class','sixteen wide column');

    const message = document.createElement('div');
    message.setAttribute('class','ui info message');

    const header = document.createElement('header');
    header.setAttribute("class", "center");
    header.innerText = "Once you submit the questionnaire, you will be redirected to the homepage :)"

    message.appendChild(header);
    column3.appendChild(message);
    row3.appendChild(column3);

    //

    const row2 = document.createElement('div');
    row2.setAttribute('class','row');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('id','submit-btn');
    submitButton.setAttribute('class','ui large right floated button primary active');
    submitButton.innerHTML = "Submit";
    submitButton.addEventListener('click', popupToggle);

    row2.appendChild(submitButton);
    formContainer.appendChild(row1);
    formContainer.appendChild(row3);
    formContainer.appendChild(row2);
});
