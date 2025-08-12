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
            console.log("product initialized");
            // console.log(this.getView().getControllerName());
            this.component = this.getOwnerComponent();
            this.main_page =this.byId("product_page");
            this.root_element =this.component.byId("App");
            // console.log(this.component);
            // console.log(this.main_page.getParent().getParent());
            // this.router =this.component.getRouter();
            this.table =this.byId("table_product");
            this.oNavContainer = this.component.byId("App--navContainer");
            // console.log(this.oNavContainer);
            // console.log(this.byId("navContainer"));
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
                    success:function (oData){
                        const results =oData["results"];
                            let MSJson = new JSONModel();
                            MSJson.setData({"results":results});
                            this.getView().setModel(MSJson,'PD');
                            this.table.setBusy();
                    }.bind(this),
                    error:function(oError){
                        console.log(oError);
                        this.table.setBusy(false);
                    }.bind(this)
                }
            )
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext("PD");
            // console.log(oContext);
            const id =oContext.getProperty("ProductID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("ProductsOverview");
            // this.router.navTo("p_overview",{
            //   query:{
            //     "id":encodeURIComponent(id),
            //     "index":parseInt(index)
            //   }
            // })
          },
    });
})