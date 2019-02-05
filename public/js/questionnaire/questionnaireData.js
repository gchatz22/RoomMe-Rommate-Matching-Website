let guard;

function submitQuestionnaire() { 
    get('/api/whoami',{}).then(current_user => {
        get('/api/questions', {}).then(data => {

            for(let i = 0; i < data.length; i++) {
                let selectedAnswer = document.querySelector('input[name="' + data[i].question + '"]:checked')
                let selectedValue;
                let selectedResponse;
                let questionNumber;
                let importance;
                let importanceValue;

                try {
                    selectedValue = selectedAnswer.getAttribute("value");
                    selectedResponse = selectedAnswer.getAttribute("response");
                    questionNumber = i+1;   
                    importance = document.querySelector('.item.active.selected[name="importance' + questionNumber + '"]');
                    importanceValue = importance.getAttribute('value');
                }

                catch(error){
                    if (error instanceof TypeError){

                        if (popup.className==='show uncompleted' || popup.className==='show done uncompleted'){
                            break
                        }

                        else {
                            popup.setAttribute('class','show done uncompleted');
        
                            const message = document.createElement('div');
                            message.setAttribute('class','ui error message');
        
                            const header = document.createElement('header');
                            header.innerText = "You haven't answered all of the questions. Complete the questionnaire  for the error to disappear and submit again."
                            message.appendChild(header);
        
                            popup.appendChild(message);
                            guard=false;
                            break   
                        }
                    }
                }

                if (current_user._id){
                    post('/api/answers', {"user": current_user._id, "question": data[i].question, "answer_value": selectedValue, "response": selectedResponse, "importance": importanceValue});
                }
    
                if (i===data.length-1){
                    guard=true;
                }

            }

            if (guard===true){
                post('/api/completed_form',{}).then(r => {
                    window.location.pathname = '/logout';
                });
            }
        });

    });
    
}

function popupToggle(){

    let popup = document.getElementById("popup");

    get('/api/whoami',{}).then(current_user => {

        if (current_user.completed_form===true){

            if (popup.className==="show done" || popup.className==='show done uncompleted'){
                submitQuestionnaire();
            }

            else {
                popup.setAttribute('class','show done');
    
                const message = document.createElement('div');
                message.setAttribute('class','ui warning message');
    
                const header = document.createElement('header');
                header.innerText = "You have already submitted the questionnaire. If you want to update it, press again to submit :)"
                message.appendChild(header);
    
                popup.appendChild(message);
            }

        }

        else {
            submitQuestionnaire();
        }
    })


}
