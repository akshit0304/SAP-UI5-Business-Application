sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
], (BaseController, Formatter, setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.TerritoriesOverview", {
        formatter: Formatter,
        onInit: function () {

            this.main_page = this.byId("territory_overview");
            // this.main_page.setBusy(true);
            this.component = this.getOwnerComponent();
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();

            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                    setModel.configureModel2.call(this, "Territories.json").then(()=>{
                    let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id = ['t_dynamicPageTitle','territory_overview','head_panel'];
                    for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                    }
                    this.component._buttonExpandLogic(1, 0);
                    let id =this.byId("info_head_person").getBindingContext().getProperty("EmployeeID");
                    if(!id){
                        this.byId("head_panel").setVisible(false);
                    }
                    else{this.byId("head_panel").setVisible();}

                });
                }.bind(this),
            });
        },
        detailPress:function(oEvent){
            let id = oEvent.getParameter("id").split('--');
            // console.log(typeof id);
            if(id.at(-1)=="more"){
                let id =this.byId("info_head_person").getBindingContext().getProperty("EmployeeID");
                 this.oNavContainer.setBusy(true);
                this.component.second_binding=true;
                // set id in nav model in idOfBindElementSecond
                this.model.setProperty("/idOfBindElementSecond",id);
                this.root_element.getController()._loadView("EmployeesOverview");
            } 
        }


    });
});