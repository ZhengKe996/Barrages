<template>
  <div class="container">
    <h1>好好学习 天天向上</h1>
    <div id="content">
      <canvas id="canvas" ref="canvas"></canvas>
      <video
        ref="video"
        width="640"
        height="380"
        controls
        :src="Video"
        @play="videoPlay"
        @pause="videoPause"
        @seeked="videoSeeked"
      ></video>
    </div>
    <input type="text" v-model="value" />
    <button @click="addBarrage">添加弹幕</button>
    <input type="color" v-model="color" />
    <input type="range" max="40" min="20" v-model="range" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Video from "@/assets/video.mp4";
import CanvasBarrage from "./CanvasBarrage";

const canvas = ref();
const video = ref();
const canvasBarrage = ref();

const value = ref("");
const color = ref("#000000");
const range = ref(20);
const socket = ref();
onMounted(() => {
  socket.value = new WebSocket("ws://127.0.0.1:8888");

  socket.value.onopen = function () {
    socket.value.onmessage = function (e) {
      let message = JSON.parse(e.data);
      if (message.type === "INIT") {
        canvasBarrage.value = new CanvasBarrage(canvas.value, video.value, {
          data: message.data,
        });
      }
      if (message.type === "ADD") {
        canvasBarrage.value.add(message.data);
      }
    };
  };
});
const videoPlay = () => {
  canvasBarrage.value.isPaused = false;
  canvasBarrage.value.render();
};
const videoPause = () => {
  canvasBarrage.value.isPaused = true;
};
const videoSeeked = () => {
  canvasBarrage.value.reset();
};
const addBarrage = () => {
  let time = video.value.currentTime;
  const obj = {
    time: time,
    value: value.value,
    color: color.value,
    fontSize: range.value,
  };
  socket.value.send(JSON.stringify(obj));
};
</script>

<style lang="scss" scoped>
.container {
  text-align: center;
  input {
    vertical-align: middle;
  }
}
#content {
  width: 640px;
  margin: auto;
  position: relative;
}
#canvas {
  position: absolute;
}
</style>
