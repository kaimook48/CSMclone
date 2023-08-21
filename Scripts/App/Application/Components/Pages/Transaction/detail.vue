<template>
    <div>
      <div class="bg1">
        <navbarD> </navbarD>
        <div class="bg-section">
          <div class="fix">
            <p>แจ้งซ่อม</p>
  
            <form class="form-inline">
              <span>
                <input
                  class="form-control mr-lg-2"
                  type="search"
                  placeholder="search"
                  aria-label="Search"
                  style="border-radius: 30rem; width: 442px; height: 40px"
                />
              </span>
            </form>
          </div>
        </div>
      </div>
  
      <div class="text-section">
        <!-- เนื้อหาส่วนล่าง โดยใส่เนื้อหาตามที่คุณต้องการแสดง -->
        <div class="container mt-5" style="padding: 2%">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card">
                <img
                  :src="`${baseUrl}Content/Images/PNG/buu.jpg`"
                  class="card-img"
                  alt="Card Image 1"
                  style="width: 100%; height: 200px"
                />
                
                <div class="card-body text-center">
                  <a
                    href="#"
                    class="btn btn-light btn-overlay"
                    style="white-space: nowrap"
                    >แจ้งซ่อม</a
                  >
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card" >
                <img
                  :src="`${baseUrl}Content/Images/PNG/buu.jpg`"
                  class="card-img"
                  alt="Card Image 1"
                  style="width: 100%; height: 200px"
                />
                <div class="card-body text-center">
                  <a
                    href="#"
                    class="btn btn-light btn-overlay"
                    style="white-space: nowrap"
                    >แจ้งซ่อม</a
                  >
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card" >
                <img
                  :src="`${baseUrl}Content/Images/PNG/buu.jpg`"
                  class="card-img"
                  alt="Card Image 1"
                  style="width: 100%; height: 200px"
                />
                <div class="card-body text-center">
                    
                  <a
                    href="#"
                    class="btn btn-light btn-overlay"
                    style="white-space: nowrap"
                    >แจ้งซ่อม</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<script>
import { computed, nextTick, onMounted, reactive, ref } from "vue";
export default {
  components: {},
  setup(props, ctx) {
    let baseUrl = computed(() => window.baseUrl);

    const state = reactive({
      contentImage: baseUrl.value + "Content/Images/PNG/bg2.jpg",
      Imagetest: baseUrl.value + "Content/Images/PNG/buu.jpg",
    });

    onMounted(async () => {
      $(".bg1").css({
        "background-image": `url(${state.contentImage})`,

        "background-repeat": "no-repeat",

        "background-size": "cover",

        width: "100%",
        height: "35%",
      });

      $(".text-section").css({
        "background-color": "#F3F3F3",

        "background-repeat": "no-repeat",

        "background-size": "cover",

        width: "100%",
        height: "700px",
      });
    });

    return {
      baseUrl,
      state,
    };
  },
};
</script>

<style lang="scss" scoped>
.bg-section {
  background-size: cover;
  color: #fff;
  text-align: center;
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  
 
  height: 355px;
  /* ทำให้เต็มหน้าจอตลอด */
  margin-top: -80px; /* เพิ่มค่า margin-top เพื่อให้เนื้อหาอยู่ใต้ Navbar */
  color: #fff;
 
  font-size: 48px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.card-img-container {
    position: relative;
    overflow: hidden;
  }
  .btn-overlay {
    position: absolute;
    bottom: 8px;
    left: 82%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.7); /* ใช้ rgba ให้โปร่งแสง */
    padding: 10px 20px;
    border-radius: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* เพิ่มเงาให้ดูโปร่งแสง */
    transition: background-color 0.3s;
    
  }
  .btn-overlay:hover {
    background-color: rgba(255, 255, 255, 0.9); /* ปรับสีเมื่อโฮเวอร์ */
  }

.text-section {
  /* สีพื้นหลังส่วนล่าง */
  color: black;
  /* สีข้อความ */
  text-align: center;
  padding: 1;
}

.content {
  padding-top: 10%;
  color: rgb(159, 165, 165);
  margin-left: 20%;
}

.h4 {
  color: #fff;
}

.h7 {
  color: #fff;
}

.button {
  background-color: #f3fbff;
  color: #fff;
  border: #fff;
}

.navbar {
  justify-content: flex-end;
  padding: 15px;
  height: 80px;
  transition: background-color 0.3s;
}

.navbar-nav {
  display: flex;
  align-items: center;
  margin-left: 60% !important;
  white-space: nowrap;
}

.nav-link {
  margin-right: auto;
  padding: 0.5rem auto;
}

.nav-link:hover {
  color: #f0a500;
  text-decoration: underline;
}

.navbar-brand img {
  max-height: 70%;
  /* ขนาดสูงมากสุดของโลโก้คือ 100% ของพื้นที่ใน Navbar */
  width: auto;
  /* ปรับความกว้างของโลโก้อัตโนมัติ */
  margin-top: 0;
}

li :hover {
  background-color: #00bf9d;
  border-radius: 24rem;
}
.navbar-brand {
  color: #fff; /* กำหนดสีของลิงก์ */
  text-decoration: none; /* ลบเส้นใต้ลิงก์ */
  transition: color 0.3s; /* เพิ่มเอฟเฟกต์เมื่อ hover */
}

.navbar-brand:hover {
  color: #fff; /* กำหนดสีของลิงก์เมื่อ hover */
  /* เพิ่มเอฟเฟกต์อื่น ๆ ที่คุณต้องการ */
}
.fix {
  margin-top: 10%;
}
</style>
