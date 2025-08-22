sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel",
    "sap/ui/Device"
    
],(Controller,
    JSONModel,
    Formatter,
    setModel,
    Device
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Products", {
        formatter:Formatter,
        onInit() {
            console.log("product initialized");
            this.component = this.getOwnerComponent();
            this.main_page =this.byId("product_page");
            this.root_element =this.component.byId("App");
            this.table =this.byId("table_product");
            this.oNavContainer = this.component.byId("App--navContainer");
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            this.getView().addEventDelegate({
                onBeforeShow:function(obj){
                    this.component._buttonExpandLogic(1, 1);
                    setModel.configureModel.call(this,"Products.json");
                    // console.log(obj.data);
                    this.oNavContainer.setBusy();
                    

                }.bind(this)
            })
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext_path = oEvent.getSource().getBindingContext().getPath();
            // console.log(oContext);
            // const path =oContext.substr("/results/".length);
            // console.log(path);
            // const id =oContext.getProperty("ProductID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext_path);
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