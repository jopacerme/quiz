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

// Importar la definición de la tabla de Comments de comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Importar la definición de la tabla de Users de usrs.js
var User = sequelize.import(path.join(__dirname, 'user'));

//Relaciones entre modelos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as:'Author', foreignKey: 'AuthorId'});

/*sequelize
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
});*/

exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;