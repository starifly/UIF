<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="uif.pannel.isClient"
      >
        <el-form-item label="认证密码">
          <el-input
            v-model="outbound_obj.setting.password"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="!uif.pannel.isClient"
      >
        <el-form-item label="认证密码">
          <el-input
            v-model="outbound_obj.setting.users[0].password"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="混淆密码">
          <el-input
            v-model="outbound_obj.setting.obfs.password"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="上传速度">
          <el-input placeholder="必填" v-model="outbound_obj.setting.up_mbps">
            <template slot="append">Mbps</template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="下载速度">
          <el-input placeholder="必填" v-model="outbound_obj.setting.down_mbps">
            <template slot="append">Mbps</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { InitSetting } from "@/utils";

export default {
  name: "hysteria2",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      up_mbps: 100,
      down_mbps: 100,
      obfs: {
        type: "salamander",
        password: uuidv4(),
      },
      users: [
        {
          password: uuidv4(),
        },
      ],
      ignore_client_bandwidth: false,
      masquerade: "http://127.0.0.1:8080",
    };
    if (this.uif.pannel.isClient) {
      setting = {
        up_mbps: 100,
        down_mbps: 100,
        obfs: {
          type: "salamander",
          password: uuidv4(),
        },
        password: uuidv4(),
      };
    }
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
