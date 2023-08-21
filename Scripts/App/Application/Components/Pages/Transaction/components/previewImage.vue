<template>
    <div>
        <div id="myModal" class="modal" :class="isOpen ? 'openModal' : ''">
            <span class="close cursor" @click="closeModal()">&times;</span>
            <div class="modal-content">
                <div class="mySlides" v-for="(x,i) in imgList" :class="(i == 0) ? 'show_img':''">
                    <div class="numbertext">{{ i+1 }} / {{ imgList.length }}</div>
                    <img :src="x.path" style="width:100%">
                </div>

                <a class="prev" @click="plusSlides(-1)">&#10094;</a>
                <a class="next" @click="plusSlides(1)">&#10095;</a>

                <div class="caption-container">
                <p id="caption"></p> 
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                isOpen : false,
                imgList : [],
                slideIndex : 1
            }
        },
        methods : {
            viewImage(source){
                this.isOpen = true;
                console.log(source);
                this.imgList = source;

                this.slideIndex = 1;
                var slides = document.getElementsByClassName("mySlides");

                console.log(slides);
                // slides[1].style.display = "block";
            },
            closeModal(){
                this.isOpen = false;
                this.slideIndex = 1;
                this.imgList = [];
            },
            plusSlides(n) {
                this.showSlides(this.slideIndex += n);
            },
            currentSlide(n) {
                this.showSlides(this.slideIndex = n);
            },
            showSlides(n) {
                var i;
                var slides = document.getElementsByClassName("mySlides");
                // var dots = document.getElementsByClassName("demo");
                var captionText = document.getElementById("caption");
                console.log(slides);
                if (n > slides.length) {this.slideIndex = 1}
                if (n < 1) {this.slideIndex = slides.length}
                for (i = 0; i < slides.length; i++) {
                    slides[i].classList.remove('show_img')
                    // slides[i].style.display = "none";
                }

                // slides[this.slideIndex-1].style.display = "block";
                slides[this.slideIndex-1].classList.add('show_img')
                // dots[this.slideIndex-1].className += " active";
                // captionText.innerHTML = dots[this.slideIndex-1].alt;
            }
        },
        mounted(){

        }
    }
</script>
<style>
/* The Modal (background) */
.openModal{
    display: block !important;
}
.modal {
  display: none;
  position: fixed;
  z-index: 1050;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: black;
}
.show_img{
    display: block !important;
}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  width: 90%;
  max-width: 1200px;
}

/* The Close Button */
.close {
  color: white;
  position: absolute;
  top: 10px;
  right: 25px;
  font-size: 35px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #999;
  text-decoration: none;
  cursor: pointer;
}

.mySlides {
  display: none;
}

.cursor {
  cursor: pointer;
}

/* Next & previous buttons */
.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  padding: 16px;
  margin-top: -50px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
  -webkit-user-select: none;
}

/* Position the "next button" to the right */
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Number text (1/3 etc) */
.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

img {
  margin-bottom: -4px;
}

.caption-container {
  text-align: center;
  background-color: black;
  padding: 2px 16px;
  color: white;
}

.demo {
  opacity: 0.6;
}

.active,
.demo:hover {
  opacity: 1;
}

img.hover-shadow {
  transition: 0.3s;
}

.hover-shadow:hover {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>