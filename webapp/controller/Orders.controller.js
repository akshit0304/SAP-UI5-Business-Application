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
    return Controller.extend("bd.businessportal.controller.Orders", {
        formatter:Formatter,
        onInit() {
            console.log("dashboard initialized");
            this.main_page =this.byId("order_page");
            this.table =this.byId("table_order");
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

            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    // this.main_page.setBusy();
                }.bind(this)
            });

            // fetch data from 0-data/v2
            this.model_data =this.component.getModel("MD");
            this.table.setBusy(true);
            this.model_data.read("/Orders",{
                urlParameters:{
                   "$expand":"Customer,Employee"
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
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            // console.log(oEvent);
            var oContext = oEvent.getSource().getBindingContext();
            const id =oContext.getProperty("OrderID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("OrdersOverview");
          },
    

    });
})