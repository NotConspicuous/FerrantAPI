// use document.cookie.token to get github profile using fetch
let token = document.cookie.token

// get information about user using token at api @github/user
// https://developer.github.com/v3/users/#get-the-authenticated-user
fetch("/@github/user").then(res => res.json()).then(json => {
    if(json.statusCode === 401) {
        // if token is invalid, delete token from cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // redirect to /
        document.getElementById("not_logged_in").style.display = "flex";
        if (window.location.pathname !== "/") {
            window.location.href = "/"
        }
    } else {
        // if token is valid, set user to json
        user = json
        console.log(user)
        document.getElementById("logged_in").style.display = "flex";
        document.getElementById("avatar").src = user.avatar_url
    }
    document.getElementById("logged_in_skeleton").style.display = "none";
})