import Static from "Static.js";

class App {

	constructor () {

		this.log("constructor");

		this.STORAGE_KEY = "heise-user-rating";
		this.CSS_CLASS = "user_rating";
		this.state = {};

		this.userbarUsers = null;
		this.threadlistUsers = null;

		this.debug = 0;

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

		this.userbarUsers = document.querySelectorAll(".author.userbar_list li .pseudonym, .author.userbar_list li .realname");
		this.threadlistUsers = document.querySelectorAll("#tree_thread_list .tree_thread_list--written_by_user");

		const storage = localStorage.getItem(this.STORAGE_KEY);
		if (storage) {
			this.state = JSON.parse(storage);
			this.onStateChange();
		}

		this.injectCss();
	}

	injectCss() {
		var style = document.createElement("style");
			style.setAttribute("rel", "stylesheet");
			style.innerHTML = `
		.tree_thread_list--time + .tree_thread_list--written_by_user{
			margin-right: 40px;
		}`;
		document.head.appendChild(style);
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

	createUserRatingElement( rating ) {

		const elUserRating = document.createElement("span");
		elUserRating.classList.add(this.CSS_CLASS);

		elUserRating.style.display = "inline";

		const elUserRatingImg = document.createElement("img");
		elUserRatingImg.style.float = "none";
		elUserRatingImg.style.verticalAlign = "baseline";
		elUserRatingImg.style.marginLeft = ".5em";
		elUserRatingImg.style.display = "inline-block";
		elUserRatingImg.setAttribute("src", "/icons/forum/wertung_" + rating + ".gif");

		if ( this.debug ) {
			elUserRatingImg.setAttribute("src", "Vielleicht könnte man ja mal anfangen... _ Forum - heise online_files/icons/forum/wertung_4.gif");
		}
		elUserRating.appendChild(elUserRatingImg);

		return elUserRating;
	}

	getUserRating ( userName ) {

		let userRating = this.state[userName];

		if ( this.debug && userName == "hgzi" ) userRating = 4;

		this.log("getUserRating", userName, userRating);

		return userRating;
	}

	render() {

		this.log("render");

		Static.each(this.threadlistUsers, elUser => {
		this.log("threadlistUsers");
			const hasUserRatingElement = !!elUser.getElementsByClassName(this.CSS_CLASS).length;

			this.log("threadlistUsers hasUserRatingElement", hasUserRatingElement);

			if (!hasUserRatingElement) {
				const userName = elUser.textContent.trim();
				const userRating = this.getUserRating(userName);

				this.log("render threadlistUsers userName && userRating", userName ,userRating);

				if (userRating) {

					const elUserRating = this.createUserRatingElement(userRating);
						elUserRating.classList.add("tree_thread_list--rating"); // needed for styling of user rating in thread list
					Static.dom.insertBefore(elUserRating, elUser);
				}
			}
		});

		Static.each(this.userbarUsers, elUser => {
			this.log("userbarUsers");

			const hasUserRatingElement = !!elUser.getElementsByClassName(this.CSS_CLASS).length;
			if (!hasUserRatingElement) {

				const userName = elUser.textContent;
				const userRating = this.getUserRating(userName);

				this.log("render userbarUsers userName && userRating", userName ,userRating);

				if (userRating) {

					const elUserRating = this.createUserRatingElement(userRating);
					elUser.parentNode.appendChild(elUserRating);
				}
			}
		});

	}
}

export default new App();

