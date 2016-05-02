var path = require('path');

var Sequelize = require('sequelize');

var url, storage;

if(!process.env.DATABASE_URL)	{
	url = 'sqlite:///';
	storage = 'quiz.sqlite';
} else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || '';
}


var sequelize = new Sequelize(url, 
							{ storage: storage, 
								omitNull: true});

//Importar la definicion de la tabla Quize quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

sequelize
.sync()
.then(function(){
	return Quiz
			.count()
			.then(function(c){
				if(c === 0){
					return Quiz
							.bulkCreate([ {question: 'Capital de Italia',   answer: 'Roma'},
										{question: 'Capital de Portugal', answer: 'Lisboa'}
								])
							.then(function(){
								console.log('Base de datos inicializada con datos');
							});
				}
			})
}).catch(function(error){
	console.log('Error sincronizando la base de datos:', error);
	process.exit(1);
});

exports.Quiz = Quiz;