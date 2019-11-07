<template>
    <div>
            <div>
                <label>关键词：</label>
                <Input v-model="keywords" placeholder="供应商ID" style="width: 160px;margin-right: 18px;
}" />
                <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <div>
                <template >
                   
                        <CheckboxGroup v-model="vendors" @on-change="checkAllGroupChange">
                        <Row type="flex"  class="code-row-bg">
                        <i-col style="margin: 6px;" span="4" v-for="(item,index,key) in vendorData" :key="key">
                            <Checkbox :label="item.vendorId">
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
import store from '../store/index';
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
    this.splice(index, 1);
    }
};
export default {
        store,
        props:["vendorData"],

        data () {
            return {
                keywords:'',
                vendors:[],
                // 需要watch 
                indeterminate: true,
                checkAll: false,
            }
        },
         watch:{
            vendors: {
                deep: true,
                handler: function (newVal,oldVal){
                    this.$store.state.viewPermission.vendorIds = newVal;
                }
            }
        },
        methods: {
                // 过滤，将供应商的 的id 转 字符，不然
                changeClass(vendorCode){
                    if(this.keywords.length !==0){
                        if (vendorCode.includes(this.keywords)) {
                                return "search-arr"
                        }
                    }

                },
                handleCheckAll () {
                    if (this.indeterminate) {
                        this.checkAll = false;
                    } else {
                        this.checkAll = !this.checkAll;
                    }
                    this.indeterminate = false;

                    if (this.checkAll) {
                        for (let index = 0; index < this.vendorData.length; index++) {
                            const element = this.vendorData[index].vendorId;
                            this.vendors.push(element);
                        }
                    } else {
                        this.vendors = [];
                    }
                },
                checkAllGroupChange (data) {
                    if (data.length === this.vendorData.length) {
                        this.indeterminate = false;
                        this.checkAll = true;
                    } else if (data.length > 0) {
                        this.indeterminate = true;
                        this.checkAll = false;
                    } else {
                        this.indeterminate = false;
                        this.checkAll = false;
                    }
                }

        },
        mounted () {
            
            this.vendors = this.$store.state.viewPermission.vendorIds;
            this.checkAllGroupChange (this.vendors);
        }
       
}
</script>
<style >
.search-arr{
    background: #94d4f1;
}
    
</style>