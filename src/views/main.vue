<template>
  <div class="main">
    <div class="header">CucumberAI</div>
    <div class="center">
      <div class="center-head">
        <div class="title">Cucumebr Characterization System</div>
        <div style="flex: 1"></div>
        <div>
          <a-badge
            v-if="GPUstatus"
            status="success"
            text="GPU Server(online)"
          />
          <a-badge
            v-else-if="!GPUstatus"
            status="error"
            text="GPU Server(offline)"
          />
          &nbsp;&nbsp;/&nbsp;&nbsp;
        </div>
        <div>
          <a-badge :count="dotCount" dot>
            <a @click="openInstruction">Instructions for use</a>
          </a-badge>
          <a-modal
            v-model:visible="visible"
            title="Instructions for use"
            @ok="handleOk"
          >
            <p>
              1. Select a mode and make sure that the uploaded image corresponds
              to the selected one.
            </p>
            <p>
              2. You must select the features to be extracted. If you choose
              "fruit shape", the processing speed will be slower.
            </p>
            <a-image :preview="false" src="img/features.png" />
            <p>
              3. Select the cucumber fruit or pulp image, or you can drag and
              drop to upload. You can predict multiple pictures at a time (for
              the time being, you can only upload JPG or PNG files one by one,
              with a limit of 5 uploads).
            </p>
            <a-image :preview="false" src="img/upload_img.png" />
            <p>
              4. When the feature is selected and the image is uploaded click
              the 'Run' button to run the program, click the 'Reset' button or
              refresh the page to clear everything.
            </p>
            <a-image :preview="false" src="img/buttons.png" />
            <p>
              4. The result is a table and an image, click on the image to
              preview it, both can be downloaded.(The feature names and image
              names in the table will be improved later.)
            </p>
            <p>5. Classification-related functions will be added later.</p>
            <a-image src="img/result.png" />
          </a-modal>
        </div>
      </div>
      <div class="center-part">
        <div class="tip">
          Choose mode, one feature at least and upload your images...
        </div>

        <!-- 选择特征 -->
        <a-radio-group
          class="mode"
          v-model:value="modeValue"
          button-style="solid"
          @change="onRatioChange"
          :disabled="noaction"
        >
          <a-radio-button value="fruit">Fruit mode</a-radio-button>
          <a-radio-button value="pulp">Pulp mode</a-radio-button>
        </a-radio-group>

        <div :style="{ borderBottom: '0.065vw solid #E9E9E9' }">
          <a-checkbox
            v-model:checked="checkAll"
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :disabled="noaction"
          >
            Check all
          </a-checkbox>
        </div>
        <a-checkbox-group
          class="features"
          v-if="modeValue == 'fruit'"
          v-model:value="checkedList"
          :options="plainOptions1"
          @change="onRatioGruopChange"
          :disabled="noaction"
        />
        <a-checkbox-group
          class="features"
          v-if="modeValue == 'pulp'"
          v-model:value="checkedList"
          :options="plainOptions2"
          @change="onRatioGruopChange"
          :disabled="noaction"
        />

        <!-- 文件上传 -->
        <a-upload-dragger
          class="upload"
          v-model:fileList="fileList"
          name="file"
          :multiple="false"
          :action="baseUrl + '/upload'"
          @change="handleChange"
          :disabled="noaction"
          limit="5"
          :before-upload="beforeUpload"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p class="ant-upload-hint">
            Upload them one by one, maximum of 5 images
          </p>
        </a-upload-dragger>

        <div class="btn">
          <a-button class="reset" type="primary" @click="clear" v-if="resetbtn"
            >Reset</a-button
          >

          <a-button
            class="pred"
            type="primary"
            @click="predict"
            v-if="prebtn"
            :loading="btnLoading"
            >Run</a-button
          >

          <a-button class="pred" type="primary" v-if="disbtn" disabled
            >Run</a-button
          >
        </div>

        <!-- Excel文件下载 -->
        <div class="file" v-show="disbtn">
          <div>Excel File:&nbsp;&nbsp;&nbsp;</div>
          <PaperClipOutlined />&nbsp;<a
            id="downloadexcel"
            href="#"
            :download="modeValue + '.xlsx'"
          >
            {{ modeValue }}.xlsx</a
          >
        </div>
      </div>

      <!-- 图片表格展示及下载 -->
      <div class="table">
        <a-table
          v-if="modeValue == 'fruit' && columns.length != 1"
          v-show="disbtn"
          :columns="columns"
          :data-source="data"
          :pagination="{ pageSize: 5 }"
        >
          <template #color_img="{ record }">
            <span>
              <a-image
                width="50px"
                :src="'data:image/jpg;base64,' + record.color_img"
              />
            </span>
          </template>
          <template #sk_img="{ record }">
            <span>
              <a-image
                width="50px"
                :src="'data:image/jpg;base64,' + record.sk_img"
              />
            </span>
          </template>
          <template #V1_img="{ record }">
            <span>
              <a-image
                width="50px"
                :src="'data:image/jpg;base64,' + record.V1_img"
              />
            </span>
          </template>
          <template #V2_img="{ record }">
            <span>
              <a-image
                width="50px"
                :src="'data:image/jpg;base64,' + record.V2_img"
              />
            </span>
          </template>
          <template #V5_img="{ record }">
            <span>
              <a-image
                width="50px"
                :src="'data:image/jpg;base64,' + record.V5_img"
              />
            </span>
          </template>
          <template #stripe_img="{ record }">
            <span>
              <a-image
                width="50px"
                height="50px"
                :src="'data:image/jpg;base64,' + record.stripe_img"
              />
            </span>
          </template>
          <template #tumor_img="{ record }">
            <span>
              <a-image
                width="50px"
                height="50px"
                :src="'data:image/jpg;base64,' + record.tumor_img"
              />
            </span>
          </template>
          <template #action="{ record }">
            <span>
              <a @click="downloadimgs(record)">Download</a>
            </span>
          </template>
        </a-table>

        <a-table
          v-if="modeValue == 'pulp' && columns.length != 1"
          v-show="disbtn"
          :columns="columns"
          :data-source="data"
          :pagination="{ pageSize: 5 }"
        >
          <template #smooth_V1_img="{ record }">
            <span>
              <a-image
                width="50px"
                height="50px"
                :src="'data:image/jpg;base64,' + record.smooth_V1_img"
              />
            </span>
          </template>
          <template #smooth_V2_img="{ record }">
            <span>
              <a-image
                width="50px"
                height="50px"
                :src="'data:image/jpg;base64,' + record.smooth_V2_img"
              />
            </span>
          </template>
          <template #smooth_V4_img="{ record }">
            <span>
              <a-image
                width="50px"
                height="50px"
                :src="'data:image/jpg;base64,' + record.smooth_V4_img"
              />
            </span>
          </template>
          <template #heart_img="{ record }">
            <span>
              <a-image
                width="50px"
                height="50px"
                :src="'data:image/jpg;base64,' + record.heart_img"
              />
            </span>
          </template>
          <template #action="{ record }">
            <span>
              <a @click="downloadimgs(record)">Download</a>
            </span>
          </template>
        </a-table>
      </div>
    </div>

    <footer class="footer">CucumberAI ©2023 Created by Jin Tao</footer>
  </div>
</template>

<script>
import {
  InboxOutlined,
  PaperClipOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { message, Modal, notification } from 'ant-design-vue';
import {
  createVNode,
  defineComponent,
  ref,
  reactive,
  toRefs,
  watch,
  onUpdated,
  onMounted,
} from 'vue';
import cont from '../api/cont';
import baseUrl from '../api/baseUrl';
import utils from '../utils/utils';
import * as imageConversion from 'image-conversion';

const plainOptions1 = ['fruit shape', 'color & texture', 'stripe', 'tumor'];
const plainOptions2 = ['pulp shape', 'flesh & heart'];

const columns1 = [
  {
    title: 'Key',
    dataIndex: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Segment',
    dataIndex: 'color_img',
    slots: {
      customRender: 'color_img',
    },
  },
  {
    title: 'Skeleton',
    dataIndex: 'sk_img',
    slots: {
      customRender: 'sk_img',
    },
  },
  {
    title: 'Dr',
    dataIndex: 'V1_img',
    slots: {
      customRender: 'V1_img',
    },
  },
  {
    title: 'Hr',
    dataIndex: 'V2_img',
    slots: {
      customRender: 'V2_img',
    },
  },
  {
    title: 'Cf',
    dataIndex: 'V5_img',
    slots: {
      customRender: 'V5_img',
    },
  },
  {
    title: 'Stripe',
    dataIndex: 'stripe_img',
    slots: {
      customRender: 'stripe_img',
    },
  },
  {
    title: 'Tumors',
    dataIndex: 'tumor_img',
    slots: {
      customRender: 'tumor_img',
    },
  },
  {
    title: 'Action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
  },
];
const columns2 = [
  {
    title: 'Key',
    dataIndex: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Hr',
    dataIndex: 'smooth_V1_img',
    slots: {
      customRender: 'smooth_V1_img',
    },
  },
  {
    title: 'Cr',
    dataIndex: 'smooth_V2_img',
    slots: {
      customRender: 'smooth_V2_img',
    },
  },
  {
    title: 'Cf',
    dataIndex: 'smooth_V4_img',
    slots: {
      customRender: 'smooth_V4_img',
    },
  },
  {
    title: 'Heart',
    dataIndex: 'heart_img',
    slots: {
      customRender: 'heart_img',
    },
  },
  {
    title: 'Action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
  },
];

export default defineComponent({
  components: {
    InboxOutlined,
    PaperClipOutlined,
  },
  setup() {
    const fileList = ref([]); //上传的图片
    const fileNameList = ref([]);
    const btnLoading = ref(false);
    const visible = ref(false);
    const prebtn = ref(false);
    const resetbtn = ref(false);
    const disbtn = ref(false);
    const noaction = ref(false);
    const imageList = ref([]);
    const modeValue = ref('fruit'); //模式
    const data = ref([]); //表格数据
    const uploadError = ref(false); //是否发生上传错误
    const GPUstatus = ref(false); //GPU服务器状态
    const dotCount = ref(1);
    // 初始表格列
    const columns = ref([
      {
        title: 'Action',
        key: 'action',
        slots: {
          customRender: 'action',
        },
      },
    ]);

    const openInstruction = () => {
      dotCount.value = 0;
      visible.value = true;
    };
    const handleOk = (e) => {
      visible.value = false;
    };

    const state = reactive({
      indeterminate: false,
      checkAll: false,
      checkedList: [],
    });

    //全选框
    const onCheckAllChange = (e) => {
      if (modeValue.value == 'fruit') {
        Object.assign(state, {
          checkedList: e.target.checked ? plainOptions1 : [],
          indeterminate: false,
        });
      } else {
        Object.assign(state, {
          checkedList: e.target.checked ? plainOptions2 : [],
          indeterminate: false,
        });
      }
      if (state.checkedList.length == 0 || fileList.value.length == 0) {
        prebtn.value = false;
      } else {
        if (
          fileList.value.length == 1 &&
          (uploadError.value == true || resetbtn.value == false)
        ) {
          prebtn.value = false;
        } else {
          prebtn.value = true;
        }
      }
    };

    //选择框变化
    const onRatioGruopChange = (e) => {
      if (state.checkedList.length == 0 || fileList.value.length == 0) {
        prebtn.value = false;
      } else {
        if (
          fileList.value.length == 1 &&
          (uploadError.value == true || resetbtn.value == false)
        ) {
          prebtn.value = false;
        } else {
          prebtn.value = true;
        }
      }
    };

    //模式选择变化
    const onRatioChange = (e) => {
      Object.assign(state, {
        checkedList: [],
        indeterminate: false,
        checkAll: false,
      });
    };

    const beforeUpload = (file) => {
      if (fileList.value.length == 0) {
        notification.open({
          message: 'Upload Notice',
          description:
            'The uploaded image will be compressed to around 1MB. Please wait until the upload is complete before uploading the next image.',
        });
      }

      if (fileList.value.length >= 5) {
        message.warning('Maximum of 5 images can be uploaded.');
        return false;
      }
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.warning('Please upload JPG or PNG files.');
        return false;
      }
      return new Promise((resolve) => {
        // 压缩到640KB
        imageConversion.compressAccurately(file, 640).then((res) => {
          resolve(res);
        });
      });
    };

    //上传处理
    const handleChange = (info) => {
      noaction.value = true;
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        noaction.value = false;
        fileNameList.value.push(info.file.name);
        message.success(`${info.file.name} file uploaded successfully.`);
        if (state.checkedList.length != 0) {
          prebtn.value = true;
          disbtn.value = false;
        }
        if (info.fileList == 0) {
          resetbtn.value = false;
        } else {
          resetbtn.value = true;
        }
      } else if (status === 'error') {
        noaction.value = false;
        message.error(`${info.file.name} file upload failed.`);
        uploadError.value = true;
        if (info.fileList == 0) {
          resetbtn.value = false;
        } else {
          resetbtn.value = true;
        }
      }
    };

    //预测
    const predict = () => {
      console.log(fileNameList.value);
      notification.open({
        message: 'Notice',
        description: 'The process may take a long time, so please be patient.',
      });

      btnLoading.value = true;
      noaction.value = true;
      // resetbtn.value = false;
      const metrics = Object.values(state.checkedList);

      cont
        .predict({
          UA: 'pc',
          mode: modeValue.value,
          metrics: metrics,
          names: fileNameList.value,
        })
        .then((res) => {
          message.success(`Run successful.`);
          // 表格列动态显示
          if (res.data.imgdata.length != 0) {
            for (const item of modeValue.value == 'fruit'
              ? columns1
              : columns2) {
              if (Object.keys(res.data.imgdata[0]).includes(item.dataIndex)) {
                columns.value.splice(columns.value.length - 1, 0, item);
              }
            }
          }
          data.value = res.data.imgdata;

          // Excel下载链接更新
          const link = document.getElementById('downloadexcel');
          link.href =
            'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
            res.data.excel;

          btnLoading.value = false;
          prebtn.value = false;
          // resetbtn.value = true;
          if (resetbtn.value == true) {
            disbtn.value = true;
          }
        })
        .catch((error) => {
          message.error(`Run failed!`, error);
          fileList.value = [];
          resetbtn.value = false;
          prebtn.value = false;
          disbtn.value = false;
          btnLoading.value = false;
          noaction.value = false;
          uploadError.value = false;
          columns.value = [
            {
              title: 'Action',
              key: 'action',
              slots: {
                customRender: 'action',
              },
            },
          ];
          data.value = [];
          cont
            .clear({ names: fileNameList.value })
            .then((res) => {
              console.log(res);
              if (res.data == 'Clear Error!') {
                return;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          fileNameList.value = [];
          console.log(error);
        });
    };

    //图片下载
    const downloadimgs = (record) => {
      const imgKey = record.key;
      for (const [key, value] of Object.entries(record)) {
        if (key != 'name' && key != 'key') {
          const link = document.createElement('a');
          link.href = 'data:image/jpg;base64,' + value;
          const imgName = columns.value.find(
            (item) => item.dataIndex === key
          ).title;
          link.download = imgName + '_' + imgKey + '.jpg';
          link.click();
        }
      }
    };

    //清除
    const clear = () => {
      Modal.confirm({
        title: () => 'Are you sure to reset?',
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () => 'Uploaded images and results will be cleared.',
        onOk() {
          fileList.value = [];
          resetbtn.value = false;
          prebtn.value = false;
          disbtn.value = false;
          btnLoading.value = false;
          noaction.value = false;
          uploadError.value = false;
          columns.value = [
            {
              title: 'Action',
              key: 'action',
              slots: {
                customRender: 'action',
              },
            },
          ];
          data.value = [];
          cont
            .clear({ names: fileNameList.value })
            .then((res) => {
              console.log(res);
              if (res.data == 'Clear Error!') {
                return;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          fileNameList.value = [];
        },
        onCancel() {},
      });
    };

    const checkGPU = () => {
      cont
        .checkStatus()
        .then((res) => {
          console.log('GPU:', res.data.status);
          GPUstatus.value = res.data.status;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    onMounted(() => {
      checkGPU();
      setInterval(() => {
        checkGPU();
      }, 1800000);
    });

    watch(
      () => state.checkedList,
      (val) => {
        if (modeValue.value == 'fruit') {
          state.indeterminate =
            !!val.length && val.length < plainOptions1.length;
          state.checkAll = val.length === plainOptions1.length;
        } else {
          state.indeterminate =
            !!val.length && val.length < plainOptions2.length;
          state.checkAll = val.length === plainOptions2.length;
        }
      }
    );

    return {
      handleChange,
      predict,
      clear,
      fileList,
      fileNameList,
      modeValue,
      prebtn,
      resetbtn,
      disbtn,
      btnLoading,
      imageList,
      ...toRefs(state),
      plainOptions1,
      plainOptions2,
      onCheckAllChange,
      onRatioChange,
      onRatioGruopChange,
      data,
      columns,
      columns1,
      columns2,
      downloadimgs,
      noaction,
      visible,
      openInstruction,
      handleOk,
      uploadError,
      beforeUpload,
      baseUrl: baseUrl,
      checkGPU,
      GPUstatus,
      dotCount,
    };
  },
});
</script>

<style lang="scss">
.main {
  background: #f5f5f5;
  min-height: 150vh;
  max-height: max-content;
  width: 100wh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .header {
    background: black;
    height: 9vh;
    width: 100%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .center {
    height: max-content;
    width: 73vw;
    background: white;
    margin: 0 auto;
    border-radius: 0.65vw;
    .center-head {
      height: 8vh;
      border-bottom: 0.065vw solid #f5f5f5;
      display: flex;
      align-items: center;
      font-size: 1.04vw;
      padding-left: 1.625vw;
      padding-right: 1.625vw;
      .title {
        font-weight: 500;
      }
    }
    .center-part {
      width: 65%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      .tip {
        margin-top: 1.5vw;
        margin-bottom: 0.78vw;
        font-size: 1.3vw;
        font-weight: 500;
      }
      .mode {
        border-radius: 0.975vw;
        margin-bottom: 0.715vw;
      }
      .features {
        margin-top: 0.715vw;
        margin-bottom: 0.715vw;
      }
      .upload {
        height: 180px;
        border-radius: 0.65vw;
      }
      .btn {
        margin-top: 0.975vw;
        padding-bottom: 1.625vw;
        display: flex;
        justify-content: center;
        .reset {
          border-radius: 0.325vw;
          width: 5.2vw;
        }
        .pred {
          margin-left: 0.65vw;
          border-radius: 0.325vw;
          width: 5.2vw;
        }
      }
      .file {
        padding-bottom: 1.625vw;
        font-size: 1.105vw;
        display: flex;
        align-items: center;
        div {
          font-weight: 500;
        }
      }
      .res_imgs {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 0.975vw;
        .res_img {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          margin-bottom: 0.65vw;
          img {
            width: 8.9vw;
            margin-right: 0.59vw;
          }
          &:last-child {
            img {
              width: 8.9vw;
            }
          }
          div {
            margin: 0 auto;
          }
        }
      }
    }
    .table {
      margin: 0 auto;
      min-width: 65%;
      max-width: max-content;
      padding-bottom: 0.975vw;
    }
  }
  .footer {
    margin-top: auto;
    margin-bottom: 1.625vw;
    padding-top: 6.5vw;
  }
}
</style>
