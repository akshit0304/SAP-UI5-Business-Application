sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device"
],(Controller,
    Formatter,
    Device
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Shippers", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("shipper_page");
            this.component =this.getOwnerComponent();
            this.table =this.byId("table_shipper");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                }.bind(this)
            });
            // set event
            // sap.ui.getCore().getEventBus().subscribe("product_loading", "myEvent",this.loaderOff,this);

            // fetch data from 0-data/v2
            // this.model_data =this.component.getModel("MS");
            // this.component._bshow(100); 
            // this.table.setBusy(true);   
        },
        
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext("MD");
            // console.log(oContext);
            const id =oContext.getProperty("ShipperID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("ShippersOverview");
            // this.router.navTo("p_overview",{
            //   query:{
            //     "id":encodeURIComponent(id),
            //     "index":parseInt(index)
            //   }
            // })
          },
    });
})