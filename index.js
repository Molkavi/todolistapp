const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Connection to DB
mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
	console.log("Connected to DB!");

	app.listen(process.env.PORT || 3000, () => console.log("Server Up and running boye!"));
});

// View engine config
app.set("view engine", "ejs");
console.log("Engine set to ejs!");


// GET method
app.get("/", (req, res) => {
	TodoTask.find({}, (err, tasks) => {
		res.render("todo.ejs", { todoTasks: tasks });
		console.log("Tasks rendered!");
	});
});

// POST method
app.post('/',async (req, res) => {
	const todoTask = new TodoTask({
		content: req.body.content
	});

	try {
		await todoTask.save();
		res.redirect("/");
	} catch (err) {
		res.redirect("/");
	}
});

// UPDATE method
app.route("/edit/:id").get((req, res) => {
	const id = req.params.id;
	TodoTask.find({}, (err, tasks) => {
		res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
		console.log("Edit screen rendered!");
	});
}).post((req, res) => {
	const id = req.params.id;
	TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
		if (err) return res.send(500, err);
		res.redirect("/");
	});
});

// DELETE method
app.route("/remove/:id").get((req, res) => {
	const id = req.params.id;
	TodoTask.findByIdAndRemove(id, err => {
		if (err) return res.send(500, err);
		res.redirect("/");
	});
});