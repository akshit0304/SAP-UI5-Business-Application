sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/utils/GenericFilter"
],(Controller,
    Formatter,
    Device,
    setModel,
    GenericFilter
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Customers", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("customer_page");
            this.table =this.byId("table_customer");
            // this.root_element =sap.ui.getCore().byId("container-bd.businessportal---App");
            // this.component = sap.ui.core.Component.getOwnerComponentFor(this.root_element);
            this.component =this.getOwnerComponent();
            const expandFlag =this.component.expandFlag;
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                //   this.table.setWidth("100%");
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Customers.json");
                }.bind(this)
            });      
        },
         onAfterRendering:function(){
            GenericFilter.prototype.setLocalModel(this,{fileName:"Countries.json",modelName:"country"}).then((flag) => {
                         if (flag == 207){ console.log('already not exists');}
                    else {console.log("exists fast load");}
                })
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext().getPath();
            // console.log(oContext);
            // const id =oContext.getProperty("EmployeeID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("CustomersOverview");
          },
         filterSearch: function (oEvent) {
            const configuration = {
                configurationProperty: [
                    {
                        controlType: "SearchBox",
                        key: "",
                        expression: ""
                    },
                    {
                        controlType: "ComboBox",
                        key: "Country",
                        keyOrValue:1,
                        expression: "Contains",
                    },
                     {
                        controlType: "ComboBox",
                        key: "City",
                        keyOrValue:1,
                        expression: "Contains",
                    }
                ]
            }
            // console.log(oEvent.getParameters("selectionSet"));
            if (!this.genericFilter) {
                var selection_set = oEvent.getParameters("selectionSet").selectionSet;
                this.genericFilter = new GenericFilter(this, this.table);
                this.genericFilter.SET_selectionSet(selection_set);
            }
            const gf = this.genericFilter;
            gf.configureFilter(configuration);
            gf.applyFilter();
           
        },
          filterClear: function (oEvent) {
            console.log("clear pressed");
            if (!this.genericFilter) {
                this.genericFilter = new GenericFilter(this, this.table);
                const selection_set = oEvent.getParameters("selectionSet").selectionSet;
                this.genericFilter.SET_selectionSet(selection_set);
            }
            const gf = this.genericFilter;
            gf.resetFilter();
        }
    });
})