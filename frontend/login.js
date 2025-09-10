document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".swap");
    const signup = document.querySelector("#signup");
    const login = document.querySelector("#login");

    let signUpMode = false

   
      btn.addEventListener("click", () => {
      if (signUpMode) {
      btn.textContent = "Already Have An Account? Log In->"
      login.classList.add('hidden')
      signup.classList.remove('hidden');
      signUpMode = false
      } else {
      btn.textContent = "Don't Have An Account? Sing Up->"
      login.classList.remove('hidden')
      signup.classList.add('hidden');
      signUpMode = true
      }
    })

    const lPassword = document.querySelector("#password")
    const lCredentials = document.querySelector("#email-or-username")
    const rPassword = document.querySelector("#r-password")
    const rEmail = document.querySelector("#r-email")
    const rUsername = document.querySelector("#r-username")
    const avatarUrl = document.querySelector("#r-avatar")
    const sBtn = document.querySelector("#sign-button")
    const lBtn = document.querySelector("#log-button")
    const lform = document.querySelector("#login")
    const sform = document.querySelector("#register")

  sform.addEventListener("submit",async (e) => {
      e.preventDefault()
      const username = rUsername.value;
      const password = rPassword.value;
      const email = rEmail.value;
      if(username.trim() === "" || password.length < 5 || email.trim() === "") return
      rUsername.value = "";
      rPassword.value = "";
      rEmail.value = "";
      const avatar = avatarUrl.value
      avatarUrl.value = "";

      try {
        const req = await fetch("/api/v2/user/register", {
          method: "POST",
          headers: {
          "Content-Type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            username,
            email,
            password,
            avatar
          })
        })

        if(req.status === 201) {
          const res = await req.json();
          console.log(res.data.username, res.data.email, res.message);

          setTimeout(() => {
            window.location.href = "/?loggedIn=true"
          }, 1000)
        }else if(req.status === 409) {
          console.log("password is too small, min length should be <5")
        } else if(req.status === 400) {
          console.log("username or email already exsist enter unique username or if already have account move to login page")
        } else {
          throw new Error("something went wrong")
        }
      } catch (error) {
        console.log(error);
        console.log("something went wrong while sending registration req")
      }
      
    })  
  lform.addEventListener("submit",async (e) => {
      e.preventDefault()
      const loginMethod = lCredentials.value;
      const password = lPassword.value;
      if(loginMethod.trim() === "" || password.length < 5) return
      lCredentials.value = "";
      lPassword.value = "";

      try {
        const req = await fetch("/api/v2/user/login", {
          method: "POST",
          headers: {
          "Content-Type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            loginMethod,
            password,
          })
        })

        if(req.status === 200) {
          const res = await req.json();
          console.log(res.data.username, res.data.email, res.message);

          setTimeout(() => {
            window.location.href = "/?loggedIn=true"
          }, 1000)
        }else if(req.status === 409) {
          console.log("Invalid password")
        } else if(req.status === 400) {
          console.log("username or email dont exsist please move to registartion page or enter correct Credentials")
        } else {
          throw new Error("something went wrong")
        }
      } catch (error) {
        console.log(error);
        console.log("something went wrong while sending registration req")
      }
      
    })  
})
