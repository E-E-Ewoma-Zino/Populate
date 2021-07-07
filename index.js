const express = require("express");
const Category = require("./category");
const sort = require("./sort");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {

	Category.find({}).exec((err, cat) => {
		if (err) {
			res.send(err);
		}
		else {
			res.send(cat);
		}
	});
});

app.post("/", (req, res) => {
	// console.log(req.body);

	const newCategory = new Category({
		name: req.body.name,
		product: req.body.product,
		parents: req.body.parent
	});

	console.log(newCategory.parents);
	// if newCategory has a parent then it should:
	// 1. be a child of the parent
	// 2. contain all the parents from father to 4-fathers
	if (newCategory.parents.length) {
		console.log("It has a parent");
		newChild(newCategory);
		// 
		newParent(newCategory, () => {
			res.send("Saved " + newCategory);
		});
	} else {
		console.log("It has No parent");
		newCategory.save((err) => {
			if (err) {
				console.log(err);
			}
			else {
				res.send("Saved " + newCategory);
			}
		});
	}

});

app.post("/parent", (req, res) => {

	console.log("Searching...");

	Category.findById({ _id: req.body.id }).populate({ path: "parents" }).exec((err, result) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log(result);
			res.send(result);
		}
	});
});

// Get sorted array of items
app.get("/sort", (req, res) => {
	sort((err, adam) => {
		if (err) {
			res.send(err);
		}
		else {

			res.send(adam.map(child=> child));
		}
	});
});

// finds and add a child's id to the parent
function newChild(child) {
	Category.findById({ _id: child.parents }).exec((err, parent) => {
		if (err) {
			console.log(err);
		}
		else {
			parent.children.push(child);
			parent.save();
		}
	});
};

// finds and add all the parents to the child
function newParent(child, cb) {
	Category.findById({ _id: child.parents }).exec((err, parent) => {
		if (err) {
			console.log(err);
		}
		else {
			if (parent.parents.length) {
				console.log("Has Parent", parent.parents);
				child.parents = [child.parents, ...parent.parents];
				console.log("New", child.parents);
			}
			else {
				console.log("No Parent");
			}
		}
		// console.log("New", newCategory.parent);
		child.save((err) => {
			if (err) {
				console.log(err);
			}
			else {

				cb(null);
			}
		});
	});
};


// finds all the parents of a child
// using recorsion to loop through all the parents then add them to the arr
let parents = [];
async function getParent(id, cb) {

	const i = await Category.findById({ _id: id }).exec((err, child) => {
		if (err) {
			console.log(err);
		} else {
			// console.log("found", child);
			if (child.parent) {
				console.log("Has parent");
				getParent(child.parents, (u) => {
					console.log("i am u", u);
					parents.push(child.parent);
					console.log("This is my parents", parents);
				});
				// return "Stoped";

			} else {
				console.log("No parent ???????????");
				// return new Promise((resolve, reject) => {
				//     resolve(parents);

				//     reject("qwertz");
				// });
			}
		}
	});
	cb(child);
}

app.listen(3030, () => console.log("started on port 3030"));