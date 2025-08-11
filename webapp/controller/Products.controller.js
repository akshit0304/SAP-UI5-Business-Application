sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device"
],(Controller,
    JSONModel,
    Formatter,
    Device
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Products", {
        formatter:Formatter,
        onInit() {
            console.log("dashboard initialized");
            this.main_page =this.byId("product_page");
            console.log(this.getView().getParent());
            this.component =this.getOwnerComponent();
            this.table =this.byId("table_product");
            // this.router = this.component.getRouter();
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                //   this.table.setWidth("100%");
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // set event
            // sap.ui.getCore().getEventBus().subscribe("product_loading", "myEvent",this.loaderOff,this);

            // fetch data from 0-data/v2
            this.model_data =this.component.getModel("MD");
            this.table.setBusy(true);            
            this.model_data.read("/Products",
                {
                    urlParameters: {
                        "$skip": 0,
                        "$expand":"Category,Supplier"
                    },
                    success:function (oData) {
                        const results =oData["results"];
                            this.MSJson = new JSONModel();
                            this.MSJson.setData({"results":results});
                            this.getView().setModel(this.MSJson,'PD');
                            this.table.setBusy();
                    }.bind(this),
                    error:function(oError){
                        console.log(oError);
                        this.table.setBusy();
                    }.bind(this)
                }.bind(this)
            )

            
        },
        onExit(){
            // console.log("dashboard exit");
        },
        onAfterRendering:function(){
            // console.log("application rendered");
        },
        onBeforeRendering:function(){
            // console.log("application before rendered");  
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.table.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext("PD");
            const id =oContext.getProperty("ProductID");
            const index =oContext.getPath().substr("/results/".length);
            this.router.navTo("p_overview",{
              query:{
                "id":encodeURIComponent(id),
                "index":parseInt(index)
              }
            })
          },
          loaderOff:function(oEvent){
            this.table?.setBusy();
        }

    });
})