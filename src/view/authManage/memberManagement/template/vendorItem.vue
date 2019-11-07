<template>
    <div>
            <div>
                <label>关键词：</label>
                <Input v-model="keywords" placeholder="供应商ID" style="width: 160px" />
            </div>
            <div>
                <template >

                        <CheckboxGroup v-model="vendors" @on-change='changeshopitem'>
                        <Row type="flex"  class="code-row-bg">
                        <i-col style="margin: 6px;" span="4" v-for="(item,index,key) in vendorData" :key="key">
                            <Checkbox :label="item.vendorId" :class="{'out-modal-check':isActive}">
                                <span style="margin: 2px;" :class="changeClass(item.vendorCode)" >{{item.vendorCode}}</span>
                            </Checkbox>
                        </i-col>
                          </Row>
                        </CheckboxGroup>

                </template>
            </div>
    </div>
</template>

<script>
// import store from '../store/index';
Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
export default {
  // store,
  props: ['vendorData', 'parameterName'],
  data () {
    return {
      keywords: '',
      vendors: [],
      isActive: true,
      // 需要watch
      disableVendorArr: []
    }
  },
  watch: {
    // vendors: {
    //     deep: true,
    //     handler: function (newVal,oldVal){
    //         this.$store.state.memberViewPermission.disableData[this.parameterName]  = newVal;
    //     }
    // }
  },
  methods: {
    // 过滤，将供应商的 的id 转 字符，不然
    changeClass (vendorCode) {
      if (this.keywords.length !== 0) {
        if (vendorCode.includes(this.keywords.trim())) {
          return 'search-arr'
        }
      }
    },
    vendorsValue () {
      let vendorValue = []
      let vendorValueArr = []
      for (var i = 0; i < this.vendorData.length; i++) {
        vendorValueArr.push(this.vendorData[i].vendorId)
      }
      for (let i = 0; i < vendorValueArr.length; i++) {
        if (!this.disableVendorArr.includes(vendorValueArr[i])) {
          vendorValue.push(vendorValueArr[i])
        }
      }
      return vendorValue
    },
    changeshopitem (data) {
      for (let i = 0; i < data.length; i++) {
        if (!this.vendorsValue().includes(data[i])) {
          this.disableVendorArr.remove(data[i])
        }
      }
      for (let i = 0; i < this.vendorsValue().length; i++) {
        if (!data.includes(this.vendorsValue()[i])) {
          this.disableVendorArr.push(this.vendorsValue()[i])
        }
      }
    },
    getDisableValue () {
      this.$store.state.memberViewPermission.disableData[this.parameterName] = this.disableVendorArr
      //  this.$store.state.memberViewPermission.vendorIds = this.vendors
      // vendorIds
    }

  },
  mounted () {
    this.disableVendorArr = this.$store.state.memberViewPermission.disableData[this.parameterName]
    this.vendors = this.vendorsValue()
  }
}
</script>
<style >
.search-arr{
    background:#2d8cf0;
}

</style>
