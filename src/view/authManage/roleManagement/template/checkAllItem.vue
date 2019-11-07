<template>
    <div v-if="childDataGroup.child && childDataGroup.child.length>0">
        <div >
            <Divider orientation="left" class="custom-class">
                <Checkbox 
                :indeterminate="indeterminate"
                :value="checkAll"
                :disabled = "!disableFlag"
                @click.prevent.native="handleCheckAll">{{dataGroup.name}}</Checkbox>
            </Divider>
            <!-- <input type="text" name="" id="" hidden> -->
            <!-- hidden -->
            <div hidden>
                <input  type="text"  v-model="secondActionId" />
            </div>
             
        </div>
        <CheckboxGroup v-model="$store.state.checkArrData" @on-change="checkAllGroupChange">
            <template  >
                <div>
                 <Row type="flex" justify="space-between" class="code-row-bg">
                    <i-Col span="6" v-for="(item,key) in childDataGroup.child" :value="key" :key="key" >
                    <Checkbox :label="item.actionId" :disabled= "!disableFlag">{{item.name}}</Checkbox>
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
    import store from '../store/index'
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
        this.splice(index, 1);
        }
    };
    export default {
        store,
        props:["dataGroup","firstActionId","disableFlag"],
        
        data () {
            return {
                indeterminate: false,
                checkAll: false,
                // childCheckAllGroup:this.checkAllGroup,
                childDataGroup:this.dataGroup,
                secondActionId:this.dataGroup.actionId,
                selectData:[],
                firstActionKey:'',
            }
        },
        methods: {
            
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    if(this.$store.state.checkArrData.indexOf(this.secondActionId) == -1){
                        this.$store.state.checkArrData.push(this.secondActionId)
                    }
                    if(this.childDataGroup.child){
                        for (let index = 0; index < this.childDataGroup.child.length; index++) {
                            var ele = this.childDataGroup.child[index].actionId;
                            // if(this.childCheckAllGroup.indexOf(ele) == -1){
                            //     this.childCheckAllGroup.push(this.childDataGroup.child[index].actionId)
                            // }
                            
                            if(this.$store.state.checkArrData.indexOf(ele) == -1){
                                this.$store.state.checkArrData.push(this.childDataGroup.child[index].actionId)
                            }
                           
                        }
                    }

                    if(this.firstActionKey!==undefined){
                        if(this.$store.state.checkSecondArr[this.firstActionKey]!==undefined){
                            let arr = [];
                            arr=this.$store.state.checkSecondArr[this.firstActionKey]
                            if(arr.indexOf(this.secondActionId) == -1){
                                arr.push(this.secondActionId)
                            }
                            
                            this.$store.state.checkSecondArr[this.firstActionKey] =arr;
                        }
                    }
                } else {
                    if(this.$store.state.checkArrData.indexOf(this.secondActionId) !== -1){
                        this.$store.state.checkArrData.remove(this.secondActionId)
                    }
                    // 这里移除当前全选下的所有
                    if(this.childDataGroup.child){
                        // for (let index = 0; index < this.childDataGroup.child.length; index++) {
                        //     this.childCheckAllGroup.remove(this.childDataGroup.child[index].actionId)
                        // }
                        for (let index = 0; index < this.childDataGroup.child.length; index++) {
                            this.$store.state.checkArrData.remove(this.childDataGroup.child[index].actionId)
                        }
                    }
                    var ele = this.secondActionId;
                    if(this.$store.state.checkArrData.indexOf(ele) !== -1){
                        this.$store.state.checkArrData.remove(ele)
                    }

                    if(this.firstActionKey!==undefined){
                        if(this.$store.state.checkSecondArr[this.firstActionKey]!==undefined){
                            let arr = [];
                            arr=this.$store.state.checkSecondArr[this.firstActionKey]
                            if(arr.indexOf(this.secondActionId) !== -1){
                                arr.remove(this.secondActionId)
                            }
                            this.$store.state.checkSecondArr[this.firstActionKey] =arr;
                        }
                    }
                    
                }

                this.changArrValue();
            },
            checkAllGroupChange (data) {

                if(!this.isContained(data,this.selectData)){
                    var ele = this.secondActionId;
                        if(this.$store.state.checkArrData.indexOf(ele) !== -1){
                            this.$store.state.checkArrData.remove(ele)
                        }
                }
                // data.length === this.childDataGroup.child.length
                // if (data.length === this.selectData.length) {
                //     this.indeterminate = false;
                //     this.checkAll = true;
                // } else 
                
                // if (data.length > 0) {
                    if(this.isContained(data,this.selectData)){
                        this.indeterminate = true;
                        this.checkAll = false;
                        // 选中的有值，把二级的actionId 加上
                        var ele = this.secondActionId;
                        if(this.$store.state.checkArrData.indexOf(ele) == -1){
                            this.$store.state.checkArrData.push(ele)
                        }
                        if(this.firstActionKey!==undefined){
                            if(this.$store.state.checkSecondArr[this.firstActionKey]!==undefined){
                                let arr = [];
                                arr=this.$store.state.checkSecondArr[this.firstActionKey]
                                if(arr.indexOf(this.secondActionId) == -1){
                                    arr.push(this.secondActionId)
                                }
                                
                                this.$store.state.checkSecondArr[this.firstActionKey] =arr;
                            }
                        }
                    }else{
                        this.indeterminate = false;
                        var ele = this.secondActionId;
                        if(this.$store.state.checkArrData.indexOf(ele) !== -1){
                            this.$store.state.checkArrData.remove(ele)
                        }
                        if(this.firstActionKey!==undefined){
                            if(this.$store.state.checkSecondArr[this.firstActionKey]!==undefined){
                                let arr = [];
                                arr=this.$store.state.checkSecondArr[this.firstActionKey]
                                if(arr.indexOf(this.secondActionId) !== -1){
                                    arr.remove(this.secondActionId)
                                }
                                this.$store.state.checkSecondArr[this.firstActionKey] =arr;
                            }
                        }
                    }
                    
                // } 
                
                // else {
                //     console.log('ssasdad21')
                //     this.indeterminate = false;
                //     this.checkAll = false;
                //     // 不选中的话把当前的二级actionId 移除
                //     var ele = this.secondActionId;
                //     if(this.$store.state.checkArrData.indexOf(ele) !== -1){
                //         this.$store.state.checkArrData.remove(ele)
                //         // data.remove(ele)

                //     }
                // }

                // 判断当前的 数组是否有值 否则移除
                this.changArrValue()

            },
            // 获取当前可选的所有数据
            getSelectData(){
                let arr = [];
                if(this.childDataGroup.child){
                    for (let index = 0; index < this.childDataGroup.child.length; index++) {
                       arr.push(this.childDataGroup.child[index].actionId) 
                    }
                }
                this.selectData = arr;
            },
            isContained(array1, array2){
                let status = false;
                for (let index = 0; index < array1.length; index++) {
                    const element = array1[index];
                    if(array2.indexOf(element) !== -1){
                        status = true;
                    }
                }  
                return status
            },
            // 判断当前的 数组是否有值 否则移除
            changArrValue(){
                if(this.firstActionKey!==undefined){
                    if(this.$store.state.checkSecondArr[this.firstActionKey]!==undefined){
                        let arr = [];
                        arr=this.$store.state.checkSecondArr[this.firstActionKey];
                        if(arr.length>0){
                            // 添加一级
                            if(this.$store.state.checkArrData.indexOf(this.firstActionId) == -1){
                                this.$store.state.checkArrData.push(this.firstActionId)
                            }
                        }else{
                            // 移除一级
                            if(this.$store.state.checkArrData.indexOf(this.firstActionId) !== -1){
                                this.$store.state.checkArrData.remove(this.firstActionId)
                            }
                            
                        }
                    }
                }
            },
            // 第一次进来判断二级是否选中
            changeIndeterminate(){
                // if(){}
                
                 if(this.isContained(this.$store.state.checkArrData,this.selectData)){
                    //  this.indeterminate=true;
                    this.indeterminate = true;
                    if(this.$store.state.checkArrData.indexOf(this.secondActionId) == -1){
                        this.$store.state.checkArrData.push(this.secondActionId)
                       
                    }
                     
                     if(this.firstActionKey!==undefined){
                         if(this.$store.state.checkSecondArr[this.firstActionKey]!==undefined){
                            let arr = [];
                            arr=this.$store.state.checkSecondArr[this.firstActionKey]
                            if(arr.indexOf(this.secondActionId) == -1){
                                arr.push(this.secondActionId)
                            }
                            
                            this.$store.state.checkSecondArr[this.firstActionKey] =arr;
                         }
                     }
                    
                    
                 }
            }
            
        },
        mounted () {
            
            // console.log("firstActionId is "+this.firstActionId)
            if(this.firstActionId!==undefined){
                this.firstActionKey='firstKey'+this.firstActionId;
                // console.log("this.firstActionKey is "+this.firstActionKey);
                if(!this.$store.state.checkSecondArr.hasOwnProperty(this.firstActionKey)){
                    this.$store.state.checkSecondArr[this.firstActionKey]=[]
                    // console.log(this.$store.state.checkSecondArr)
                }
               
            }
            this.getSelectData();
            this.changeIndeterminate();
        }
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
</style>
