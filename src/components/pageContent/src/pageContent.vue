<template>
  <div>
    <pf-table
      :list-data="dataList"
      :list-count="dataCount"
      v-bind="contentTableConfig"
      @selectChange="selectChange"
      v-model:page="pageInfo"
    >
      <template #headerHandle>
        <el-button v-if="isCreate" type="primary" size="medium" @click="addPageData">
          {{ "新建" + contentTableConfig.title.slice(0, -2) }}
        </el-button>
      </template>

      <!-- 表格插槽 -->
      <template #createAt="scope">
        <span> {{ $filters.formatTime(scope.row.createAt) }} </span>
      </template>
      <template #updateAt="scope">
        <span> {{ $filters.formatTime(scope.row.updateAt) }} </span>
      </template>
      <template #handler="scope">
        <div>
          <el-button
            v-if="isUpdate"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="editPageData(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="isDelete"
            type="text"
            size="mini"
            icon="el-icon-delete"
            style="color: red"
            @click="deletePageData(scope.row)"
          >
            删除
          </el-button>
        </div>
      </template>

      <!-- 在page-content中动态插入剩余的插槽 -->
      <template v-for="item in otherPropList" :key="item.prop" #[item.slotName]="scope">
        <template v-if="item.slotName">
          <slot :name="item.slotName" :row="scope.row"></slot>
        </template>
      </template>
    </pf-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "@/store";
import PfTable from "@/components/commonTable";
import { IPropListConfig } from "@/components/commonTable/type";
import { usePermission } from "@/hooks/usePermission";
import { useMessageBox } from "@/hooks/useMessageBox";

export default defineComponent({
  components: { PfTable },
  props: {
    pageName: {
      type: String,
      required: true
    },
    contentTableConfig: {
      type: Object,
      required: true
    }
  },
  emits: ["editBtnClick", "addBtnClick"],
  setup(props, { emit }) {
    const store = useStore();

    // 获取操作权限
    const isCreate = usePermission(props.pageName, "create");
    const isUpdate = usePermission(props.pageName, "update");
    const isDelete = usePermission(props.pageName, "delete");
    const isQuery = usePermission(props.pageName, "query");

    // 双向绑定page
    const pageInfo = ref({ currentPage: 1, pageSize: 10 });
    watch(pageInfo, () => {
      getPageData();
    });

    const getPageData = (queryInfo: any = {}) => {
      if (!isQuery) return;
      store.dispatch("system/fetchPageListAction", {
        pageName: props.pageName,
        queryInfo: {
          offset: pageInfo.value.pageSize * (pageInfo.value.currentPage - 1),
          size: pageInfo.value.pageSize,
          ...queryInfo
        }
      });
    };
    getPageData();

    const dataList = computed(() => store.getters[`system/pageListData`](props.pageName));
    const dataCount = computed(() => store.getters[`system/pageListCount`](props.pageName));
    const selectChange = (value: any) => {
      console.log(value, 111);
    };

    // 获取其他的动态插槽名称
    const otherPropList = props.contentTableConfig?.propListConfig.filter(
      (item: IPropListConfig) => {
        if (item.slotName === "createAt") return false;
        if (item.slotName === "updateAt") return false;
        return item.slotName !== "handler";
      }
    );

    // 删除/编辑/新建 操作
    const deletePageData = (item: any) => {
      const thenFn = () => {
        store.dispatch("system/deletePageDataAction", {
          pageName: props.pageName,
          id: item.id
        });
      };
      useMessageBox(
        {
          titleContent: "确定删除吗？",
          thenMessage: "删除成功！",
          catchMessage: "已取消删除"
        },
        thenFn
      );
    };
    const editPageData = (item: any) => {
      emit("editBtnClick", item);
    };
    const addPageData = () => {
      emit("addBtnClick");
    };
    return {
      dataList,
      dataCount,
      selectChange,
      getPageData,
      pageInfo,
      otherPropList,
      isCreate,
      isUpdate,
      isDelete,
      deletePageData,
      editPageData,
      addPageData
    };
  }
});
</script>

<style lang="scss" scoped></style>
