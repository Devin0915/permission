<template>
    <div>
        <div >
            <Divider orientation="left" class="custom-class">
                <Checkbox 
                :indeterminate="indeterminate"
                :value="checkAll"
                 @click.prevent.native="handleCheckAll">{{dataGroup.name}}</Checkbox>
            </Divider>
        </div>
        <CheckboxGroup v-model="checkGroupValue" @on-change="checkAllGroupChange"  :class="{'out-modal-check':isActive}">
            <template  >
                <div>
                 <Row type="flex" justify="space-between" class="code-row-bg">
                    <i-Col span="6" v-for="(item,key) in childDataGroup.child" :value="key" :key="key" >
                    <Checkbox :label="item.actionId">{{item.name}}</Checkbox>
                    </i-Col>
                </Row>
                </div>
                
            </template>
            <!-- <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            </div> -->
        </CheckboxGroup>
        <div style="padding-bottom:6px;margin-bottom:6px;"></div>
    </div>
</template>
<script>
    // import store from '../store/index'
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
        this.splice(index, 1);
        }
    };
    export default {
        // store,
        props:["dataGroup",],
        
        data () {
            return {
                indeterminate: true,
                checkAll: false,
                isActive:true,
                // childCheckAllGroup:this.checkAllGroup,
                childDataGroup:this.dataGroup,
                checkGroupValue : [],
                checkTitleId:'',
            }
        },
        methods: {
           
            handleCheckAll(){
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    if( this.$store.state.memberViewPermission.disableActionArr.includes(this.dataGroup.actionId)){
                         this.$store.state.memberViewPermission.disableActionArr.remove(this.dataGroup.actionId)
                    }
                    if(this.childDataGroup.child.length>0){
                        for (let index = 0; index < this.childDataGroup.child.length; index++) {
                            var ele = this.childDataGroup.child[index].actionId;
                            // if(this.childCheckAllGroup.indexOf(ele) == -1){
                            //     this.childCheckAllGroup.push(this.childDataGroup.child[index].actionId)
                            // }
                            
                            if(this.checkGroupValue.indexOf(ele) == -1){
                                this.checkGroupValue.push(this.childDataGroup.child[index].actionId)
                            }
                            if( this.$store.state.memberViewPermission.disableActionArr.includes(ele)){
                                this.$store.state.memberViewPermission.disableActionArr.remove(ele)
                            }
                           
                        }
                    }
                } else {
                    if(!this.$store.state.memberViewPermission.disableActionArr.includes(this.dataGroup.actionId)){
                        this.$store.state.memberViewPermission.disableActionArr.push(this.dataGroup.actionId)
                    }
                    // 这里移除当前全选下的所有
                    if(this.childDataGroup.child.length>0){
                        // for (let index = 0; index < this.childDataGroup.child.length; index++) {
                        //     this.childCheckAllGroup.remove(this.childDataGroup.child[index].actionId)
                        // }
                        for (let index = 0; index < this.childDataGroup.child.length; index++) {
                            var ele = this.childDataGroup.child[index].actionId;
                            this.checkGroupValue.remove(this.childDataGroup.child[index].actionId)
                            if(!this.$store.state.memberViewPermission.disableActionArr.includes(ele)){
                                this.$store.state.memberViewPermission.disableActionArr.push(ele)
                            }
                        }
                    }
                    
                }
            },
            checkAllGroupChange (data,currentDom) {
                if (data.length === this.childDataGroup.child.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                if(this.childDataGroup.child.length>0){
                    let childArr = []
                    for(let i = 0;i<this.childDataGroup.child.length;i++){
                            childArr.push(this.childDataGroup.child[i].actionId)
                    }
                    for(let j = 0 ;j<childArr.length;j++){
                        if(!data.includes(childArr[j])&&!this.$store.state.memberViewPermission.disableActionArr.includes(childArr[j])){
                            this.$store.state.memberViewPermission.disableActionArr.push(childArr[j])
                        }else if(data.includes(childArr[j])&&this.$store.state.memberViewPermission.disableActionArr.includes(childArr[j])){
                            this.$store.state.memberViewPermission.disableActionArr.remove(childArr[j])
                        }
                    }
                    if(data.length==0){
                        if(!this.$store.state.memberViewPermission.disableActionArr.includes(this.dataGroup.actionId)){
                            this.$store.state.memberViewPermission.disableActionArr.push(this.dataGroup.actionId)
                        }
                    }
                    if(data.length==childArr.length){
                        if(this.$store.state.memberViewPermission.disableActionArr.includes(this.dataGroup.actionId)){
                            this.$store.state.memberViewPermission.disableActionArr.remove(this.dataGroup.actionId)
                        }
                    }
                    if(data.length<childArr.length&&data.length>0){
                        if(this.$store.state.memberViewPermission.disableActionArr.includes(this.dataGroup.actionId)){
                            this.$store.state.memberViewPermission.disableActionArr.remove(this.dataGroup.actionId)
                        }
                    }
                }
            },
            getCheckGroupValue(){
                let dataGroupArr = []
                if(this.dataGroup.child.length>0){
                    for(let i = 0;i<this.dataGroup.child.length;i++){
                        dataGroupArr.push(this.dataGroup.child[i].actionId)
                    }
                    for(let j = 0;j<this.$store.state.memberViewPermission.disableActionArr.length;j++){
                        if(dataGroupArr.includes(this.$store.state.memberViewPermission.disableActionArr[j])){
                            dataGroupArr.remove(this.$store.state.memberViewPermission.disableActionArr[j])
                        }
                    }
                }
                if(this.$store.state.memberViewPermission.disableAction.includes(this.dataGroup.actionId)){
                    dataGroupArr = []
                }
                this.checkGroupValue =  dataGroupArr               
            },
            checkFalg(){
                if(this.$store.state.memberViewPermission.disableAction.includes(this.dataGroup.actionId)){
                    this.checkAll = false;
                    this.indeterminate = false;
                }
                if(this.dataGroup.child.length>this.checkGroupValue.length&&this.checkGroupValue.length>0){
                    this.checkAll = false;
                    this.indeterminate = true;
                }
                if(this.dataGroup.child.length==this.checkGroupValue.length&&this.checkGroupValue.length>0){
                    this.checkAll = true;
                    this.indeterminate = false;
                }
            },
        },
        mounted() {
            this.$store.state.memberViewPermission.disableActionArr = this.$store.state.memberViewPermission.disableAction
            this.getCheckGroupValue()
            this.checkFalg()
           
        },
    }
</script>
<style>
.custom-class.ivu-divider-horizontal.ivu-divider-with-text-left:before {
    width: 0%;
}
.custom-class.ivu-divider-horizontal.ivu-divider-with-text-left .ivu-divider-inner-text, .custom-class.ivu-divider-horizontal.ivu-divider-with-text-right .ivu-divider-inner-text {
    display: inline-block;
    padding: 0px 0px;
}
.out-modal-check .ivu-divider-inner-text .ivu-checkbox-indeterminate .ivu-checkbox-inner:after {
    content: "";
    width: 8px;
    height: 1px;
    -webkit-transform: scale(1);
    transform: scale(1);
    position: absolute;
    left: 2px;
    top: 5px;
}
</style>
