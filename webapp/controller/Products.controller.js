sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel",
    "sap/ui/Device",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
    "bd/businessportal/utils/GenericFilter",

], (Controller,
    JSONModel,
    Formatter,
    setModel,
    Device,
    BusyIndicator,
    Filter,
    GenericFilter
) => {
    "use strict"
    function _filterModule(that, obj) {
        let filter_bar = that.byId(obj['filterBarId']);
        // console.log(filter_bar.isDialogOpen());
    }
    
    function setLocalModel(that, { modelName, fileName }) {
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
            }

    return Controller.extend("bd.businessportal.controller.Products", {
        formatter: Formatter,
        onInit() {
            console.log("product initialized");
            this.component = this.getOwnerComponent();
            const expandFlag = this.component.expandFlag;
            this.main_page = this.byId("product_page");
            this.root_element = this.component.byId("App");
            this.table = this.byId("table_product");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.oFilter = [];
            Device.media.attachHandler((oEvent) => {
                if (oEvent.name == 'Phone' || oEvent.name == 'Tablet') {
                }
            }, this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            this.getView().addEventDelegate({
                onBeforeShow: function (obj) {
                    BusyIndicator.hide();
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this, "Products.json");
                    // console.log(obj.data);
                    this.oNavContainer.setBusy();


                }.bind(this)
            })

            setLocalModel(this,{
                fileName:"Suppliers.json",
                modelName:"supl"
            }).then((flag)=>{
                if(flag==207) console.log('already not exists');
                else console.log("exists fast load");
            })
        },
        overViewPage: function (oEvent) {
            this.oNavContainer.setBusy(true);
            var oContext_path = oEvent.getSource().getBindingContext().getPath();
            // console.log(oContext);
            // const path =oContext.substr("/results/".length);
            // console.log(path);
            // const id =oContext.getProperty("ProductID");
            const model = this.component.getModel("nav");
            model.setProperty("/idOfBindElement", oContext_path);
            this.root_element.getController()._loadView("ProductsOverview");
            // this.router.navTo("p_overview",{
            //   query:{
            //     "id":encodeURIComponent(id),
            //     "index":parseInt(index)
            //   }
            // })
        },
        filterSearch: function (oEvent) {
            const selection_set = oEvent.getParameters("selectionSet").selectionSet;
            const configuration = {
                configurationProperty: [
                    {
                        controlType: "ComboBox",
                        key: "ProductID",
                        expression: "EQ"
                    },
                    {
                        controlType: "ComboBox",
                        key: "SupplierID",
                        expression: "EQ",
                    },

                ]
            }
            // console.log(oEvent.getParameters("selectionSet"));
            if (!this.genericFilter) {
                this.genericFilter = new GenericFilter(this, this.table);
            }
            const gf = this.genericFilter;
            gf.SET_selectionSet(selection_set);
            gf.configureFilter(configuration);
        },
        //   filterClear:function(oEvent){
        //     console.log("clear event triggered");
        //     this.oFilter=[];
        //     let selection_set =oEvent.getParameters("selectionSet");
        //     selection_set.selectionSet.forEach((control) => {
        //         switch (getControName(control)) {
        //             case "ComboBox":
        //                 control.setSelectedKey();
        //                 break;

        //             default:

        //                 break;
        //         }
        //     });
        //     let oBinding = this.table.getBinding("items");
        //     oBinding.filter([]);

        //   },
        //   selectionChange:function(oEvent){
        //     let oBinding = this.table.getBinding("items");
        //     oBinding.filter([]);
        //     // console.log(oEvent.getParameter("selectedItem"));
        //     let key =oEvent.getSource().getSelectedItem()?.getKey();
        //     console.log(oEvent);
        //     // -------------------
        //     let aFilters = [];
        //     if(!key || key==""){oBinding.filter([]);return 1;}
        //     let oFilter = new Filter("SupplierID", sap.ui.model.FilterOperator.EQ, key);
        //     aFilters.push(oFilter);
        //     oBinding.filter(aFilters);
        //     return 1;

        //   }
        filterClear: function (oEvent) {
            console.log("clear pressed");
            if (!this.genericFilter) {
                this.genericFilter = new GenericFilter(this, this.table);
            }
            const gf =this.genericFilter;
            if(!gf.GET_selectionSet()){
                const selection_set = oEvent.getParameters("selectionSet").selectionSet;
                gf.SET_selectionSet(selection_set);
            }
            gf.resetFilter();
            // gf.clean(); //clean already applied in resetFilter function.
            
        }
    });
})


/* {
    [
{
    controlType:"ComboBox",
    key:"SupplierID" ,
    expression:"EQ",
    value:2  
}
    ]
    }
*/

// let fObj =gf.makeFilterObj("ProductID","EQ",2);
            // gf.addFilter(fObj);
            // gf.applyFilter();