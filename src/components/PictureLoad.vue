<template>
<div>
  <div class="inpbox">
  <p>{{info}}</p>
  <img ref="imgv" id="src" :src="srcA" alt="">
  <input ref="inpv" @change="upload" class="inp" type="file" id="selefile" accept=".png,.jpg">
  </div>
</div>
</template>

<script>
export default {
  name : 'PictureLoad',
  props: {
        srcA:{
          type:String,
          default:'../assets/dummy.png'
        },
        info:String
  },
  data(){
    return{
      selepic:null,
      reader:null,
    }
  },
  mounted(){
    this.$refs.imgv.addEventListener("click", () => {
      this.$refs.inpv.click();
    });
    console.log(this.srcA);
  },
  methods:{
    upload(e){
      event.preventDefault();
      this.selepic = e.target.files[0];
      this.reader = new FileReader();
      this.reader.readAsDataURL(this.selepic);
      this.reader.onload = (e) => {
        let image = document.createElement('img');
        this.$refs.imgv.setAttribute('src', e.target.result);
        image.src = e.target.result;       
        this.$emit('send',image);
      };
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inp{
  display: none;
}
.inpbox{
  background-color: rgb(231, 231, 231);
  z-index: 34;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#src{
  width: 40vw;
  height: 20vw;
  max-width: 100%;
  filter: brightness(0.8);
}
#src:hover{
  filter: brightness(1.0);
}
@media screen and (orientation: landscape){
  .inpbox{
    background-color: rgb(231, 231, 231);
    z-index: 34;
    width: 200px;
    height: 150px;
    overflow: hidden;
  }

  #src{
    width: 200px;
    height: 120px;
    max-width: 100%;
    filter: brightness(0.8);
  }
}
button {
  background-color: azure;
}
input {
  display: none;
}
</style>
