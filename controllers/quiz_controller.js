var models = require('../models');
var Sequelize = require('sequelize');



exports.load = function(req, res, next, quizId) {
	models
	.Quiz
	.findById(quizId, { include: [ models.Comment ] }) 
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
	}
	if (req.params.format === 'json') {
	 	models
		.Quiz
		.findAll()
		.then(function(quizzes){
			res.json('quizzes/index.ejs', { quizzes: quizzes});
		})
		.catch(function(error) {next(error);});
	}
	else {
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
	if (req.params.format === 'json') {
		models
		.Quiz
		.findById(req.params.quizId) 
		.then(function(quiz){
			if(quiz){
				var answer = req.query.answer || '';
				res.json('quizzes/show', {quiz: req.quiz, answer: answer});
			} else {
				throw new Error('No hay preguntas en la BBDD');
			}
		}).catch(function(error) {next(error); });
	}else{
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
	}
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

//GET /quizzes/:id/edit
exports.edit = function(req, res, next) {
	var quiz = req.quiz;
	res.render('quizzes/edit', {quiz: quiz});
};

//PUT /quizzes/:id
exports.update = function (req, res, next){
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;

	req.quiz.save({fields: ['question', 'answer']})
		.then(function (quiz) {
			req.flash('success', 'Quiz editado con éxito.');
				res.redirect('/quizzes');
		})
		.catch(Sequelize.ValidationError, function (error) {
			req.flash('error', 'Errores en el formulario:');
			for (var i in error.errors) {
				req.flash('error', error.errors[i].value);
			};
			res.render('quizzes/edit', {quiz: req.quiz});
		})
		.catch(function (error){
			req.flash('error', 'Error al editar el Quiz: ' +error.message);
			next(error);
		});
};

//POST /quizzes/create
exports.create = function(req, res, next){
	var quiz = models.Quiz.build({ question: req.body.quiz.question,
									answer: req.body.quiz.answer});
	//guarda en DB los campos pregunta y respueta de quiz
	quiz.save({fields: ['question', 'answer']})
		.then(function (quiz) {
			req.flash('success', 'Quiz creado con exito.');
			res.redirect('/quizzes');
		})
		.catch(Sequelize.ValidationError, function(error){
			req.flash('error', 'Errores en el formulario:');
			for (var i in error.errors){
				req.flash('error', error.errors[i].value);
			};
			res.render('quizzes/new', {quiz: quiz});
		})
		.catch(function (error){
			req.flash('error', 'Error al crear un Quiz: ' +error.message);
			next(error);
		});
};

//DELETE /quizzes/:id
exports.destroy = function (req, res, next){
	req.quiz.destroy()
		.then( function(){
			req.flash('success', 'Quiz borrado con éxito.');
			res.redirect('/quizzes');
		})
		.catch(function(error){
			req.flas('error', 'Error al editar el QUIZ: ' +error.message);
			next(error);
		});
};

//GET /credits
exports.credits = function(req, res, next) {
	res.render('quizzes/credits');
};


