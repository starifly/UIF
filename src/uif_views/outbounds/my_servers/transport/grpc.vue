<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="serviceName">
          <el-input
            v-model="transport.setting.serviceName"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="idleTimeout">
          <el-input
            v-model="transport.setting.idleTimeout"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="pingTimeout">
          <el-input
            v-model="transport.setting.pingTimeout"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="keepalivePing">
          <el-switch v-model="transport.setting.permitWithoutStream"> </el-switch>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "grpc",
  props: ["transport"],
  components: {},
  data() {
    return {};
  },
  mounted() {
    var setting = {
        serviceName: "TunService",
        idleTimeout: "15s",
        pingTimeout: "15s",
        permitWithoutStream: false,
    };
    this.transport.setting = InitSetting(this.transport.setting, setting);
  },
  computed: {
    ...mapState(["v2ray"]),
  },
  methods: {},
};
</script>
