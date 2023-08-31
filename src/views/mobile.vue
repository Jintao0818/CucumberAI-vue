<template>
  <!-- 顶部 -->
  <var-app-bar round>
    CucumberAI
    <template #left>
      <var-button round text color="transparent" text-color="#fff">
        <var-icon name="menu" :size="24" />
      </var-button>
    </template>

    <template #right>
      <var-badge v-if="GPUstatus" type="danger" dot color="#52C41A" />
      <var-badge v-else type="danger" dot />
      &nbsp;GPU Server&nbsp;
    </template>
  </var-app-bar>

  <!-- 设置 -->
  <div v-show="active == '0'">
    <var-space direction="column" :size="[14, 0]">
      <var-cell style="color: #888888" border> Necessary Settings</var-cell>
      <var-select
        class="select"
        variant="outlined"
        placeholder="Mode"
        v-model="modeValue"
        @change="changeMode"
      >
        <var-option label="fruit" />
        <var-option label="pulp" />
      </var-select>
      <var-select
        class="select"
        variant="outlined"
        placeholder="Characteristics"
        v-model="characterValue"
        :rules="[(v) => v.length >= 1 || 'choose 1 at least']"
        v-if="modeValue == 'fruit'"
        chip
        multiple
        ><var-option label="fruit shape" />
        <var-option label="color & texture" />
        <var-option label="stripe" />
        <var-option label="tumor" />
      </var-select>
      <var-select
        class="select"
        variant="outlined"
        placeholder="Characteristics"
        v-model="characterValue"
        :rules="[(v) => v.length >= 1 || 'choose 1 at least']"
        v-else-if="modeValue == 'pulp'"
        chip
        multiple
        ><var-option label="pulp shape" />
        <var-option label="flesh & heart" />
      </var-select>
      <var-select
        class="select"
        variant="outlined"
        placeholder="Characteristics"
        disabled
        v-else
      >
      </var-select>
      <var-cell style="color: #888888" border> Others</var-cell>
      <var-select
        class="select"
        variant="outlined"
        placeholder="Image Compression Size(KB)"
        v-model="compressionSize"
        ><var-option label="320" />
        <var-option label="640" />
        <var-option label="1024" />
        <var-option label="1536" />
        <var-option label="2048" />
      </var-select>
    </var-space>
  </div>

  <!-- 主页 -->
  <div v-show="active == '1'">
    <var-image class="logo" src="img/mobile/LOGO.png" width="35vw" />
    <var-image
      class="title-img"
      src="img/mobile/title.png"
      fit="fill"
      height="11vw"
      width="80vw"
    />
    <var-uploader
      class="uploader"
      v-model="files"
      @before-read="handleBeforeRead"
      @after-read="takePhoto"
      hide-list="true"
      v-if="modeValue != '' && characterValue != ''"
    >
      <var-button class="photo-btn" type="primary"
        ><var-icon name="camera-outline" size="125%"
      /></var-button>
    </var-uploader>
    <var-button v-else @click="checkSetting" class="photo-btn" type="primary"
      ><var-icon name="camera-outline" size="125%"
    /></var-button>
  </div>

  <!-- 使用指南 -->
  <div v-show="active == '2'">
    <var-space direction="column" :size="[14, 0]">
      <var-cell style="color: #888888" border>Sample image</var-cell>
      <var-card
        class="sample-img"
        title="Fruit Image"
        description="A cleaner black background is needed, with the green card on top and the cucumber on the bottom, with the cucumber handle facing left and the tip facing right horizontally."
        src="img/mobile/sample.png"
        ripple
      />
      <var-cell style="color: #888888" border>Steps</var-cell>
      <var-steps direction="vertical" :active="activeStep" class="step-bar">
        <var-step
          >Select a mode and one character at least on 'Steeings'
          page.</var-step
        >
        <var-step
          >Press the button on 'Home' page to take a photo and edit it, when
          finished it will be automatically uploaded and analyzed.Please wait
          patiently.</var-step
        >
        <var-step>Resulting images and tables will be displayed.</var-step>
      </var-steps>
      <var-button class="select" type="primary" block @click="next"
        >Next</var-button
      >
    </var-space>
  </div>

  <!-- <div v-show="active == '3'">
    <var-space class="loading" justify="center" align="center">
      <var-loading type="wave" />Analyzing
    </var-space>
  </div> -->

  <!-- 结果展示 -->
  <div v-if="active == '3'">
    <var-space direction="column" :size="[14, 0]">
      <var-cell style="color: #888888" border>Result images</var-cell>
      <var-swipe class="swipe-container" :class="`var-elevation--3`">
        <var-swipe-item
          v-for="(value, key) in resultData.imgdata[0]"
          :key="key"
        >
          <img class="swipe-image" :src="'data:image/jpg;base64,' + value" />
        </var-swipe-item>
      </var-swipe>

      <var-cell style="color: #888888" border>Result Data</var-cell>
      <var-tabs
        class="select"
        elevation
        color="var(--color-primary)"
        active-color="#fff"
        inactive-color="hsla(0, 0%, 100%, .6)"
        v-model:active="activeCard"
        scrollable="always"
      >
        <var-tab v-for="item in characterValue" :key="item">{{ item }}</var-tab>
      </var-tabs>

      <var-tabs-items
        v-if="active == '3'"
        v-model:active="activeCard"
        class="select"
      >
        <var-tab-item v-if="characterValue.includes('fruit shape')">
          <var-table>
            <tbody>
              <tr v-for="(value, key) in resultData.fruit_data" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </var-table>
        </var-tab-item>
        <var-tab-item v-if="characterValue.includes('color & texture')">
          <var-table>
            <tbody>
              <tr v-for="(value, key) in resultData.ct_data" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </var-table>
        </var-tab-item>
        <var-tab-item v-if="characterValue.includes('stripe')">
          <var-table>
            <tbody>
              <tr v-for="(value, key) in resultData.stripe_data" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </var-table>
        </var-tab-item>
        <var-tab-item v-if="characterValue.includes('tumor')">
          <var-table>
            <tbody>
              <tr v-for="(value, key) in resultData.tumor_data" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </var-table>
        </var-tab-item>
        <var-tab-item v-if="characterValue.includes('pulp shape')">
          <var-table>
            <tbody>
              <tr v-for="(value, key) in resultData.pulp_data" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </var-table>
        </var-tab-item>
        <var-tab-item v-if="characterValue.includes('flesh & heart')">
          <var-table>
            <tbody>
              <tr v-for="(value, key) in resultData.heart_data" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </var-table>
        </var-tab-item>
      </var-tabs-items>
      <var-cell style="color: #888888" border>Data Download</var-cell>
      <var-button
        class="download"
        type="primary"
        size="small"
        @click="downloadFile"
        >Download</var-button
      >
      <var-back-top :duration="300" />
    </var-space>
  </div>

  <!-- 图片裁剪弹出框 -->
  <var-popup
    class="cropper"
    overlay-class="popup-example-custom-overlay"
    v-model:show="displayCropModal"
  >
    <VuePictureCropper
      :boxStyle="{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f8f8',
        margin: 'auto',
      }"
      :img="pic"
      :options="{
        viewMode: 1,
        dragMode: 'move',
        movable: false,
        autoCropArea: 0.8,
      }"
      :presetMode="{
        mode: 'fixedSize',
      }"
    />

    <var-row>
      <var-col :span="5" :offset="2"
        ><var-button
          class="corpper-btn"
          type="primary"
          size="small"
          @click="rorateImg(-1)"
          >Left</var-button
        ></var-col
      >
      <var-col :span="5"
        ><var-button
          class="corpper-btn"
          type="primary"
          size="small"
          @click="rorateImg(1)"
          >Right</var-button
        ></var-col
      >
      <var-col :span="5"
        ><var-button
          class="corpper-btn"
          type="primary"
          size="small"
          @click="handleModalSure"
          >Sure</var-button
        ></var-col
      >
      <var-col :span="5"
        ><var-button
          class="corpper-btn"
          type="primary"
          size="small"
          @click="handleModalCancel"
          >Cancel</var-button
        ></var-col
      >
    </var-row>
  </var-popup>

  <!-- 底部导航 -->
  <div class="bottom"></div>
  <div class="bottom-bar">
    <var-bottom-navigation
      :class="`var-elevation--7`"
      v-model:active="active"
      fixed
      safe-area
    >
      <var-bottom-navigation-item label="Steeings" icon="cog" />
      <var-bottom-navigation-item label="Home" icon="home" />
      <var-bottom-navigation-item label="Instructions" icon="help-circle" />
      <var-bottom-navigation-item v-show="false" label="a" icon="help-circle" />
      <var-bottom-navigation-item v-show="false" label="a" icon="help-circle" />
    </var-bottom-navigation>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, reactive, toRefs } from 'vue';
import { Snackbar } from '@varlet/ui';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
import cont from '../api/cont';
import utils from '../utils/utils';
import * as imageConversion from 'image-conversion';
import '@varlet/ui/es/styles/elevation.css';

export default defineComponent({
  components: { VuePictureCropper },
  setup(props, context) {
    const files = ref([]);
    const overlayClass = ref(false);
    const pic = ref(''); //裁剪插件图片源
    const GPUstatus = ref(false);
    const state = reactive({
      displayCropModal: false, // 弹框是否可见
      degreeNum: 0, // 旋转度数的次数
      onLoading: false, // 是否加载中
      imgSize: 300, // 图片固定宽高
    });
    const fileName = ref('');
    const active = ref(1);
    const modeValue = ref('');
    const characterValue = ref([]);
    const compressionSize = ref('640');
    const activeStep = ref(0);
    const activeCard = ref(0);
    const resultData = ref('');
    const downloadUrl = ref('');

    const downloadFile = () => {
      const element = document.createElement('a');
      element.href = downloadUrl.value;
      element.download = modeValue.value + '.xlsx';
      element.target = '_blank';
      element.click();
    };

    const checkSetting = () => {
      Snackbar.warning('Select mode and characteristic at first!');
      active.value = 0;
    };

    function next() {
      activeStep.value = (activeStep.value + 1) % 3;
    }

    function handleBeforeRead(file) {
      fileName.value = file.name;
      return new Promise((resolve) => {
        // 压缩到640KB
        imageConversion
          .compressAccurately(file.file, Number(compressionSize.value))
          .then((res) => {
            resolve(res);
          });
      });
    }

    //图片字符串转化为Bolb(裁剪插件只能接收此类型)
    const dataURLtoBlob = (dataURL) => {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    };

    const takePhoto = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        pic.value = file.url;
        let img = new Image();
        img.src = file.url;
        state.displayCropModal = true;
      };
      reader.readAsDataURL(dataURLtoBlob(file.url));
    };

    const rorateImg = async (num) => {
      state.degreeNum += num;
      cropper.rotateTo((state.degreeNum % 4) * 90);
    };

    const handleModalSure = async () => {
      if (state.onLoading) return;
      state.onLoading = true;
      Snackbar.loading('Uploading image...');

      const base64 = cropper.getDataURL();
      // const blob = await cropper.getBlob();
      // const file = await cropper.getFile();

      // context.emit('handleModalSure', file);
      cont
        .upload({ data: base64.split(',')[1], name: fileName.value })
        .then((res) => {
          console.log(res);
          Snackbar.success('Upload success!');

          const metrics = characterValue.value;
          Snackbar.loading('Analyzing image...');
          cont
            .predict({
              UA: 'mobile',
              mode: modeValue.value,
              metrics: metrics,
              names: [fileName.value],
            })
            .then((res) => {
              Snackbar.success('Analyze success!');
              console.log(res);
              resultData.value = res.data;
              // Excel下载链接更新
              // const link = document.getElementById('downloadexcel');
              downloadUrl.value =
                'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
                res.data.excel;
              active.value = 3;
            })
            .catch((error) => {
              console.log(error);
              Snackbar.error('Analyze failed!');
              active.value = 1;
            });
        })
        .catch((error) => {
          console.log(error);
          Snackbar.error('Upload failed!');
          active.value = 1;
        });
      // files.value = [];
      // fileName.value = '';
      state.displayCropModal = false;
      state.onLoading = false;
    };
    // 裁剪框-取消
    const handleModalCancel = () => {
      // context.emit('handleModalCancel');
      state.displayCropModal = false;
    };

    //检查GPU服务器状态
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

    const changeMode = () => {
      characterValue.value = [];
    };

    onMounted(() => {
      checkGPU();
      setInterval(() => {
        checkGPU();
      }, 1800000);
    });

    return {
      takePhoto,
      files,
      overlayClass,
      pic,
      ...toRefs(state),
      dataURLtoBlob,
      rorateImg,
      handleModalCancel,
      handleModalSure,
      GPUstatus,
      checkGPU,
      handleBeforeRead,
      fileName,
      active,
      modeValue,
      characterValue,
      changeMode,
      compressionSize,
      activeStep,
      checkSetting,
      activeCard,
      next,
      resultData,
      downloadUrl,
      downloadFile,
    };
  },
});
</script>

<style lang="scss">
#app {
  background: #f8f8f8;
  min-height: 100vh;
  max-height: max-content;
  // height: max-content;
  // display: flex;
  // flex-direction: column;
}

.logo {
  margin: 10vh auto 5vh;
}

.title-img {
  margin-left: 10vw;
  margin-bottom: 15vh;
}

.photo-btn {
  width: 20vw;
  height: 20vw;
  border-radius: 35%;
  font-size: 20px;
  margin-left: 40vw;
}

.popup-example-custom-overlay {
  background: rgba(0, 0, 0, 0.3) !important;
}
.cropper {
  border-radius: 5px;
  padding: 10px 10px 0 10px;
}
.var-row {
  width: 100%;
  .var-col {
    justify-content: center;
    align-items: center;
    height: 15vw;
    color: #fff;
    text-align: center;
    background-clip: content-box !important;
    .corpper-btn {
      width: 85%;
    }
  }
}

.select {
  width: 90vw;
  margin: 0 auto;
}
// .loading {
//   padding-top: 35vh;
//   font-size: 20px;
// }
.sample-img {
  width: 90vw;
  margin: 0 auto;
}

.step-bar {
  width: 90vw;
  margin: 0 auto;
  .var-step:not(:last-of-type) {
    margin-bottom: 3vw;
  }
}

.swipe-container {
  width: 90vw;
  height: max-content;
  margin: 0 auto;
  background: #fff;
  padding-left: 18vw;
  border-radius: 5px;
}

.swipe-image {
  width: 60%;
  // height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.download {
  margin-left: 5vw;
}

.bottom {
  background: #f8f8f8;
  height: 25vw;
}
// .bottom-bar {
//   position: fixed;
//   bottom: 0;
//   width: 100vw;
// }
</style>
