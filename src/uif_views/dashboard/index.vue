<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="uif.connection.isConnecting">
      <div slot="header" class="clearfix">
        <span style="cursor: pointer"> 面板 </span>
        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          :type="uif.connection.isConnected ? 'danger' : 'success'"
          @click="Connect()"
          >{{ uif.connection.isConnected ? "断开后端" : "连接后端" }}
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="密码">
              <el-input v-model="uif.password" placeholder="必填"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="后端目录">
              <el-input
                :disabled="true"
                v-model="uif.connection.path"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="UIF接口地址">
              <el-input v-model="uif.apiAddress" placeholder="必填"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button @click="ResetAll()"> 重置所有配置 </el-button>
            </el-form-item>
          </el-col>

          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button @click="Share()"> 分享配置到移动端 </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="连接状态">
              <el-tag
                :type="uif.connection.isConnected ? 'success' : 'danger'"
                >{{ uif.connection.isConnected ? "已连接" : "未连接" }}</el-tag
              >
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="UIF版本">
              <el-tag effect="plain" type="info">
                {{ uif.connection.version }}
              </el-tag>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="时长">
              <el-tag effect="plain" type="primary">
                {{ uif.connection.times }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <span style="cursor: pointer">
          后端日志
          <el-divider direction="vertical"></el-divider>
          {{ uif.connection.coreVersion }}
        </span>
        <div style="float: right; margin-left: 10px; padding: 3px 0">
          <el-switch v-model="uif.consoleAuto"></el-switch>
          自动刷新
        </div>
      </div>

      <console :content="uif.coreLog" />
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AnsiUp from "ansi_up";
import console from "./console.vue";
import { getToken } from "@/utils/auth";

export default {
  name: "Dashboard",
  components: { console },
  data() {
    return {
      ansi: new AnsiUp(),
    };
  },
  mounted() {},
  computed: {
    ...mapState(["uif"]),
  },
  methods: {
    ...mapActions({
      Connect: "uif/Connect",
      Reset: "uif/ResetAll",
      CloseCore: "uif/CloseCore",
      CloseUIF: "uif/CloseUIF",
    }),
    ResetAll() {
      this.$confirm(
        "此操作会清空所有东西（包括入站、出站、路由等），不可逆转, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        },
      )
        .then(() => {
          this.Reset();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    Share() {
      var t = this;
      var shareLink =
        this.uif.connection.ip +
        ":9413/share?key=" +
        encodeURIComponent(getToken());
      this.$copyText(shareLink).then(
        function (e) {
          t.$message({
            showClose: true,
            message: "分享链接 已复制到剪切板",
            type: "success",
          });
        },
        function (e) {},
      );
    },
  },
};
</script>
