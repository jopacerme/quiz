var models = require('../models');





exports.index = function(req, res, next){
	models
	.Quiz
	.findAll()
	.then(function(quizzes){
		res.render('quizzes/index.ejs', { quizzes: quizzes});
	})
	.catch(function(error) {next(error);});
};


//GET /question
exports.show = function(req, res, next) {
	models
	.Quiz
	.findById(req.params.quizId) 
	.then(function(quiz){
		if(quiz){
			var answer = req.query.answer || '';
			res.render('quizzes/show', {quiz: quiz, answer: answer});
		} else {
			throw new Error('No hay preguntas en la BBDD');
		}
	}).catch(function(error) {next(error); });
};

//GET /check
exports.check = function(req, res) {
	models
	.Quiz
	.findById(req.params.quizId) 
	.then(function(quiz){
		if(quiz){
			var answer = req.query.answer || '';
			var result = answer === quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizzes/result', {quiz: quiz, result: result, answer: answer});
		} else {
			throw new Error('No hay preguntas en la BBDD');
		}
	}).catch(function(error) {next(error); });
};


//GET /credits
exports.credits = function(req, res, next) {
	res.render('quizzes/credits');
};
