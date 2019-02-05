const express = require('express');
const connect = require('connect-ensure-login');

//models
const Question = require('../models/question');
const Answer = require('../models/answer');
const Compatibility = require('../models/compatibility');
const Users = require('../models/user');

const router = express.Router();

router.get('/compatibility', function(req, res) {
    Compatibility.findOne({users : {$all : [req.query.user1, req.query.user2]}}, function(err, compatibility) {
        
        if (compatibility===null || req.query.updatedQ1==="true" || req.query.updatedQ2==="true") {

            let sort_by = function(field, reverse, primer){

                let key = primer ? 
                    function(x) {return primer(x[field])} : 
                    function(x) {return x[field]};
             
                reverse = !reverse ? 1 : -1;
             
                return function (a, b) {
                    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                  } 
             }
            let user = req.query.user1;
            let other = req.query.user2;
            Answer.find({'user_id': user}, function(err, user_answers){
            }).then(user_answers => {
                Answer.find({'user_id': other}, function(err, other_answers){
                }).then((other_answers) => {
                    let totalImportanceUser = 0;
                    let totalImportanceOther = 0;
                    let scoreUser = 0;
                    let scoreOther = 0;
        
        
                    for (user_answer of user_answers){
                        totalImportanceUser += user_answer.preference
                    }
        
                    for (other_answer of other_answers){
                        totalImportanceOther += other_answer.preference
                    }
                    user_answers.sort(sort_by('parent_question',false, function(a){return a.toUpperCase()}));
                    other_answers.sort(sort_by('parent_question',false, function(a){return a.toUpperCase()}));
        
                    for (i=0; i<user_answers.length; i++){

                        if (user_answers[i].answer_value===other_answers[i].answer_value){
                            scoreUser += user_answers[i].preference/totalImportanceUser
                            scoreOther += other_answers[i].preference/totalImportanceOther
                        }
                        else {
                            scoreUser += user_answers[i].preference/totalImportanceUser*(1-user_answers[i].preference/5);
                            scoreOther += other_answers[i].preference/totalImportanceOther*(1-other_answers[i].preference/5);
                        }
                    }
        
                    let finalScore = (scoreUser+scoreOther)*50;

                        if (req.query.updatedQ1==="true" || req.query.updatedQ2==="true"){
                            Compatibility.findOne({users : {$all : [req.query.user1, req.query.user2]}}, function(err, compatibility) {
                                compatibility.score = finalScore;
                                compatibility.save();
                            })

                            Users.findOne({_id: req.query.user1}).then(user => {
                                user.updatedQ=false;
                                user.save();
                            });

                            Users.findOne({_id: req.query.user2}).then(user => {
                                user.updatedQ=false;
                                user.save();
                            });
                        }

                        else {
                            let compatibility = new Compatibility({
                                'users': [req.query.user1, req.query.user2],
                                'score': finalScore
                            });
                
                            compatibility.save();
                        }
                        
                        res.send({"score" : finalScore});
                })
            })

            req.query.user1.updatedQ===false;
            req.query.user2.updatedQ===false;

        }
        else {
            res.send({"score" : compatibility.score});
        }
    });
});

router.post('/altImage', function(req, res) {
    Users.findOne({_id: req.user._id}).then(user => {
        user.altImage = req.body.altImage;
        user.save();
        console.log("image changed");
        res.send({});
    });
});


router.get('/users', function(req, res) {
    Users.find({"info.gender": req.query.gender}).then(u => {
        res.send(u);
    });
});

router.get('/whoami', function(req, res) {
    if (req.isAuthenticated()){
        res.send(req.user)
    }
    else {
        res.send({});
    }
  });

router.post('/answers', function(req, res) {

    Answer.findOne({ user_id: req.body.user, parent_question: req.body.question }).then(answer => {
        if (answer){
            answer.answer = req.body.response;
            answer.answer_value = req.body.answer_value;
            answer.preference = req.body.importance;
            console.log("Answer updated");
            answer.save();

            Users.findOne({ _id: req.user._id }).then(user => {
                user.updatedQ=true;
                user.save();
            })  

        }
        else {

            let answer = new Answer({
                'user_id':req.body.user,
                'parent_question': req.body.question,
                'answer': req.body.response,
                'answer_value': req.body.answer_value,
                'preference': req.body.importance
            });
            answer.save();
            console.log("new answer created");

        }
    })  

    res.send({});
});

router.get('/answers', function(req, res) {
    if (req.query.user) {
        if (req.query.parent_question){
            Answer.find({'user_id': req.query.user, 'parent_question': req.query.parent_question}, function(err, answers) {
                res.send(answers);
            });
        }
        else {
            Answer.find({'user_id': req.query.user}, function(err, answers) {
                res.send(answers);
            });
        }
    }
    else {
        Answer.find({}, function(err, answers) {
            res.send(answers);
        });
    }
});

router.get('/questions', function(req, res) {
    Question.find({}, function(err, questions) {
        res.send(questions);
    });
});

router.get('/user', function(req, res) {
    Users.findOne({ _id: req.query._id }).then(user => {
        if (user){
            res.send(user);
        }
        else {
            console.log("no user found")
            res.send({})
        }
    });
});

router.post('/completed_form', function(req,res) {
    Users.findOne({ _id: req.user._id }).then(user => {
        user.completed_form = true;
        user.save();
        res.send({});
    }).catch(err => {
        console.log(err);
    });
})


router.post('/submitProfile', function(req, res) {
    Users.findOne({ _id: req.user._id }).then(user => {
        user.info = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "country": req.body.country,
            "state": req.body.state,
            "city": req.body.city,
            "gender": req.body.gender,
            "age": req.body.age,
            "classYear": req.body.classYear,
            "dorm": req.body.dorm,
            "major": req.body.major,
            "description": req.body.description,
            "facebook": req.body.facebook,
            "instagram": req.body.instagram,
            "kerberos": req.body.kerberos
        }
        console.log("success")
        user.save()
    });
    res.send({})
});


module.exports = router;