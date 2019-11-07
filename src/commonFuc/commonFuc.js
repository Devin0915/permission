export const tableHeightFun = (target, filterBox) => {
    target.$nextTick(() => {
        if(target.$refs['tableBox']){
            let tableBoxHeight = window.innerHeight - target.$refs[filterBox].$el.offsetHeight - 171 - 37 - 90;
            let contentBoxHeight =  target.$refs['tableBox'].$el.offsetHeight
            if(tableBoxHeight<=contentBoxHeight){
                target.tableHeight = tableBoxHeight
            }else{
                target.tableHeight = ''  
            }
        }
    })
  }