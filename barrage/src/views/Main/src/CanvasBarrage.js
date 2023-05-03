import Barrage from "./Barrage";
export default class CanvasBarrage {
  constructor(canvas, video, options = {}) {
    if (!canvas || !video) return;
    this.canvas = canvas;
    this.video = video;

    // 默认选项
    const defaultOptions = {
      fontSize: 18,
      color: "#000000",
      speed: 2,
      opacity: 0.3,
      data: [],
    };

    // 对象的合并,将属性全部挂载在实例上
    Object.assign(this, defaultOptions, options);

    // 获取 canvas 画布
    this.context = canvas.getContext("2d");

    // 设置 canvas 宽高
    this.canvas.width = this.video.clientWidth;
    this.canvas.height = this.video.clientHeight;

    // 是否暂停
    this.isPaused = true; // 默认暂停播放，表示不渲染弹幕

    // 存放所有弹幕,Barrage是创造弹幕的实例类
    this.barrages = this.data.map((obj) => new Barrage(obj, this));

    // 渲染所有弹幕
    this.render();
  }

  render() {
    // 第一次 先进行清空操作,执行渲染弹幕,如果没有暂停，继续渲染
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 渲染弹幕
    this.renderBarrage();
    if (this.isPaused === false) {
      // 递归渲染
      requestAnimationFrame(this.render.bind(this));
    }
  }
  renderBarrage() {
    // 将数组中的弹幕一个一个取出，判断时间和视频的时间是否符合，符合就执行渲染此弹幕
    let time = this.video.currentTime;

    this.barrages.forEach((barrage) => {
      if (!barrage.flag && time >= barrage.time) {
        // 先去初始化，初始化后再进行绘制
        // 1. 如果没有初始化，先去初始化
        if (!barrage.isInited) {
          barrage.init();
          barrage.isInited = true;
        }
        barrage.x -= barrage.speed;
        // 渲染自己
        barrage.render();
        if (barrage.x <= barrage.width * -1) {
          // 做停止渲染的标记
          barrage.flag = true;
        }
      }
    });
  }
  add(value) {
    this.barrages.push(new Barrage(value, this));
  }
  reset() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let time = this.video.currentTime;
    this.barrages.forEach((barrage) => {
      barrage.flag = false;
      if (time <= barrage.time) {
        // 重新初始化
        barrage.isInited = false;
      } else {
        // 其他弹幕不再渲染
        barrage.flag = true;
      }
    });
  }
}
