<template>
    <div>
        <!-- <label>组织结构</label> -->
         <template >
                    <Row type="flex" justify="center" class="code-row-bg"  >
                        <CheckboxGroup v-model="departments">
                            <!-- ${dialogTilte}` -->
                            <!-- v-for="(item,index,key) in vendorData" :key="key" -->
                        <i-col style="margin: 6px;" span="16" v-for="(item,key)  in departmentData" :key="key">
                            <Checkbox :label="`${item.id}`" >
                                <span style="margin: 2px;">{{item.name}}</span>
                            </Checkbox>
                        </i-col>
                        </CheckboxGroup>
                    </Row>
        </template>
    </div>
</template>
<script>
import store from '../store/index'
Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
export default {
  store,
  props: ['departmentData', 'departmentIdName'],
  data () {
    return {
      keywords: '',
      departments: []
      // this.$store.state.viewPermission.accountIds
    }
  },
  watch: {
    departments: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.$store.state.viewPermission[this.departmentIdName] = newVal
        // console.log(this.$store.state.viewPermission[this.departmentIdName])
      }
    }
  },
  mounted () {
    // this.departments = this.$store.state.viewPermission.departmentIds;
    let arr = []
    //  console.log(this.departmentIdName)
    if (this.$store.state.viewPermission[this.departmentIdName]) {
      this.$store.state.viewPermission[this.departmentIdName].forEach(element => {
        // console.log(element)
        arr.push(element + '')
      })
    }
    this.departments = arr
  }
}
</script>
