<template>
  <div>
    <div id="amuse">
      <chart ref="chart1" :options="orgOptions" :auto-resize="true"></chart>
    </div>
  </div>
</template>

<script>
// import echarts from "echarts";
// import data from '../assets/data.json';

export default {
  data() {
    return {
      orgOptions: {}
    };
  },
  methods: {},
  mounted() {
    this.orgOptions = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true
        }
      ]
    };
  }
};
</script>

<style scoped>
#amuse {
  position: relative;
  left: 50%;
  width: 90%;
  height: 600px;
  margin-left: -45%;
  box-shadow: 0 0 10px #a2b4ba;
  border-radius: 10px;
}
@media screen and (max-width: 530px) {
  #amuse {
    height: 500px;
  }
}
</style>
