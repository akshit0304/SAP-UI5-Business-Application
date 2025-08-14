sap.ui.define([
    "sap/ui/model/Filter"
],
    (Filter) => {
        "use strict"
        return {
        configureModel:function (fileName) {
                const component =this.component;
                const table =this.table;

                const fileSplit =fileName.split(".");
                if(fileSplit[0]==component.loaded_model) return 1;
                if(fileSplit.pop()=="json" && Array.isArray(fileSplit)){
                        table?.setBusy(true);
                        const model = component.getModel();
                        model.loadData("../Odata/"+fileName).then((info)=>{
                        // console.log(info);
                        component.setModel(model);
                        component.loaded_model = fileSplit.pop();
                        table?.setBusy();
                        return 1;
            })
                }
                else{
                    throw new Error("file format is not json type");
                    
                }
            },
            /**
             * 
             * @param {*} fileName 
             * @param {object} IdInfo -type of object contains keyname and keyvalue {key:productsID,value:2}
             * @param {*} that 
             */
            fetchObject:function(fileName,IdInfo,that,flag=1){
                const fileSplit =fileName.split(".");
                let {key,value}=IdInfo;
                let component =that.component;
                const model = component.getModel();

                if(flag && component.loaded_model!=fileSplit[0]){
                    // need to load the model
                    this.configureModel.call(that,fileName);
                }
                // get the object
                const aProducts = model.getProperty("/results");
                console.log(aProducts);
                const aFiltered = aProducts.forEach((item,index) => {
                    return item[key]==value?index:0;
                });
                // console.log(aFiltered);
                return aFiltered;
            }
        }
    });