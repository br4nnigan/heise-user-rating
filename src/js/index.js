import Static from "Static.js";

class App {

	constructor () {

		this.log("constructor");

		this.STORAGE_KEY = "heise-user-rating";
		this.state = {};
		this.userBars = null;
		this.debug = 1;

		this.initialize();
	}

	log () {

		if (this.debug) {
			var a = Array.from(arguments);
				a.splice(0, 0, "heise-user-rating");
			console.log.apply(this, a);
		}
	}

	initialize() {

		this.log("initialize", localStorage.getItem(this.STORAGE_KEY));

		// add event listeners
		const btnRating = document.querySelectorAll(".rating_post");
		for (var i = 0; i < btnRating.length; i++) {
			if (getComputedStyle(btnRating[i]).backgroundColor == "rgb(255, 255, 255)" ){ // not :visited
				btnRating[i].addEventListener("click", this.onBtnRatingClick.bind(this));
			}
		}

		this.userBars = document.querySelectorAll(".forum_userbar--author");

		const storage = localStorage.getItem(this.STORAGE_KEY);
		if (storage) {
			this.state = JSON.parse(storage);
			this.onStateChange();
		}
	}


	onBtnRatingClick( event ) {

		this.log("onBtnRatingClick");
		const elBtn = event.target;
		const elBtnWrapper = Static.dom.closest(elBtn, ".rating_buttons_wrapper");
		if (elBtnWrapper) {

			const elPosting = elBtnWrapper.previousElementSibling;
			if (elPosting && elPosting.getAttribute("data-posting-version") !== null) {

				const elUser = elPosting.querySelector(".full_user_string .pseudonym");
				if (elUser) {

					if (elBtn.classList.contains("positive")) {
						this.rateUser( elUser.textContent, 1 );
					}
					else if (elBtn.classList.contains("negative")) {
						this.rateUser( elUser.textContent, -1 );
					}
				}
			}
		}
	}

	rateUser( user, rating ) {

		this.log("rateUser", user, rating, this.state);

		if (!this.state[user]) {
			this.state[user] = 6; // neutral rating
		}
		this.state[user] += rating;
		this.state[user] = Math.max(this.state[user], 1);
		this.state[user] = Math.min(this.state[user], 11);

		this.onStateChange();
	}

	onStateChange( ) {

		this.log("onStateChange", this.state);

		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));

		this.render();
	}

	render() {

		this.log("render");

		Static.each(this.userBars, elUserBar => {
			const elUser = elUserBar.querySelector(".pseudonym");
			if (elUser) {

				const userName = elUser.textContent;
				const userRating = this.state[userName];

				this.log("render userName && userRating", userName ,userRating);

				if (userName && userRating) {

					let elUserRatingImg = elUser.querySelector("rating img");
					if (!elUserRatingImg) {

						const elUserRating = document.createElement("li");
							  elUserRating.classList.add("rating");
						elUserRatingImg = document.createElement("img");
						elUserRatingImg.style.float = "none";
						elUserRatingImg.style.verticalAlign = "baseline";
						elUserRatingImg.style.marginLeft = ".5em";
						elUserRating.appendChild(elUserRatingImg);
						elUserBar.appendChild(elUserRating);
					}
					elUserRatingImg.setAttribute("src", "/icons/forum/wertung_" + userRating + ".gif");
				}
			}
		});
	}
}

export default new App();

