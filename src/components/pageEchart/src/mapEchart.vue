<template>
  <div class="mapEchart">
    <pf-echart :options="options"></pf-echart>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import PfEchart from "@/components/commonEchart";
import { IOptionDataType } from "../type";
import { convertData } from "../utils/convertData";

export default defineComponent({
  components: { PfEchart },
  props: {
    mapData: Array as PropType<IOptionDataType[]>
  },
  setup(props) {
    const options = computed(() => {
      return {
        backgroundColor: "#fff",
        title: {
          text: "全国销量统计",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function (params: any) {
            return params.name + " : " + params.value[2];
          }
        },
        visualMap: {
          min: 0,
          max: 60000,
          left: 20,
          bottom: 20,
          calculable: true,
          text: ["高", "低"],
          inRange: {
            color: ["rgb(70, 240, 252)", "rgb(250, 220, 46)", "rgb(245, 38, 186)"]
          },
          textStyle: {
            color: "#fff"
          }
        },
        geo: {
          map: "china",
          roam: "scale",
          emphasis: {
            areaColor: "#f4cccc",
            borderColor: "rgb(9, 54, 95)",
            itemStyle: {
              areaColor: "#f4cccc"
            }
          }
        },
        series: [
          {
            name: "销量",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(props.mapData),
            symbolSize: 12,
            emphasis: {
              itemStyle: {
                borderColor: "#fff",
                borderWidth: 1
              }
            }
          },
          {
            type: "map",
            map: "china",
            geoIndex: 0,
            aspectScale: 0.75,
            tooltip: {
              show: false
            }
          }
        ]
      };
    });
    return {
      options
    };
  }
});
</script>

<style lang="scss" scoped></style>
