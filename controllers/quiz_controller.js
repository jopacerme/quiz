var models = require('../models');



exports.load = function(req, res, next, quizId) {
	models
	.Quiz
	.findById(quizId) 
	.then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function(error) {next(error); });
};

//GET /quizzes/new
exports.new = function(req, res, next) {
	var quiz = models.Quiz.build({question: '', answer: ''});
	res.render('quizzes/new', {quiz: quiz});
};

exports.index = function(req, res, next){
	if (req.query.search){
		var busca = req.query.search.split(' ');
		busca = '%' + busca.join('%') + '%';
		models
		.Quiz
		.findAll({where: [ 'question like ?' ,  busca]})
		.then(function(quizzes){
			res.render('quizzes/index.ejs', { quizzes: quizzes});
		})
		.catch(function(error) {next(error);});
	} else {
		models
		.Quiz
		.findAll()
		.then(function(quizzes){
			res.render('quizzes/index.ejs', { quizzes: quizzes});
		})
		.catch(function(error) {next(error);});
	}
};


//GET /question
exports.show = function(req, res, next) {
	models
	.Quiz
	.findById(req.params.quizId) 
	.then(function(quiz){
		if(quiz){
			var answer = req.query.answer || '';
			res.render('quizzes/show', {quiz: req.quiz, answer: answer});
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
			var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizzes/result', {quiz: req.quiz, result: result, answer: answer});
		} else {
			throw new Error('No hay preguntas en la BBDD');
		}
	}).catch(function(error) {next(error); });
};

//POST /quizzes/create

exports.create = function(req, res, next){
	var quiz = models.Quiz.build({ question: req.body.quiz.question,
									answer: req.body.quiz.answer});
	//guarda en DB los campos pregunta y respueta de quiz
	quiz.save({fields: ['question', 'answer']})
		.then(function(quiz) {
			res.redirect('/quizzes');
		})
		.catch(function(error){
			next(error);
		});
};

//GET /credits
exports.credits = function(req, res, next) {
	res.render('quizzes/credits');
};
