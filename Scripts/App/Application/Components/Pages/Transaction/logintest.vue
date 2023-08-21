<template>
  <div>
    <navbar> </navbar>
    
    <p class="" style="background: #000000; z-index: 1040"></p>

    <div class="row">
        <div class="col-12">
            <div class="content" id="main">
                <div class="row">
                    <p class="font">ยินดีต้อนรับเข้าสู่</p>
                </div>
                <div class="row">
                    <h4 class="fontt">ระบบแจ้งซ่อมและติดตามสถานะการแจ้งซ่อม</h4>
                </div>
                <div class="row">
                    <p class="fonttt">
                        คุณลูกบ้านสามารถ ทำรายการได้ที่ เมนูด้านล่าง
                    </p>
                </div>         
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-12" style="margin-left: 207px">
            <div class="">
                <!-- <div class="col" -->
                <a href="/page/detail.html" class="btn btn-outline-light" style="border-radius: 8px; border: 2px solid #FFF;margin-right: 20px; font-size: 24px;color:#FFF;">แจ้งซ่อม</a>
                <a href="/page/detail2.html" class="btn btn-outline-light" style="border-radius: 8px; border: 2px solid #FFF; font-size: 24px; color:#FFF;">ติดตามสถานะ</a>
            </div>
        </div>
    </div>
         <!-- Modal -->

         <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="border-radius: 16px; box-shadow: 0px 2px 25px 0px rgba(0, 0, 0, 0.08);">
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="width: 390px; border-radius: 16px;
                background: #FFF; ">
                    <div class="modal-header" style="background-color:#fff; height:auto; border-radius: 16px;
                    background: #FFF;" >
                        <img
                  :src="baseUrl + 'Content/Images/Logo/logo_mango.png'" class="img-fluid" alt="Your Logo" style="max-width: 150px; color:#CCCCCC">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closeModal()">
                            <img :src="`${baseUrl}Content/Images/Icon SVG/close.svg`" style="width: 20.127px;
                            height: 20.128px;">
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>เข้าสู่ระบบ</p>
                        <!-- Login Form -->
                        <form>
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" id="username" placeholder="Enter username">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Password">
                            </div>
                            <div class="form-group form-check" style="margin-left:30px">
                                <input type="checkbox" class="form-check-input" id="rememberMe" style="gap: 16px;">
                                <label class="form-check-label" for="rememberMe" style="margin-top:5px">Remember Me</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn btn-outline-light" style="background-color: #00BF9D; color: #fff; width: 350px; height: 50px;">เข้าสู่ระบบ</button>
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
      contentImage: baseUrl.value + "Content/Images/PNG/bg.jpg",
    });

    onMounted(async () => {
      $("body").css({
        "background-image": `url(${state.contentImage})`,

        "background-repeat": "no-repeat",

        "background-size": "cover",
      });
      $(document).ready(function() {
            $('#myModal').modal('show');
        });

        function openModal() {
            document.getElementById('customModal').style.display = 'flex';
        }

        function closeModal() {
            $('#myModal').modal('hide');
        }
    });
    return {
      baseUrl,
      state,
      
    };
  },
};
</script>

<style lang="scss" scoped>
/* ... ส่วนอื่น ๆ ... */
/* Reset some default styles */

body,
h1 {
  color: rgba(255, 255, 255, 0.6);
  
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

.content {
  padding-top: 10%;
  color: rgb(159, 165, 165);
  margin-left: 10%;
  min-height: 500px;
  min-width: none;
}

.fontt {
  color: #fff;

  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.fonttt {
  color: #fff;

  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.font {
  color: rgba(255, 255, 255, 0.6);

  font-size: 64px;
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


/* ตั้งค่าให้ปุ่ม Navbar ชิดขวา */

.ml-auto {
  margin-left: 50% !important;
}

.navbar-brand img {
  max-height: 70%;
  /* ขนาดสูงมากสุดของโลโก้คือ 100% ของพื้นที่ใน Navbar */
  width: auto;
  /* ปรับความกว้างของโลโก้อัตโนมัติ */
}

.circular-image {
  max-width: 100px;
  border-radius: 20%;
}

li a:hover {
  background-color: #00bf9d;
  border-radius: 12rem;
}
.btn-outline-light:hover{
    background-color: #00bf9d;
    border-radius: 12rem;
}
.modal-header{
    border-bottom: 0 !important;
}

.modal-footer {
    border-top: 0 !important;
}
.formtext-modal {
    color: #808080;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.boxInput {
    gap: 16px;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.btnModal {
    background-color: #00BF9D !important; 
    color: #fff !important; 
    width: 360px !important; 
    height: 50px !important;
    border-radius: 8px !important;
}

/* ส่วนของการแบ่งพื้นหลังเป็นสองส่วน */
</style>
