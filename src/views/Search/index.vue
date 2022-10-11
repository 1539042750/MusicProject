<template>
  <div>
    <van-search
      shape="round"
      v-model="value"
      placeholder="请输入搜索关键词"
      @input="inputFn(value)"
    />
    <div class="search_wrap" v-if="value.length === 0">
      <p class="hot_title">热门搜索</p>
      <div class="hot_name_wrap">
        <p
          class="hot_item"
          v-for="(obj, index) in hotArr"
          :key="index"
          @click="btn(obj.first)"
        >
          {{ obj.first }}
        </p>
      </div>
    </div>
    <div class="search_wrap" v-else>
      <p class="hot_title">最佳匹配</p>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <SongList
          v-for="(obj, index) in resultList"
          :key="index"
          :name="obj.name"
          :author="obj.ar[0].name"
          :id="obj.id"
        ></SongList>
      </van-list>
    </div>
  </div>
</template>

<script>
import { hotSearchAPI, searchResultListAPI } from "@/api";
import SongList from "@/components/SongList.vue";
export default {
  data() {
    return {
      hotArr: [],
      value: "",
      resultList: [],
      loading: false,
      finished: false,
      page: 1,
    };
  },
  components: {
    SongList,
  },
  async created() {
    const res = await hotSearchAPI();
    this.hotArr = res.data.result.hots;
  },
  methods: {
    // 点击按钮
    async btn(val) {
      this.page++;
      this.finished = false;
      this.value = val;
      const res = await this.getListFn();
      this.resultList = res.data.result.songs;
      this.loading = false;
    },
    // 获取信息
    async getListFn() {
      return await searchResultListAPI({
        keywords: this.value,
        limit: 20,
      });
    },
    //输入框
    async inputFn(val) {
      //输入框防抖
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        this.page = 1;
        this.finished = false;
        if (this.value.length === 0) {
          this.resultList = [];
          return;
        }
        this.value = val;
        const res = await this.getListFn();
        if (res.data.result.songs === undefined) {
          this.resultList = [];
          return;
        }
        this.resultList = res.data.result.songs;
        this.loading = false;
      }, 900);
    },
    async onLoad() {
      // 触底事件(要加载下一页的数据咯), 内部会自动把loading改为true
      this.page++;
      const res = await this.getListFn();
      if (res.data.result.songs === undefined) {
        this.finished = true; // 全部加载完成(list不会在触发onload方法)
        this.loading = false;
        return;
      }
      this.resultList = [...this.resultList, ...res.data.result.songs];
      this.loading = false; // 数据加载完毕-保证下一次还能触发onload
    },
  },
};
</script>

<style scoped>
/* 搜索容器的样式 */
.search_wrap {
  padding: 0.266667rem;
}

/*热门搜索文字标题样式 */
.hot_title {
  font-size: 0.32rem;
  color: #666;
}

/* 热搜词_容器 */
.hot_name_wrap {
  margin: 0.266667rem 0;
}

/* 热搜词_样式 */
.hot_item {
  display: inline-block;
  height: 0.853333rem;
  margin-right: 0.213333rem;
  margin-bottom: 0.213333rem;
  padding: 0 0.373333rem;
  font-size: 0.373333rem;
  line-height: 0.853333rem;
  color: #333;
  border-color: #d3d4da;
  border-radius: 0.853333rem;
  border: 1px solid #d3d4da;
}
</style>