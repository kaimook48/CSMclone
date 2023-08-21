<template>
  <div>
    <div class="bg5">
      <navbarD></navbarD>
      <div class="bg-section">
        <div class="fix">
          <div class="row">
            <div class="col-md-2" style="padding-left: 140px">
              <a href="#">
                <img
                  :src="`${baseUrl}Content/Images/Icon SVG/back.svg`"
                  width="50px"
                />
              </a>
            </div>
            <div class="col-md-8 text-center" style="padding-top: 15px">
              ใบแจ้งซ่อม
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab">
      <nav class="navbar">
        
        <div class="navbar-content" style="justify-content:space-between">
          <div class="">
            <a class="navbar-brand"  href="#">ข้อมูล</a>
            <a class="navbar-brand" href="#">รายการ</a>
            <!-- <div class="read" style="float:right"> -->
              <!-- </div> -->
            </div>
            <div>
              <a class="navbar-brand" href="#">ส่ง</a>
  
            </div>

          </div>

      </nav>
    </div>
    <div class="form1">
      <div class="container">
        <div class="card" style="margin-top: 25px">
          <div
            class="card-header"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px 20px 0 20px;
              font-size: 24px;
            "
          >
            ข้อมูล
            <div class="switch">
              <input
                type="checkbox"
                id="toggle"
                class="toggle-input"
                v-model="isSwitchOn"
              />
              <label for="toggle" class="toggle-label"></label>
            </div>
          </div>

          <div class="card-body" style="padding: 20px">
            <form>
              <div class="form-group">
                <label for="address">บ้านเลขที่</label>
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  placeholder="กรอกบ้านเลขที่"
                />
              </div>
              <div class="form-group">
                <label for="name">ชื่อ</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="กรอกชื่อ"
                />
              </div>
              <div class="form-group">
                <label for="phone">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  placeholder="กรอกเบอร์โทรศัพท์"
                />
              </div>
              <div class="form-group">
                <label for="date">วันที่สะดวก</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  placeholder="ระบุวันที่"
                />
              </div>
              <div class="form-group" style="display: flex">
                <input
                  type="time"
                  class="form-control"
                  id="start-time"
                  style="flex: 1"
                />
                <p style="margin: 10px 10px">
                  <img
                    :src="`${baseUrl}Content/Images/Icon SVG/vecter.svg`"
                    style="width: 8.778px; height: 7.9px; flex-shrink: 0"
                  />
                </p>
                <input
                  type="time"
                  class="form-control"
                  id="end-time"
                  style="flex: 1"
                />
              </div>
              <div class="form-group">
                <label for="date"
                  >วันที่สำรอง (กรณีที่วันหลักทีมช่างไม่ว่าง)</label
                >
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  placeholder="ระบุวันที่"
                />
              </div>
              <div class="form-group" style="display: flex">
                <input
                  type="time"
                  class="form-control"
                  id="start-time"
                  style="flex: 1"
                />
                <p style="margin: 10px 10px">
                  <img
                    :src="`${baseUrl}Content/Images/Icon SVG/vecter.svg`"
                    style="width: 8.778px; height: 7.9px; flex-shrink: 0"
                  />
                </p>
                <input
                  type="time"
                  class="form-control"
                  id="end-time"
                  style="flex: 1"
                />
              </div>
              <div class="form-group">
                <label for="additional-info">รายละเอียดเพิ่มเติม</label>
                <textarea
                  class="form-control"
                  id="additional-info"
                  rows="3"
                  placeholder="กรอกรายละเอียดเพิ่มเติม"
                ></textarea>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="form2">
      <div class="container">
        <div class="card" style="margin-top: 25px">
          <div
            class="card-header"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px 20px 0 20px;
              font-size: 24px;
            "
          >
        
            รายการ
            <button class="add-button" @click="addItem">+</button>
          </div>
          <div
            class="card-body"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 90px 90px 30px;
            "
          >
            <img
              :src="`${baseUrl}Content/Images/Icon SVG/fileD.svg`"
              style="width: 245.246px; height: 245.246px; flex-shrink: 0"
            />
          </div>
          <div class="image-description">เพิ่มรายการแจ้งซ่อมของคุณ</div>
          <div class="image-description">เพื่อแจ้งให้ช่างทราบ</div>
          <div class="bt-add">
            <button type="submit" class="btn btn-outline-light">
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";

export default {
  components: {},
  setup(props, ctx) {
    let baseUrl = computed(() => window.baseUrl);
    const isSwitchOn = ref(false);

    watch(isSwitchOn, (newValue) => {
      if (newValue) {
        console.log("Switch is ON");
        // ทำอะไรก็ตามที่คุณต้องการเมื่อ Switch เปิด
      } else {
        console.log("Switch is OFF");
        // ทำอะไรก็ตามที่คุณต้องการเมื่อ Switch ปิด
      }
    });
    const addItem = () => {
      // ทำอะไรก็ตามที่คุณต้องการเมื่อคลิกปุ่ม +
      console.log("Add item clicked");
    };

    const state = reactive({
      contentImage: baseUrl.value + "Content/Images/PNG/bg2.jpg",
      Imagetest: baseUrl.value + "Content/Images/PNG/buu.jpg",
    });

    onMounted(async () => {
      $(".bg5").css({
        "background-image": `url(${state.contentImage})`,
        "background-repeat": "no-repeat",
        "background-size": "cover",
        width: "100%",
        height: "10%",
      });

      $(".text-section").css({
        "background-color": "#F3F3F3",
        "background-repeat": "no-repeat",
        "background-size": "cover",
        width: "100%",
        height: "700px",
      });

      $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
        var currId = $(e.target).attr("id");
        // just for demo
        $("#lastTab").html(currId);
      });
    });

    return {
      baseUrl,
      state,
      isSwitchOn,
      addItem,
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

  height: 200px;
  /* ทำให้เต็มหน้าจอตลอด */
  margin-top: -80px; /* เพิ่มค่า margin-top เพื่อให้เนื้อหาอยู่ใต้ Navbar */
  color: #fff;

  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.fix {
  width: 100%;
}

.col-md-2 {
  flex: 1;
  margin: 10px; /* เพิ่มระยะห่างของปุ่ม "กลับ" */
}

.col-md-8 {
  flex: 1; /* ความกว้างเท่ากันระหว่างข้อความ "ใบแจ้งซ่อม" และปุ่ม "กลับ" */
}

a {
  color: #fff;
}

.container {
  width: 600px; // จัดให้เนื้อหาอยู่ตรงกลางแนวดิ่ง
}

.back {
  color: #fff;
  margin-right: 10px; // ปรับระยะห่างด้านขวาของปุ่ม "Back"
}

.col {
  flex: 1; // ความกว้างเท่ากันระหว่างปุ่ม "Back" และข้อความ "ใบแจ้งซ่อม"
}
.fix {
  margin-top: 5%;
}
.tab {
  background-color: #fff;
  color: #00BF9D;
}
.navbar-inner {
  margin: 50px;
}
.navbar {
  /* Set the background color */
  padding: 2%; /* Add padding to the top and bottom */
  transition: background-color 0.3s;
  margin: 0;
  align-items: center;
  padding: 30px 0px ;
}

.navbar-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 300px; /* Center the content horizontally */
  /* Add padding to the sides */

}
.navbar-nav ml {
  display: flex;
  justify-content: flex-end;
}

.navbar-brand-logo {
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
.card {
  border-radius: 32px;
  background: #fff;
  width: 660px;
  height: 620px;
}
.form1 {
  height: 650px;
  background-color: #f3f3f3;
}
.form2 {
  height: 730px;
  background-color: #f3f3f3;
}
.card-header {
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  font-size: 16px;
}
.card-body {
  color: #808080;

  font-family: Prompt;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.image-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-box img {
  width: 245.246px;
  height: 245.246px;
}

.image-description {
  color: var(--ccccc, #ccc);
  text-align: center;

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.btn-outline-light {
  background-color: #00bf9d;
  color: #fff;
  width: 159px;
  height: 35px;
  text-align: center;
  border-radius: 16.471px;
}
.bt-add {
  margin: 65px 0px 0px 240px;
}
.switch {
  position: relative;
  width: 57.6px;
  height: 32px;
 
}

.toggle-input {
  display: none;
}

.toggle-label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
 
  
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 1605.842px;
background: var(--unnamed, #F3F3F7);
}

.toggle-input:checked + .toggle-label {
  background-color: #00BF9D; /* สีเมื่อเปิด */
}

.toggle-label::before {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  left: 3px;
  top: 3px;
  transition: transform 0.3s;
}

.toggle-input:checked + .toggle-label::before {
  transform: translateX(30px); /* ลากไปด้านขวาเมื่อเปิด */
}
.add-button {
  background-color: #00BF9D;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 41.929px;
  cursor: pointer;
  font-size: 16px;
  width: 32px;
height: 32px;
}
</style>
