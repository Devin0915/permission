<template>

    <div>
         <template >
                    <Row type="flex" class="code-row-bg"  >
                        <CheckboxGroup v-model="departments" @on-change='changeshopitem'>
                        <i-col style="margin: 6px;" span="24" v-for="(item,index,key) in departmentData" :key="key">
                            <Checkbox :label="item.id" :class="{'out-modal-check':isActive}">
                                <span style="margin: 2px;">{{item.name}}</span>
                            </Checkbox>
                        </i-col>
                        </CheckboxGroup>
                    </Row>
        </template>
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
  props: ['departmentData', 'parameterName'],
  data () {
    return {
      keywords: '',
      departments: [],
      isActive: true,
      disDepartmentsArr: []
      // this.$store.state.viewPermission.accountIds
    }
  },
  // watch:{
  //     departments: {
  //         deep: true,
  //         handler: function (newVal,oldVal){
  //             this.$store.state.memberViewPermission.departmentIds = newVal;
  //         }
  //     }
  // },
  methods: {
    departmentDataValue () {
      let departmentDataValue = []
      let departmentDataValueArr = []
      for (var i = 0; i < this.departmentData.length; i++) {
        departmentDataValueArr.push(this.departmentData[i].id)
      }
      for (var i = 0; i < departmentDataValueArr.length; i++) {
        if (!this.disDepartmentsArr.includes(departmentDataValueArr[i])) {
          departmentDataValue.push(departmentDataValueArr[i])
        }
      }
      return departmentDataValue
    },
    changeshopitem (data) {
      for (var i = 0; i < data.length; i++) {
        if (!this.departmentDataValue().includes(data[i])) {
          this.disDepartmentsArr.remove(data[i])
        }
      }
      for (var i = 0; i < this.departmentDataValue().length; i++) {
        if (!data.includes(this.departmentDataValue()[i])) {
          this.disDepartmentsArr.push(this.departmentDataValue()[i])
        }
      }
    },
    getDisableValue () {
      //  this.$store.state.memberViewPermission.disableDepartment = this.disDepartmentsArr
      this.$store.state.memberViewPermission.disableData[this.parameterName] = this.disDepartmentsArr
    }
  },
  computed: {
    getTotal () {
      return this.$store.state.memberViewPermission
    }
  },
  mounted () {

    this.disDepartmentsArr = this.$store.state.memberViewPermission.disableData[this.parameterName]
    this.departments = this.departmentDataValue()
  }
}
</script>
