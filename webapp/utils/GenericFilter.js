sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
],
    (FObject,
        JSONModel,
        Filter,
        FO
    ) => {
        "use strict"
         function _getControName(control){
        return control.getMetadata()["_sClassName"].split('.').at(-1);
    }


        return FObject.extend("bd.businessportal.utils.GenericFilter", {
            constructor: function (that = undefined, table) {
                // Call the parent constructor
                sap.ui.base.Object.apply(this, arguments);
                // ... custom initialization ...
                this.oFilter = [];
                this.table =that.table
                this.oBinding = this.table?.getBinding("items");
                this.exMap =this._expressionMapping();
                this.selection_set;
            },
            GET_selectionSet(){
                return this.selection_set;
            },
            SET_selectionSet(ss){
                if(Array.isArray(ss) && ss[0].isA("sap.ui.core.Control")){
                this.selection_set =ss;
                console.log("selection-set set");
                }
            },
            configureFilter(jsonConfig){
                this.clean();
                // this function will iterate over all the control in selection set and set the appropriate filter
                if(!this.selection_set || !jsonConfig){
                     console.log("set the selection_set parameter of filterbar in selection_set variable (let selection_set =oEvent.getParameters(\"selectionSet\");selection_set.selectionSet)");
                     return 0;
                }
                // selection set is exists
                let data =jsonConfig['configurationProperty']
                this.selection_set.forEach((control,index) => {
                    switch (data[index]['controlType']) {
                        case "ComboBox":
                            this.c_ComboBox(control,data[index]);
                            break;
                    
                        default:
                            break;
                    }
                });
                this.applyFilter();
                return "filter apply successfully"
            },
            resetFilter:function(){
                 if(!this.selection_set){
                     console.log("set the selection_set parameter of filterbar in selection_set variable (let selection_set =oEvent.getParameters(\"selectionSet\");selection_set.selectionSet)");
                     return 0;
                }
                 this.selection_set.forEach((control) => {
                    switch (_getControName(control)) {
                        case "ComboBox":
                            this.r_ComboBox(control);
                            break;
                    
                        default:
                            break;
                    }
                });
                this.clean();
                return "filter reset successfully"

            },
            clean() {
                this.oFilter = [];
                this.oBinding.filter([]);
                return 1;
            },
            addFilter(filterObj) {
                this.oFilter.push(filterObj);
            },
            applyFilter() {
                this.oBinding.filter(this.oFilter);
            },
            setLocalModel: function (that, { modelName, fileName }) {
                return new Promise((resolve) => {
                    const own_models = that.getView().getOwnModels();
                    const model_keys = Object.keys(own_models);
                    let view = that.getView();
                    if (modelName in model_keys) {
                        view.getModel(modelName).refresh();
                        resolve(208)
                    }
                    else {
                        let model = new JSONModel();
                        model.loadData(sap.ui.require.toUrl("bd/businessportal/Odata/" + fileName)).then((info) => {
                            view.setModel(model, modelName);
                            resolve(207);
                        })
                    }
                });
            },
            makeFilterObj(key, expression,value,value2=0) {
                if(expression=="BT" || expression=="NB"){
                    return new Filter(key, this.exMap.get(expression), value,value2);
                }
                return new Filter(key,this.exMap.get(expression), value);
            },
            // AND operation for all the filter objects present in "oFilter". 
            combineFilters(){
                return new Filter({
                    filters: this.oFilter,
                    and: true
                })
            },
            _expressionMapping(){
                let expression_hash =new Map();
                expression_hash.set("EQ",FO.EQ);
                expression_hash.set("BT",FO.BT);
                expression_hash.set("NB",FO.NB);

                return expression_hash;
            },


            // control configuration
            // c_ComboBox mean control combo box
            c_ComboBox(control,jsonConfig,keyOrValue=0){
                // zero for key and 1 for value
                const jc =jsonConfig;
                let key =keyOrValue?control.getSelectedItem()?.getText():control.getSelectedItem()?.getKey();
                if(!key || key==""){return 439;}
                if(!keyOrValue) {key =parseInt(key);}
                let fObj =this.makeFilterObj(jc['key'],jc['expression'],key);
                this.addFilter(fObj);
                return 440; //return code mean :combobox is successfully parsed and filter added in oFilter.

            },
            // c_ComboBox mean reset combo box control
            r_ComboBox(control){
                control.setSelectedKey();
            }
        })
    }
)