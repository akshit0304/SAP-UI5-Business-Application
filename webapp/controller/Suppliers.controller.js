sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "bd/businessportal/utils/setModel",
    
],(Controller,
    JSONModel,
    Formatter,
    Device,
    setModel
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
                    setModel.configureModel.call(this,"Suppliers.json");
                }.bind(this)
            });

        },
        onExit(){
            console.log("dashboard exit");
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext().getPath();
            // console.log(oContext);
            // const id =oContext.getProperty("SupplierID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("SuppliersOverview");
          },
    

    });
})