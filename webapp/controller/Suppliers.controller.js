sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
],(Controller,
    JSONModel,
    Formatter,
    Device
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Suppliers", {
        formatter:Formatter,
        onInit() {
            this.main_page =this.byId("supplier_page");
            this.table =this.byId("table_supplier");
            this.component =this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                //   this.table.setWidth("100%");
                }
              },this);
            //   sap.ui.getCore().getEventBus().subscribe("product_loading", "myEvent",this.loaderOff,this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    // this.component._bhide();
                    // this.main_page.setBusy();
                }.bind(this)
            });

            // fetch data from 0-data/v2
            this.model_data =this.component.getModel("MD");
            this.table.setBusy(true);
            this.model_data.read("/Suppliers",{
                urlParameters:{
                   
                },
                success:function(oData){
                    const results =oData["results"];
                    // console.log(results);
                    this.Json = new JSONModel();
                    this.Json.setData({"results":results});
                    // console.log(this.Json.getJSON());
                    this.getView().setModel(this.Json);
                    this.table.setBusy();
                }.bind(this),
                error:function(oError){
                    console.log(oError);
                    this.table.setBusy();
                }.bind(this)
            })       
        },
        onExit(){
            console.log("dashboard exit");
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext();
            // console.log(oContext);
            const id =oContext.getProperty("SupplierID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("SuppliersOverview");
          },
    

    });
})