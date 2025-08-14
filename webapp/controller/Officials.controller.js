sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/utils/General",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device"
],(Controller,
    JSONModel,
    General,
    setModel,
    Formatter,
    Device
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Officials", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("manager_page");
            this.component =this.getOwnerComponent();

            this.table =this.byId("table_manager");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model_officials =this.component.getModel();

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

                    setModel.configureModel.call(this,"Employees.json");
                    let officials_json_data =this.model_officials.getJSON();
                    General.parseManager(officials_json_data['results']).then((managers)=>{
                           
                    });
                }.bind(this)
            });
            // set event

            // fetch data from 0-data/v2
            
            // this.component._bshow(100); 
            this.table.setBusy(true);           
            this.model_data.read("/Shippers",
                {
                    urlParameters: {
                        "$skip": 0,
                    },
                    success:function (oData) {
                        const results =oData["results"];
                        console.log(results);
                        // const managers =General.parseManager(results).then((managers)=>{
                        //     this.MSJson = new JSONModel();
                        //     this.MSJson.setData({"results":managers});
                        //     this.getView().setModel(this.MSJson);
                        //     this.table.setBusy();
                            // console.log(this.getView().getModel());
                            // console.log(this.table.getItems());
                            // this.table.bindItems("{/results}");
                            // this.table.invalidate();
                        // });
                        
                        // this.table.bindElement("/results");
                        // console.log(this.MSJson.getJSON());

                    }.bind(this),
                    error:function(oError){
                        console.log(oError);
                        // this.component._bhide();
                        this.table.setBusy();
                    }.bind(this)
                }
            )

            
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
       overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext();
            // console.log(oContext);
            const id =oContext.getProperty("EmployeeID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("OfficialsOverview");
          },
    });
})