<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="local_address">
          <el-input
            v-model="outbound_obj.setting.local_address"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="私钥">
          <el-input
            v-model="outbound_obj.setting.private_key"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="公钥">
          <el-input
            v-model="outbound_obj.setting.peer_public_key"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="pre_shared_key">
          <el-input
            v-model="outbound_obj.setting.pre_shared_key"
            placeholder="选填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="workers">
          <el-input
            v-model="outbound_obj.setting.workers"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="mtu大小">
          <el-input
            v-model="outbound_obj.setting.mtu"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "wireguard",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {
      auth: false,
    };
  },
  created() {
    var setting = {
      interface_name: "sing-box-wg",
      local_address: "10.0.0.2/32",
      private_key: "YNXtAzepDqRv9H52osJVDQnznT5AM11eCK3ESpwSt04=",
      peer_public_key: "Z1XXLsKYkYxuiYjJIkRvtIKFepCYHTgON+GwPq7SOV4=",
      pre_shared_key: "31aIhAPwktDGpH4JDhA8GNvjFXEf/a6+UaQRyOAiyfM=",
      workers: 4,
      mtu: 1408,
    };
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  computed: {
    ...mapState(["uif"]),
  },

  methods: {
    ...mapActions({
      ConnectV2ray: "v2ray/ConnectV2ray",
    }),
  },
};
</script>
