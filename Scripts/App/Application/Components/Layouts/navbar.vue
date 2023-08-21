<template>
  <div>
    <nav class="navbar">
      <div class="navbar-content">
        <a class="navbar-brand" href="#">
          <img
            :src="baseUrl + 'Content/Images/Logo/logo_mangocsm.png'"
            alt="Your Logo"
          />
        </a>
        <ul class="navbar-nav ml">
          <li class="nav-item"><a class="nav-link" href="#">แจ้งซ่อม</a></li>
          <li class="nav-item"><a class="nav-link" href="#">ติดตามสถานะ</a></li>
          <li class="nav-item">
            <a
              class="nav-link butLog"
              href="#"
              data-toggle="modal"
              data-target="#myModal"
              >เข้าสู่ระบบ</a
            >
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl,
    };
  },
  // ... ส่วนอื่น ๆ ...
};
</script>

<style lang="scss" scoped>
/* Reset some default styles */

/* Reset some default styles */

body,
h1 {
  color: rgba(255, 255, 255, 0.6);
  font-family: Prompt;
  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  
}

h2,
ul,
li {
  margin: 0;
  padding: 0;
}
/* Apply responsive design */

nav ul {
  text-align: center;
  list-style: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
}

nav ul li a {
  color: #000000;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
}

main {
  padding: 1em;
}

section {
  background-color: #2c2929;
  padding: 1em;

  border-radius: 5px;
}

footer {
  background-color: #35424a;
  color: #fff;
  text-align: center;
  padding: 1em;
}

.content {
  padding-top: 10%;
  color: rgb(159, 165, 165);
  margin-left: 20%;
}

.fontt {
  color: #fff;
  font-family: "Prompt";
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.fonttt {
  color: #fff;
  font-family: "Prompt";
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.font {
  color: rgba(255, 255, 255, 0.6);
  font-family: "Prompt";
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.button {
  background-color: #f3fbff;
  color: #fff;
  border: #fff;
}

.navbar {
  /* Set the background color */
  padding: 25px 0; /* Add padding to the top and bottom */
  transition: background-color 0.3s;
  margin: 0;

  
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 188px; /* Center the content horizontally */
   /* Add padding to the sides */
}


.navbar-brand-logo img {
  max-width: 100px;
}

.navbar-nav {
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-right: 20px; /* Add margin between nav items */
}

.nav-link {
  text-decoration: none;
  color: #e3e3e3;
  text-align: center;
 
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  font-size: 16px;
}
.navbar-brand img {
    max-height: 73px; 
    max-width: 90%;
    padding: 10 0 0 0;
    margin-top: -25px;
  }

/* Style for the login button */
.login-button {
  background-color: #f3fbff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

/* ตั้งค่าให้ปุ่ม Navbar ชิดขวา */

.ml-auto {
  margin-left: 50% !important;
}

.circular-image {
  max-width: 100px;
  border-radius: 20%;
}

li a:hover {
  background-color: #00bf9d;
  border-radius: 12rem;
}

/* ส่วนของการแบ่งพื้นหลังเป็นสองส่วน */
</style>
