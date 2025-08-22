sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    'sap/ui/core/BusyIndicator'
],(Controller,
    JSONModel,
    Formatter,
    Device,
    BusyIndicator
)=>{
    "use strict"
     const oData = {
        customers: [
          { customerName: "Customer A", orderAmount: 1200 },
          { customerName: "Customer B", orderAmount: 950 },
          { customerName: "Customer C", orderAmount: 875 },
          { customerName: "Customer D", orderAmount: 600 },
          { customerName: "Customer E", orderAmount: 450 }
        ]
      };
    return Controller.extend("bd.businessportal.controller.Dashboard", {
        formatter:Formatter,
        onInit() {
            console.log('Dashboard page is loaded');
            // this.main_page =this.byId("");
            this.component =this.getOwnerComponent();
            // console.log(this.component);
            this.main_page =this.byId("dashboard_container");
            this.oNavContainer = this.component.byId("App--navContainer");

            const oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel);
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                }
              },this);

            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    // before show
                    this.component._buttonExpandLogic(1,1);
                }.bind(this)
            });
        },
        onAfterRendering:function () {
            BusyIndicator.hide();
        },
        onExit(){
            console.log("dashboard exit");
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },

    });
})