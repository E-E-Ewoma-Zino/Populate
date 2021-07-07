// sort the items in the array
const Category = require("./category");


module.exports = function adams(cb) {
	Category.find({}).exec((err, adams) => {
		if (err) {
			console.log(err);
			cb(err, null);
		}
		else {
			// cb(null, sort(adams));
			populate(adams, (err, family) => {
				cb(null, sort(family));
			});

		}
	});
}

// sort aphabetically
function sort(arr) {
	let temp;
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr.length - 1; j++) {
			// console.log(arr.length, j, arr[j].name, arr[j + 1].name);
			if (arr[j].name > arr[j + 1].name) {
				temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			} else {
				// console.log("next");
			}
		}
	}

	return arr;
}

// populate all
function populate(list, cb) {
	let family = [];

	for (let i = 0; i < list.length; i++) {
		const parent = list[i];
		Category.findById({ _id: parent._id }).populate({ path: "parents", select: ["name"] }).exec((err, child) => {
			if (err) {
 			console.log(err);
				cb(err, null);
			} else {
				family.push(child);
				if (i == list.length - 1) {
					cb(null, family);
				}
			}
		});
	}
}
